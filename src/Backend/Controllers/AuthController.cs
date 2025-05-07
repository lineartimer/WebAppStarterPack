using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using Backend.Configurations;
using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Route("[controller]")]
[ApiController]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly DatabaseContext _db;
    private readonly JwtConfig _jwtSettings;

    public AuthController(DatabaseContext context, JwtConfig jwtSettings)
    {
        _db = context;
        _jwtSettings = jwtSettings;
    }

    [HttpPost("SignUp")]
    public async Task<IActionResult> SignUp(UserDto userDto)
    {
        if (userDto.Username == null || userDto.Email == null || userDto.Password == null || userDto.FirstName == null || userDto.Role == null)
        {
            return BadRequest(new { Message = ResponseMessages.SignupDataMissing });
        }

        var query = from r in _db.Roles
                    where r.Name == userDto.Role
                    select r;
        
        var cnt = await query.CountAsync();
        if (cnt == 0)
        {
            return BadRequest(new { Message = ResponseMessages.InvalidRole });
        }

        if(cnt > 1)
        {
            throw new Exception(ExceptionErrors.CorruptRoleData);
        }

        var role = await query.FirstAsync();

        var user = new User
        {
            Username = userDto.Username,
            Email = userDto.Email,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Role = role
        };

        var pwdHasher = new PasswordHasher<User>();
        user.Password = pwdHasher.HashPassword(user, userDto.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login(CredentialDto loginDto)
    {
        if ((loginDto.Username == null && loginDto.Email == null) || loginDto.Password == null)
        {
            return BadRequest(new { Message = ResponseMessages.LoginDataMissing });
        }
        
        var query = from u in _db.Users.Include(u => u.Role) // Include is necessary, otherwise the Role property will be null
                    where u.RoleId == u.Role.Id
                    join r in _db.Roles on u.RoleId equals r.Id
                    where u.Username == loginDto.Username || u.Email == loginDto.Email
                    select u;
        
        var cnt = await query.CountAsync();
        if (cnt == 0)
        {
            return Unauthorized(new { Message = ResponseMessages.InvalidUserNameEmailOrPassword });
        }
        
        var user = await query.FirstAsync();
        if (cnt > 1 || (user.Username == null && user.Email == null) || user.Password == null)
        {
            throw new Exception(ExceptionErrors.CorruptUserData);
        }

        var pwdHasher = new PasswordHasher<User>();
        var authResult = pwdHasher.VerifyHashedPassword(user, user.Password, loginDto.Password);

        if (authResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { Message = ResponseMessages.InvalidUserNameEmailOrPassword });
        }

        var token = GenerateJwtToken(user, user.Role);

        // Put token in a secure, HTTP-only cookie
        HttpContext.Response.Cookies.Append("AuthToken", token, new CookieOptions
        {
            HttpOnly = true, // Can't be accessed by JavaScript on the cilent side
            Secure = true, // Only sent over secure connections (HTTPS)
            SameSite = SameSiteMode.None, // No cross-site requests
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok();

        // return Ok(new { Token = token });
    }

    private string GenerateJwtToken(User user, Role role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

        var claims = new List<Claim>
        {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, role.Name)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}