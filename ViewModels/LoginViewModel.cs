using System.ComponentModel.DataAnnotations;

namespace DetailsNetworks.ViewModels
{
    public class LoginViewModel
    {
        
            [Required(ErrorMessage = "Please enter the username")]
            public string Username { get; set; }

            [Required(ErrorMessage = "Please enter the password")]
            public string Password { get; set; }
        
    }
}
