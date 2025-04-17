using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Backend.Data;
using Backend.Models;   

namespace Backend.Controllers;

[Route("[controller]")]
[ApiController]
public class DataController : ControllerBase
{
    private readonly DatabaseContext _db;

    public DataController(DatabaseContext context)
    {
        _db = context;
    }

    // GET: /Data
    [HttpGet]
    public async Task<ActionResult<List<Datum>>> GetAll()
    {
        var query = from d in _db.Data
                    select d;
        
        return Ok(await query.ToListAsync());
    }

    // GET: /Data/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Datum>> Get(int id)
    {
        var query = from d in _db.Data
                    where d.Id == id
                    select d;
        
        var result = await query.ToListAsync();

        if (result.Count == 0)
        {
            return NotFound();
        }
        else if (result.Count > 1)
        {
            return new ObjectResult(new
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Message = "Multiple records found with the same ID."
                });
        }

        return Ok(result[0]);
    }

    // POST: /Data
    [HttpPost]
    public async Task<ActionResult> Create(Datum datum)
    {
        _db.Data.Add(datum);
        await _db.SaveChangesAsync();
        
        var id = new { Id = datum.Id };
        return CreatedAtAction(nameof(Get), id, id);
    }
    
    // POST: /Data/Bulk
    [HttpPost("Bulk")]
    public async Task<ActionResult> CreateBulk(List<Datum> data)
    {
        if (data == null || data.Count == 0)
        {
            return BadRequest("No data provided.");
        }

        _db.Data.AddRange(data);
        await _db.SaveChangesAsync();

        var count = new { Count = data.Count };
        return CreatedAtAction(nameof(GetAll), count, count);
    }

    // PUT: /Data
    [HttpPut]
    public async Task<ActionResult> Update(Datum datum)
    {
        if (!_db.Data.Any(e => e.Id == datum.Id))
        {
            return NotFound();
        }

        _db.Entry(datum).State = EntityState.Modified;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /Data/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var datum = await _db.Data.FindAsync(id);

        if (datum == null)
        {
            return NotFound();
        }

        _db.Data.Remove(datum);
        await _db.SaveChangesAsync();

        return NoContent();
    }
    
    // DELETE: /Data/ByIds
    [HttpDelete("ByIds")]
    public async Task<IActionResult> DeleteByIds(List<int> ids)
    {
        if (ids == null || ids.Count == 0)
        {
            return BadRequest("No IDs provided.");
        }

        var dataToDelete = await _db.Data.Where(d => ids.Contains(d.Id)).ToListAsync();

        if (dataToDelete.Count == 0)
        {
            return NotFound();
        }

        _db.Data.RemoveRange(dataToDelete);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /Data/All
    [HttpDelete("All")]
    public async Task<IActionResult> DeleteAll()
    {
        var dataToDelete = await _db.Data.ToListAsync();

        if (dataToDelete.Count == 0)
        {
            return NotFound();
        }

        _db.Data.RemoveRange(dataToDelete);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}