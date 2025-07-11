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


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
