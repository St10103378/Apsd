using System.ComponentModel.DataAnnotations;

namespace SecurePortal.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string? Email { get; set; }

  
        public string? PasswordHash { get; set; }

     
    }
}

