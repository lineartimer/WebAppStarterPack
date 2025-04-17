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
            return Ok(new { Message = "This is only for admins." });
        }
    }
}
