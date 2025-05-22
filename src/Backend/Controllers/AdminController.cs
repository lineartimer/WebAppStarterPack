using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        // GET: /Admin
        [HttpGet]
        public IActionResult GetAdminData()
        {
            return Ok(new { Message = "This page is for admins only." });
        }
    }
}
