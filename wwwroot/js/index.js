

class ReviewSlider {
    constructor() {
        this.container = document.getElementById('reviewsContainer');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('indicators');
        this.slides = this.container.querySelectorAll('.review-slide');
        this.currentIndex = 0;
        this.maxIndex = this.slides.length - 1;
        // Hide navigation if only one slide
        if (this.slides.length <= 1) {
            this.prevBtn.classList.add('hidden');
            this.nextBtn.classList.add('hidden');
            return;
        }
        this.init();
    }

    init() {
        this.createIndicators();
        this.updateSlider();
        this.bindEvents();
    }

    createIndicators() {
        // Don't create indicators if only one slide
        if (this.slides.length <= 1) {
            this.indicatorsContainer.style.display = 'none';
            return;
        }
        this.indicatorsContainer.style.display = 'flex';
        this.indicatorsContainer.innerHTML = '';

        for (let i = 0; i < this.slides.length; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    updateSlider() {
        const translateX = -this.currentIndex * 100;
        this.container.style.transform = `translateX(${translateX}%)`;

        // Update navigation buttons
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.maxIndex;

        // Update indicators
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(slideIndex) {
        this.currentIndex = Math.max(0, Math.min(slideIndex, this.maxIndex));
        this.updateSlider();
    }

    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateSlider();
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
        }
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Touch/swipe support
        let startX = 0;
        let endX = 0;

        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReviewSlider();
});






// for submitting the contact form
// Initialize the Bootstrap toast instance
const toastElement = document.getElementById('liveToast');
const toast = new bootstrap.Toast(toastElement);

document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = {
        name: form.name.value,
        companyName: form.companyName.value,
        email: form.email.value,
        phoneNumber: form.phoneNumber.value,
        message: form.message.value
    };

    try {
        const response = await fetch("/Home/Submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        // Update toast message and show it
        document.getElementById("toastBody").textContent = result.message;
        toastElement.classList.remove('bg-danger'); // reset error styling if any
        toastElement.classList.add('bg-primary');   // add success styling
        toast.show();

        form.reset();
    } catch (err) {
        document.getElementById("toastBody").textContent = "Error sending message.";
        toastElement.classList.remove('bg-primary');
        toastElement.classList.add('bg-danger'); // add error styling
        toast.show();
    }
});




// the modal for rating
// Star Rating Functionality
document.addEventListener('DOMContentLoaded', function () {
    const starRating = document.getElementById('starRating');
    const stars = starRating.querySelectorAll('i');
    const ratingInput = document.getElementById('reviewRating');

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            ratingInput.value = rating;
            updateStars(rating);
        });

        star.addEventListener('mouseenter', () => {
            updateStars(index + 1);
        });
    });

    starRating.addEventListener('mouseleave', () => {
        updateStars(ratingInput.value);
    });

    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
});


// FAQ
function toggleCategory(header) {
    const category = header.parentElement;
    const isActive = category.classList.contains('active');

    // Close all categories
    document.querySelectorAll('.faq-category').forEach(cat => {
        cat.classList.remove('active');
    });

    // If this category wasn't active, open it
    if (!isActive) {
        category.classList.add('active');
    }
}

function toggleFAQ(question) {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items in the same category
    const category = faqItem.closest('.faq-category');
    category.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // If this item wasn't active, open it
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Close FAQ items when category is closed
document.querySelectorAll('.faq-category-header').forEach(header => {
    header.addEventListener('click', function () {
        const category = this.parentElement;
        if (!category.classList.contains('active')) {
            category.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
});