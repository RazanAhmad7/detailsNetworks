using DetailsNetworks.Data;
using DetailsNetworks.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register PasswordHasher
builder.Services.AddScoped<IPasswordHasher<AdminUser>, PasswordHasher<AdminUser>>();


// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();



// Migrate DB and Seed admin user ONCE
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = services.GetRequiredService<AppDbContext>();
    var hasher = services.GetRequiredService<IPasswordHasher<AdminUser>>();

    db.Database.Migrate();

    if (!db.AdminUsers.Any())
    {
        var admin = new AdminUser
        {
            Username = "admin",     
        };

        admin.PasswordHash = hasher.HashPassword(admin, "admin123");

        db.AdminUsers.Add(admin);
        db.SaveChanges();
    }
}
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
