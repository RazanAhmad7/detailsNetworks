using DetailsNetworks.Models;
using Microsoft.EntityFrameworkCore;

namespace DetailsNetworks.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<AdminUser> AdminUsers { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<CustomerReview> CustomerReviews { get; set; }



    }



}
