using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Extensions;
using Selu383.SP26.Api.Features.Payments;

namespace Selu383.SP26.Api.Controllers;

[Route("api/payment-methods")]
[ApiController]
[Authorize]
public class PaymentMethodsController(DataContext dataContext) : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<SavedPaymentMethodDto>> GetMyPaymentMethods()
    {
        var userId = User.GetCurrentUserId();

        var methods = dataContext.Set<SavedPaymentMethod>()
            .Where(x => x.UserId == userId)
            .Select(x => new SavedPaymentMethodDto
            {
                Id = x.Id,
                CardholderName = x.CardholderName,
                CardLast4 = x.CardLast4,
                CardType = x.CardType,
                ExpiryMonth = x.ExpiryMonth,
                ExpiryYear = x.ExpiryYear,
                IsDefault = x.IsDefault,
            })
            .ToList();

        return Ok(methods);
    }

    [HttpGet("{id}")]
    public ActionResult<SavedPaymentMethodDto> GetById(int id)
    {
        var userId = User.GetCurrentUserId();

        var method = dataContext.Set<SavedPaymentMethod>()
            .FirstOrDefault(x => x.Id == id && x.UserId == userId);

        if (method == null)
        {
            return NotFound();
        }

        return Ok(new SavedPaymentMethodDto
        {
            Id = method.Id,
            CardholderName = method.CardholderName,
            CardLast4 = method.CardLast4,
            CardType = method.CardType,
            ExpiryMonth = method.ExpiryMonth,
            ExpiryYear = method.ExpiryYear,
            IsDefault = method.IsDefault,
        });
    }

    [HttpPost]
    public ActionResult<SavedPaymentMethodDto> Create(SavedPaymentMethodDto dto)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        // If this is set as default, clear the existing default first
        if (dto.IsDefault)
        {
            var existingDefault = dataContext.Set<SavedPaymentMethod>()
                .Where(x => x.UserId == userId && x.IsDefault)
                .ToList();

            foreach (var existing in existingDefault)
            {
                existing.IsDefault = false;
            }
        }

        var method = new SavedPaymentMethod
        {
            UserId = userId.Value,
            CardholderName = dto.CardholderName,
            CardLast4 = dto.CardLast4,
            CardType = dto.CardType,
            ExpiryMonth = dto.ExpiryMonth,
            ExpiryYear = dto.ExpiryYear,
            IsDefault = dto.IsDefault,
        };

        dataContext.Set<SavedPaymentMethod>().Add(method);
        dataContext.SaveChanges();

        dto.Id = method.Id;

        return CreatedAtAction(nameof(GetById), new { id = method.Id }, dto);
    }

    [HttpPut("{id}")]
    public ActionResult<SavedPaymentMethodDto> Update(int id, SavedPaymentMethodDto dto)
    {
        var userId = User.GetCurrentUserId();

        var method = dataContext.Set<SavedPaymentMethod>()
            .FirstOrDefault(x => x.Id == id && x.UserId == userId);

        if (method == null)
        {
            return NotFound();
        }

        // If setting as default, clear old default
        if (dto.IsDefault && !method.IsDefault)
        {
            var existingDefault = dataContext.Set<SavedPaymentMethod>()
                .Where(x => x.UserId == userId && x.IsDefault && x.Id != id)
                .ToList();

            foreach (var existing in existingDefault)
            {
                existing.IsDefault = false;
            }
        }

        method.CardholderName = dto.CardholderName;
        method.CardLast4 = dto.CardLast4;
        method.CardType = dto.CardType;
        method.ExpiryMonth = dto.ExpiryMonth;
        method.ExpiryYear = dto.ExpiryYear;
        method.IsDefault = dto.IsDefault;

        dataContext.SaveChanges();

        dto.Id = method.Id;

        return Ok(dto);
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var userId = User.GetCurrentUserId();

        var method = dataContext.Set<SavedPaymentMethod>()
            .FirstOrDefault(x => x.Id == id && x.UserId == userId);

        if (method == null)
        {
            return NotFound();
        }

        dataContext.Set<SavedPaymentMethod>().Remove(method);
        dataContext.SaveChanges();

        return Ok();
    }
}
