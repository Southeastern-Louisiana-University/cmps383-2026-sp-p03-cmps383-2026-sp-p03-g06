using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Extensions;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Locations;

namespace Selu383.SP26.Api.Controllers;

[Route("api/locations")]
[ApiController]
public class LocationsController(DataContext dataContext) : ControllerBase
{
    [HttpGet]
    public IQueryable<LocationDto> GetAll()
    {
        return dataContext.Set<Location>()
            .Select(x => new LocationDto
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address,
                TableCount = x.TableCount,
                ManagerId = x.ManagerId,
                HoursOfOperation = x.HoursOfOperation,
                Latitude = x.Latitude,
                Longitude = x.Longitude
            });
    }

    [HttpGet("{id}")]
    public ActionResult<LocationDto> GetById(int id)
    {
        var result = dataContext.Set<Location>()
            .FirstOrDefault(x => x.Id == id);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(new LocationDto
        {
            Id = result.Id,
            Name = result.Name,
            Address = result.Address,
            TableCount = result.TableCount,
            ManagerId = result.ManagerId,
            HoursOfOperation = result.HoursOfOperation,
            Latitude = result.Latitude,
            Longitude = result.Longitude
        });
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<LocationDto> Create(LocationDto dto)
    {
        if (dto.TableCount < 1)
        {
            return BadRequest();
        }

        var location = new Location
        {
            Name = dto.Name,
            Address = dto.Address,
            TableCount = dto.TableCount,
            ManagerId = dto.ManagerId,
            HoursOfOperation = dto.HoursOfOperation,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude
        };

        dataContext.Set<Location>().Add(location);
        dataContext.SaveChanges();

        dto.Id = location.Id;

        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    [HttpPut("{id}")]
    [Authorize]
    public ActionResult<LocationDto> Update(int id, LocationDto dto)
    {
        if (dto.TableCount < 1)
        {
            return BadRequest();
        }

        var location = dataContext.Set<Location>()
            .FirstOrDefault(x => x.Id == id);

        if (location == null)
        {
            return NotFound();
        }

        if (!User.IsInRole(RoleNames.Admin) && User.GetCurrentUserId() != location.ManagerId)
        {
            return Forbid();
        }

        location.Name = dto.Name;
        location.Address = dto.Address;
        location.TableCount = dto.TableCount;
        location.ManagerId = dto.ManagerId;
        location.HoursOfOperation = dto.HoursOfOperation;
        location.Latitude = dto.Latitude;
        location.Longitude = dto.Longitude;

        dataContext.SaveChanges();

        dto.Id = location.Id;

        return Ok(dto);
    }

    [HttpGet("{id}/pickup-times")]
    public ActionResult<IEnumerable<PickupTimeDto>> GetPickupTimes(int id)
    {
        var location = dataContext.Set<Location>()
            .FirstOrDefault(x => x.Id == id);

        if (location == null)
        {
            return NotFound();
        }

        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("America/Chicago");
        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZone);

        var slots = new List<PickupTimeDto>();

        // ASAP slot — ready in 15 minutes
        var asapTime = now.AddMinutes(15);
        slots.Add(new PickupTimeDto
        {
            Label = "ASAP (~15 min)",
            Time = asapTime,
            IsAsap = true,
        });

        // Scheduled slots every 15 minutes for the next 3 hours
        var slotStart = now.AddMinutes(30);
        var minutesToAdd = (15 - slotStart.Minute % 15) % 15;
        slotStart = slotStart.AddMinutes(minutesToAdd);

        slotStart = new DateTime(
            slotStart.Year,
            slotStart.Month,
            slotStart.Day,
            slotStart.Hour,
            slotStart.Minute,
            0
        );

        for (int i = 0; i < 12; i++)
        {
            var slotTime = slotStart.AddMinutes(i * 15);

            slots.Add(new PickupTimeDto
            {
                Label = slotTime.ToString("h:mm tt"),
                Time = slotTime,
                IsAsap = false,
            });
        }


        return Ok(slots);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public ActionResult Delete(int id)
    {
        var location = dataContext.Set<Location>()
            .FirstOrDefault(x => x.Id == id);

        if (location == null)
        {
            return NotFound();
        }

        if (!User.IsInRole(RoleNames.Admin) && User.GetCurrentUserId() != location.ManagerId)
        {
            return Forbid();
        }

        dataContext.Set<Location>().Remove(location);
        dataContext.SaveChanges();

        return Ok();
    }
}
