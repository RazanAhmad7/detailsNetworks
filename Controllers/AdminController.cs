using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using DetailsNetworks.Data;
using DetailsNetworks.ViewModels;
using System.Security.Cryptography;

namespace DetailsNetworks.Controllers
{
    public class AdminController : Controller
    {

        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var reviews = await _context.CustomerReviews.OrderByDescending(r => r.ReviewDate).ToListAsync();
            var messages = await _context.ContactMessages.OrderByDescending(m => m.SubmittedAt).ToListAsync();
            var vm = new AdminDashboardViewModel
            {
                CustomerReviews = reviews,
                ContactMessages = messages
            };
            return View(vm);
        }
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _context.AdminUsers.FirstOrDefault(u => u.Username == model.Username);
                if (user != null)
                {
                    // Create the identity
                    var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, "Admin")
            };

                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    var authProperties = new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTimeOffset.UtcNow.AddHours(2) // Set cookie expiration time
                    };

                    // Sign in the user
                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity),
                        authProperties);

                    return RedirectToAction("Index", "Admin");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Username or password is incorrect.");
                }
            }
            return View(model);
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Login");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Approve(int id)
        {
            var review = await _context.CustomerReviews.FindAsync(id);
            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            review.Status = "Approved"; // or: review.IsApproved = true;
            await _context.SaveChangesAsync();

            return Json(new { success = true });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Reject(int id)
        {
            var review = await _context.CustomerReviews.FindAsync(id);
            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            review.Status = "Rejected"; // or: review.IsApproved = true;
            await _context.SaveChangesAsync();

            return Json(new { success = true });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var review = await _context.CustomerReviews.FindAsync(id);
            if (review == null)
                return NotFound();

            // Toggle logic
            if (review.Status == "Rejected")
                review.Status = "Approved";
            else if (review.Status == "Approved")
                review.Status = "Rejected";

            await _context.SaveChangesAsync();

            return Json(new { status = review.Status });
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteContact(int id)
        {
            var msg = _context.ContactMessages.Find(id);
            if (msg == null)
                return NotFound();

            _context.ContactMessages.Remove(msg);
            _context.SaveChanges();

            return Ok();
        }


    }
}
