using System.Collections.Generic;
using DetailsNetworks.Models;

namespace DetailsNetworks.ViewModels
{
    public class AdminDashboardViewModel
    {
        public List<CustomerReview> CustomerReviews { get; set; }
        public List<ContactMessage> ContactMessages { get; set; }
    }
}