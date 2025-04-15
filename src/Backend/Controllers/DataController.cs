using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[Route("[controller]")]
[ApiController]
public class DataController : ControllerBase
{
    private readonly DataContext _context;

    public DataController(DataContext context)
    {
        _context = context;
    }

    // GET: /Data
    [HttpGet]
    public async Task<ActionResult<List<Datum>>> GetAll()
    {
        var query = from d in _context.Data
                    select d;
        
        return Ok(await query.ToListAsync());
    }

    // GET: /Data/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Datum>> Get(int id)
    {
        var query = from d in _context.Data
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
        _context.Data.Add(datum);
        await _context.SaveChangesAsync();
        
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

        _context.Data.AddRange(data);
        await _context.SaveChangesAsync();

        var count = new { Count = data.Count };
        return CreatedAtAction(nameof(GetAll), count, count);
    }

    // PUT: /Data
    [HttpPut]
    public async Task<ActionResult> Update(Datum datum)
    {
        if (!_context.Data.Any(e => e.Id == datum.Id))
        {
            return NotFound();
        }

        _context.Entry(datum).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /Data/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var datum = await _context.Data.FindAsync(id);

        if (datum == null)
        {
            return NotFound();
        }

        _context.Data.Remove(datum);
        await _context.SaveChangesAsync();

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

        var dataToDelete = await _context.Data.Where(d => ids.Contains(d.Id)).ToListAsync();

        if (dataToDelete.Count == 0)
        {
            return NotFound();
        }

        _context.Data.RemoveRange(dataToDelete);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /Data/All
    [HttpDelete("All")]
    public async Task<IActionResult> DeleteAll()
    {
        var dataToDelete = await _context.Data.ToListAsync();

        if (dataToDelete.Count == 0)
        {
            return NotFound();
        }

        _context.Data.RemoveRange(dataToDelete);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}