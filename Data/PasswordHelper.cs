using Microsoft.AspNetCore.Identity;

namespace DetailsNetworks.Data
{
    public static class PasswordHelper
    {
        public static string HashPassword(string plainPassword)
        {
            var hasher = new PasswordHasher<object>();
            return hasher.HashPassword(null, plainPassword);
        }
    }

}
