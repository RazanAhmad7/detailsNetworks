using DetailsNetworks.Data;
using DetailsNetworks.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace DetailsNetworks.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppDbContext _context;

        public HomeController(ILogger<HomeController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public async Task<IActionResult> Submit([FromBody] ContactMessage model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            _context.ContactMessages.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thank you, your message has been received successfully!" });
        }

        [HttpPost]
        public IActionResult SubmitReview([FromBody] CustomerReview review)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Please complete all required fields correctly." });
            }

            review.ReviewDate = DateTime.UtcNow;
            _context.CustomerReviews.Add(review);
            _context.SaveChanges();

            return Ok(new { message = "Thank you for your review!" });
        }

        public IActionResult GetCustomerReviews()
        {
            var reviews = _context.CustomerReviews
                .OrderByDescending(r => r.ReviewDate)
                .Select(r => new
                {
                    r.Rating,
                    r.Text,
                    r.ReviewerName,
                    ReviewDate = r.ReviewDate.ToString("MMMM dd") // مثل "June 10"
                })
                .ToList();

            return Json(reviews);
        }

    }
}
