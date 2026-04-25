using Microsoft.AspNetCore.Mvc;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Features.Orders;
using Stripe;

namespace Selu383.SP26.Api.Controllers;

[Route("api/payments")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly DataContext _dataContext;
    private readonly IConfiguration _configuration;

    public PaymentsController(DataContext dataContext, IConfiguration configuration)
    {
        _dataContext = dataContext;
        _configuration = configuration;

        StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
    }

    [HttpPost("create-payment-sheet")]
    public ActionResult CreatePaymentSheet(CreateGuestOrderDto dto)
    {
        if (dto.LocationId <= 0)
        {
            return BadRequest("Valid LocationId is required");
        }

        if (dto.OrderItems == null || !dto.OrderItems.Any())
        {
            return BadRequest("Order must contain at least one item");
        }

        decimal orderTotal = decimal.Zero;

        foreach (var itemDto in dto.OrderItems)
        {
            if (itemDto.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than 0");
            }

            var menuItem = _dataContext.Set<Selu383.SP26.Api.Features.MenuItem.MenuItem>()
                .FirstOrDefault(x => x.Id == itemDto.MenuItemId);

            if (menuItem == null)
            {
                return BadRequest($"Menu item {itemDto.MenuItemId} does not exist");
            }

            orderTotal += menuItem.Price * itemDto.Quantity;
        }

        // Stripe uses the smallest currency unit, so USD must be in cents
        var amountInCents = (long)(orderTotal * 100);

        var customerService = new CustomerService();
        var customer = customerService.Create(new CustomerCreateOptions
        {
            Name = $"{dto.CheckoutFirstName} {dto.CheckoutLastName}".Trim(),
            Email = dto.CheckoutEmail,
            Phone = dto.CheckoutPhoneNumber
        });

        var ephemeralKeyService = new EphemeralKeyService();
        var ephemeralKey = ephemeralKeyService.Create(new EphemeralKeyCreateOptions
        {
            Customer = customer.Id,
            StripeVersion = "2025-09-30.clover"
        });

        var paymentIntentService = new PaymentIntentService();
        var paymentIntent = paymentIntentService.Create(new PaymentIntentCreateOptions
        {
            Amount = amountInCents,
            Currency = "usd",
            Customer = customer.Id,
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true
            },
            Metadata = new Dictionary<string, string>
            {
                { "locationId", dto.LocationId.ToString() },
                { "checkoutEmail", dto.CheckoutEmail }
            }
        });

        return Ok(new
        {
            paymentIntent = paymentIntent.ClientSecret,
            ephemeralKey = ephemeralKey.Secret,
            customer = customer.Id,
            publishableKey = _configuration["Stripe:PublishableKey"]
        });
    }
}