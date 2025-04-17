using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using Backend.Configurations;
using Backend.Data;
using Backend.Dtos;
using Backend.Models;

namespace Backend.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly DatabaseContext _db;
    private readonly JwtConfiguration _jwtSettings;

    public AuthenticationController(DatabaseContext context, JwtConfiguration jwtSettings)
    {
        _db = context;
        _jwtSettings = jwtSettings;
    }

    [HttpPost("Signup")]
    public async Task<IActionResult> Signup(UserDto userDto)
    {
        if (userDto.UserName == null || userDto.Email == null || userDto.Password == null || userDto.FirstName == null)
        {
            return BadRequest(AuthErrorMessages.SignupDataMissing);
        }

        var user = new User
        {
            UserName = userDto.UserName,
            Email = userDto.Email,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
        };

        var pwdHasher = new PasswordHasher<User>();
        user.Password = pwdHasher.HashPassword(user, userDto.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("Login")]
    public IActionResult Login(LoginDto loginDto)
    {
        if ((loginDto.UserName == null && loginDto.Email == null) || loginDto.Password == null)
        {
            return BadRequest(AuthErrorMessages.LoginDataMissing);
        }

        var query = from u in _db.Users
                    where u.UserName == loginDto.UserName || u.Email == loginDto.Email
                    select u;
        
        var queryResult = query.ToList();
        if (queryResult.Count == 0)
        {
            return Unauthorized(AuthErrorMessages.InvalidUserNameOrEmail);
        }
        
        var user = queryResult[0];
        if (queryResult.Count > 1 || (user.UserName == null && user.Email == null) || user.Password == null)
        {
            throw new Exception(ExceptionErrorMessages.CorruptUserData);
        }

        var pwdHasher = new PasswordHasher<User>();
        var authResult = pwdHasher.VerifyHashedPassword(user, user.Password, loginDto.Password);

        if (authResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized(AuthErrorMessages.InvalidUserNameOrEmail);
        }

        var token = GenerateJwtToken(user);

        return Ok(new { Token = token });
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
            Expires = DateTime.UtcNow.AddMinutes(15),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
