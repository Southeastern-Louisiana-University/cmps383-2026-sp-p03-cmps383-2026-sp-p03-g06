using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Categories;

namespace Selu383.SP26.Api.Controllers;

[Route("api/categories")]
[ApiController]
public class CategoriesController(DataContext dataContext) : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<CategoryDto>> GetAll()
    {
        var categories = dataContext.Set<Category>()
            .Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name
            })
            .ToList();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public ActionResult<CategoryDto> GetById(int id)
    {
        var category = dataContext.Set<Category>()
            .FirstOrDefault(x => x.Id == id);

        if (category == null)
        {
            return NotFound();
        }

        return Ok(new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        });
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<CategoryDto> Create(CategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Category name is required");
        }

        var category = new Category
        {
            Name = dto.Name
        };

        dataContext.Set<Category>().Add(category);
        dataContext.SaveChanges();

        dto.Id = category.Id;

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, dto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<CategoryDto> Update(int id, CategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Category name is required");
        }

        var category = dataContext.Set<Category>()
            .FirstOrDefault(x => x.Id == id);

        if (category == null)
        {
            return NotFound();
        }

        category.Name = dto.Name;

        dataContext.SaveChanges();

        dto.Id = category.Id;

        return Ok(dto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult Delete(int id)
    {
        var category = dataContext.Set<Category>()
            .FirstOrDefault(x => x.Id == id);

        if (category == null)
        {
            return NotFound();
        }

        dataContext.Set<Category>().Remove(category);
        dataContext.SaveChanges();

        return Ok();
    }
}
