using System.ComponentModel.DataAnnotations;

namespace DetailsNetworks.Models
{
    public class AdminUser
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

    }

}
