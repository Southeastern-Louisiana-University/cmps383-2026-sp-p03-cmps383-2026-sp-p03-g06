using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.MenuItem;

namespace Selu383.SP26.Api.Controllers;

[Route("api/menu-items")]
[ApiController]
public class MenuItemsController(DataContext dataContext) : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<MenuItemDto>> GetAll(int? categoryId = null)
    {
        var query = dataContext.Set<MenuItem>()
            .AsQueryable();

        if (categoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == categoryId.Value);
        }

        var items = query
            .Select(x => new MenuItemDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                IsAvailable = x.IsAvailable,
                CategoryId = x.CategoryId
            })
            .ToList();

        return Ok(items);
    }

    [HttpGet("{id}")]
    public ActionResult<MenuItemDto> GetById(int id)
    {
        var item = dataContext.Set<MenuItem>()
            .FirstOrDefault(x => x.Id == id);

        if (item == null)
        {
            return NotFound();
        }

        return Ok(new MenuItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Description = item.Description,
            Price = item.Price,
            IsAvailable = item.IsAvailable,
            CategoryId = item.CategoryId
        });
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<MenuItemDto> Create(MenuItemDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Menu item name is required");
        }

        if (dto.Price < 0)
        {
            return BadRequest("Price cannot be negative");
        }

        if (dto.CategoryId <= 0)
        {
            return BadRequest("Valid CategoryId is required");
        }

        // Verify category exists
        var categoryExists = dataContext.Set<Features.Categories.Category>()
            .Any(x => x.Id == dto.CategoryId);

        if (!categoryExists)
        {
            return BadRequest("Category does not exist");
        }

        var item = new MenuItem
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            IsAvailable = dto.IsAvailable,
            CategoryId = dto.CategoryId
        };

        dataContext.Set<MenuItem>().Add(item);
        dataContext.SaveChanges();

        dto.Id = item.Id;

        return CreatedAtAction(nameof(GetById), new { id = item.Id }, dto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<MenuItemDto> Update(int id, MenuItemDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Menu item name is required");
        }

        if (dto.Price < 0)
        {
            return BadRequest("Price cannot be negative");
        }

        if (dto.CategoryId <= 0)
        {
            return BadRequest("Valid CategoryId is required");
        }

        var item = dataContext.Set<MenuItem>()
            .FirstOrDefault(x => x.Id == id);

        if (item == null)
        {
            return NotFound();
        }

        // Verify category exists
        var categoryExists = dataContext.Set<Features.Categories.Category>()
            .Any(x => x.Id == dto.CategoryId);

        if (!categoryExists)
        {
            return BadRequest("Category does not exist");
        }

        item.Name = dto.Name;
        item.Description = dto.Description;
        item.Price = dto.Price;
        item.IsAvailable = dto.IsAvailable;
        item.CategoryId = dto.CategoryId;

        dataContext.SaveChanges();

        dto.Id = item.Id;

        return Ok(dto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult Delete(int id)
    {
        var item = dataContext.Set<MenuItem>()
            .FirstOrDefault(x => x.Id == id);

        if (item == null)
        {
            return NotFound();
        }

        dataContext.Set<MenuItem>().Remove(item);
        dataContext.SaveChanges();

        return Ok();
    }
}
