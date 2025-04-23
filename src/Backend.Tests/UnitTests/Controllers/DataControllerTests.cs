using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Backend.Tests.Helpers;

namespace Backend.Tests.UnitTests.Controllers;

public class DataControllerTests
{
    private readonly DatabaseContext _db;
    private readonly DataController _controller;

    public DataControllerTests()
    {
        _db = DatabaseHelper.CreateInMemoryDatabaseContext();
        _controller = new DataController(_db);
    }

    [Fact]
    public async Task GetAll_ShouldReturnAllData()
    {
        var cnt = _db.Data.Count();

        var result = await _controller.GetAll();

        // Check response type
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var data = Assert.IsType<List<Datum>>(okResult.Value);

        // Check if all data has been returned
        Assert.Equal(cnt, data.Count);
    }

    [Fact]
    public async Task Get_ShouldReturnDatum_WhenIdExists()
    {
        var id = 1;
        var result = await _controller.Get(id);

        // Check response type and if id is returned
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var datum = Assert.IsType<Datum>(okResult.Value);

        Assert.Equal(id, datum.Id);
    }

    [Fact]
    public async Task Get_ShouldReturnNotFound_WhenIdDoesNotExist()
    {
        var result = await _controller.Get(4);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Create_ShouldReturnCreatedAndId()
    {
        var id = 4;
        var datum = new Datum
        {
            Id = id,
            Col1 = "Val41",
            Col2 = "Val42",
            Col3 = "Val43"
        };

        var cntBefore = _db.Data.Count();
        var result = await _controller.Create(datum);
        var cntAfter = _db.Data.Count();

        // Check if Data table has grown
        Assert.Equal(1, cntAfter - cntBefore);

        // Check response type and if id of created datum is returned
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.NotNull(createdAtActionResult.Value);

        var idProperty = createdAtActionResult.Value.GetType().GetProperty("Id");
        Assert.NotNull(idProperty);

        var returnedId = idProperty.GetValue(createdAtActionResult.Value);
        Assert.NotNull(returnedId);
        Assert.Equal(id, returnedId);
        
        // Restore data
        await DatabaseHelper.RestoreDatabase(_db);
    }

    [Fact]
    public async Task CreateBulk_ShouldReturnCreatedAndCount_WithNonEmptyList()
    {
        var datum4 = new Datum
        {
            Id = 4,
            Col1 = "Val41",
            Col2 = "Val42",
            Col3 = "Val43"
        };

        var datum5 = new Datum
        {
            Id = 5,
            Col1 = "Val51",
            Col2 = "Val52",
            Col3 = "Val53"
        };

        var list = new List<Datum>();

        list.Add(datum4);
        list.Add(datum5);

        var cntBefore = _db.Data.Count();
        var result = await _controller.CreateBulk(list);
        var cntAfter = _db.Data.Count();

        // Check if Data table has grown
        Assert.Equal(list.Count, cntAfter - cntBefore);

        // Check response type and if number of created data is returned
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.NotNull(createdAtActionResult.Value);

        var countProperty = createdAtActionResult.Value.GetType().GetProperty("Count");
        Assert.NotNull(countProperty);

        var returnedCount = countProperty.GetValue(createdAtActionResult.Value);
        Assert.NotNull(returnedCount);
        Assert.Equal(list.Count, returnedCount);

        // Restore data
        await DatabaseHelper.RestoreDatabase(_db);
    }

    [Fact]
    public async Task CreateBulk_ShouldReturnBadRequest_WithEmptyList()
    {
        var list = new List<Datum>();

        var cntBefore = _db.Data.Count();
        var result = await _controller.CreateBulk(list);
        var cntAfter = _db.Data.Count();

        // Check if Data table has remained unchanged
        Assert.Equal(cntBefore, cntAfter);

        // Check response type and if some error message is returned
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequestResult.Value);

        var messageProperty = badRequestResult.Value.GetType().GetProperty("Message");
        Assert.NotNull(messageProperty);

        var returnedMessage = messageProperty.GetValue(badRequestResult.Value)?.ToString();
        Assert.NotNull(returnedMessage);
        Assert.True(returnedMessage.Length > 0);
    }

