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

    [HttpPost("Signup")]
    public async Task<IActionResult> Signup(UserDto userDto)
    {
        if (userDto.UserName == null || userDto.Email == null || userDto.Password == null || userDto.FirstName == null || userDto.Role == null)
        {
            return BadRequest(AuthErrors.SignupDataMissing);
        }

        var query = from r in _db.Roles
                    where r.Name == userDto.Role
                    select r;
        
        var cnt = await query.CountAsync();
        if (cnt == 0)
        {
            return BadRequest(AuthErrors.InvalidRole);
        }

        if(cnt > 1)
        {
            throw new Exception(ExceptionErrors.CorruptRoleData);
        }

        var role = await query.FirstAsync();

        var user = new User
        {
            UserName = userDto.UserName,
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
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        if ((loginDto.UserName == null && loginDto.Email == null) || loginDto.Password == null)
        {
            return BadRequest(AuthErrors.LoginDataMissing);
        }
        
        var query = from u in _db.Users.Include(u => u.Role) // Include is necessary, otherwise the Role property will be null
                    where u.RoleId == u.Role.Id
                    join r in _db.Roles on u.RoleId equals r.Id
                    where u.UserName == loginDto.UserName || u.Email == loginDto.Email
                    select u;
        
        var cnt = await query.CountAsync();
        if (cnt == 0)
        {
            return Unauthorized(AuthErrors.InvalidUserNameOrEmail);
        }
        
        var user = await query.FirstAsync();
        if (cnt > 1 || (user.UserName == null && user.Email == null) || user.Password == null)
        {
            throw new Exception(ExceptionErrors.CorruptUserData);
        }

        var pwdHasher = new PasswordHasher<User>();
        var authResult = pwdHasher.VerifyHashedPassword(user, user.Password, loginDto.Password);

        if (authResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized(AuthErrors.InvalidUserNameOrEmail);
        }

        var token = GenerateJwtToken(user, user.Role);

        return Ok(new { Token = token });
    }

    private string GenerateJwtToken(User user, Role role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

        var claims = new List<Claim>
        {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
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