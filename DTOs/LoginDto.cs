using System.ComponentModel.DataAnnotations;

namespace SecurePortal.DTOs
{
    public class LoginDto
    {
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
         ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
