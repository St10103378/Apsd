using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SecurePortal.Data;
using SecurePortal.DTOs;
using SecurePortal.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
            
            var exists = _context.Users.Any(x => x.Email == dto.Email);
            if (exists)
                return BadRequest("User already exists");

           
            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User registered successfully");
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