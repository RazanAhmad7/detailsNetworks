using System.ComponentModel.DataAnnotations;

namespace DetailsNetworks.Models
{
    public class CustomerReview
    {
        public int Id { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; } // Number of stars (1 to 5)

        [Required]
        [MaxLength(2000)]
        public string Text { get; set; }

        [Required]
        public string ReviewerName { get; set; }

        public DateTime ReviewDate { get; set; }
    }
}
