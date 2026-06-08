using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SecurePortal.Data;
using SecurePortal.DTOs;
using SecurePortal.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

//Testing pipelines

//Testing piplines presentation
namespace SecurePortal.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }


        [HttpPost("register")]
        public IActionResult Register(RegisterDto dto)
        {
            // Normalize email (VERY IMPORTANT)
            var email = dto.Email.Trim().ToLower();

            // Check if user exists
            var exists = _context.Users.Any(x => x.Email == email);

            if (exists)
            {
                return BadRequest(new
                {
                    message = "User already exists"
                });
            }

            // Create user
            var user = new User
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new
            {
                message = "User registered successfully"
            });
        }


        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var dbUser = _context.Users.FirstOrDefault(x => x.Email == dto.Email);

            if (dbUser == null)
                return Unauthorized("Invalid credentials");

            bool valid = BCrypt.Net.BCrypt.Verify(dto.Password, dbUser.PasswordHash);

            if (!valid)
                return Unauthorized("Invalid credentials");

            // =========================
            // JWT TOKEN
            // =========================
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
{
    new Claim("email", dto.Email),
    new Claim("userId", dbUser.Id.ToString())
};

            var token = new JwtSecurityToken(
                issuer: "SecurePortal",
                audience: "SecurePortalUsers",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }
    }
}