    [Fact]
    public async Task Update_ShouldReturnNoContent_WhenDatumExists()
    {
        var datum1 = new Datum
        {
            Id = 1,
            Col1 = "Updated1",
            Col2 = "Updated2",
            Col3 = "Updated3"
        };

        var result = await _controller.Update(datum1);

        // Check repsonse type
        Assert.IsType<NoContentResult>(result);

        // Check if the update has taken place
        var query = from d in _db.Data
                    where d.Id == datum1.Id
                    select d;
                    
        var queriedDatum = (await query.ToListAsync())[0];

        Assert.Equal(datum1.Col1, queriedDatum.Col1);
        Assert.Equal(datum1.Col2, queriedDatum.Col2);
        Assert.Equal(datum1.Col3, queriedDatum.Col3);
    }

    [Fact]
    public async Task Update_ShouldReturnNotFound_WhenDatumDoesNotExist()
    {
        var datum4 = new Datum
        {
            Id = 4,
            Col1 = "Val41",
            Col2 = "Val42",
            Col3 = "Val43"
        };

        var result = await _controller.Update(datum4);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Delete_ShouldReturnNoContent_WhenIdExists()
    {
        var cntBefore = _db.Data.Count();
        var result = await _controller.Delete(1);
        var cntAfter = _db.Data.Count();

        // Check if Data table has shrunk
        Assert.Equal(1, cntBefore - cntAfter);
        
        // Check if data has been deleted
        var datum = new Datum
        {
            Id = 1,
            Col1 = "Val11",
            Col2 = "Val12",
            Col3 = "Val13"
        };

        Assert.False(_db.Data.Contains(datum));

        // Check response type
        Assert.IsType<NoContentResult>(result);

        // Restore data
        await DatabaseHelper.RestoreDatabase(_db);
    }

    [Fact]
    public async Task Delete_ShouldReturnNotFound_WhenIdDoesNotExist()
    {
        var cntBefore = _db.Data.Count();
        var result = await _controller.Delete(4);
        var cntAfter = _db.Data.Count();
        
        // Check if size of Data table remained the same
        Assert.Equal(cntBefore, cntAfter);

        // Check response type
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeleteByIds_ShouldReturnNoContent_WhenAtLeastOneIdExists()
    {
        var list = new List<int>() { 2, 3 };

        var cntBefore = _db.Data.Count();
        var result = await _controller.DeleteByIds(list);
        var cntAfter = _db.Data.Count();

        // Check if Data table has shrunk
        Assert.Equal(list.Count, cntBefore - cntAfter);
        
        // Check if data has been deleted
        var datum2 = new Datum
        {
            Id = 2,
            Col1 = "Val21",
            Col2 = "Val22",
            Col3 = "Val23"
        };

        var datum3 = new Datum
        {
            Id = 3,
            Col1 = "Val31",
            Col2 = "Val32",
            Col3 = "Val33"
        };

        Assert.False(_db.Data.Contains(datum2));
        Assert.False(_db.Data.Contains(datum3));

        // Check response type
        Assert.IsType<NoContentResult>(result);

        // Restore data
        await DatabaseHelper.RestoreDatabase(_db);
    }

    [Fact]
    public async Task DeleteByIds_ShouldReturnNotFound_WhenIdsDoNotExist()
    {
        var list = new List<int>() { 4, 5 };

        var cntBefore = _db.Data.Count();
        var result = await _controller.DeleteByIds(list);
        var cntAfter = _db.Data.Count();
        
        // Check if size of Data table remained the same
        Assert.Equal(cntBefore, cntAfter);

        // Check response type
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeleteByIds_ShouldReturnBadRequest_WithEmptyList()
    {
        var list = new List<int>();

        var cntBefore = _db.Data.Count();
        var result = await _controller.DeleteByIds(list);
        var cntAfter = _db.Data.Count();

        // Check if Data table has remained unchanged
        Assert.Equal(cntBefore, cntAfter);

        // Check response type and if some error message is returned
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.NotNull(badRequestResult.Value);

        var messageProperty = badRequestResult.Value.GetType().GetProperty("Message");
        Assert.NotNull(messageProperty);

        var returnedMessage = messageProperty.GetValue(badRequestResult.Value)?.ToString();
        Assert.NotNull(returnedMessage);
        Assert.True(returnedMessage.Length > 0);
    }

    [Fact]
    public async Task DeleteAll_ShouldReturnDeleteCount()
    {
        var result = await _controller.DeleteAll();

        // Check response type and if delete count is returned
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var messageProperty = okResult.Value.GetType().GetProperty("Count");
        Assert.NotNull(messageProperty);

        var count = messageProperty.GetValue(okResult.Value);
        Assert.NotNull(count);
        Assert.Equal(3, count);

        // Restore data
        await DatabaseHelper.RestoreDatabase(_db);
    }
}
