

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


// loading reviews from the database: 
document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById("reviewsContainer");
    const maxPerSlide = 6;

    try {
        const response = await fetch('/Home/GetCustomerReviews');
        const reviews = await response.json();

        container.innerHTML = ""; // تنظيف المحتوى السابق

        let slide, reviewIndex = 0;

        reviews.forEach((review, i) => {
            if (i % maxPerSlide === 0) {
                slide = document.createElement("div");
                slide.className = "review-slide";
                container.appendChild(slide);
            }

            const card = document.createElement("div");
            card.className = "review-card";

            const starsDiv = document.createElement("div");
            starsDiv.className = "review-stars";
            for (let s = 0; s < 5; s++) {
                const star = document.createElement("i");
                star.className = s < review.rating ? "fas fa-star text-warning" : "far fa-star text-muted";
                starsDiv.appendChild(star);
            }

            const textDiv = document.createElement("div");
            textDiv.className = "review-text";
            textDiv.innerHTML = review.text.length > 100
                ? `${review.text.slice(0, 100)}... <span class="review-readmore">Read more</span>`
                : review.text;

            const footerDiv = document.createElement("div");
            footerDiv.className = "review-footer";
            footerDiv.innerHTML = `
                <span class="reviewer-name">${review.reviewerName}</span>
                <span class="review-date">${review.reviewDate}</span>`;

            card.appendChild(starsDiv);
            card.appendChild(textDiv);
            card.appendChild(footerDiv);
            slide.appendChild(card);
        });

        // إعادة تحميل السلايدر بعد إدخال الريفيوز
        new ReviewSlider();

    } catch (err) {
        console.error("Error fetching reviews:", err);
    }
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
// for sumbitting the review form
    document.getElementById("reviewForm").addEventListener("submit", async function (e) {
        e.preventDefault();

    const ratingInput = document.getElementById("reviewRating");
    const nameInput = document.getElementById("reviewerName");
    const textInput = document.getElementById("reviewText");

    const reviewData = {
        rating: parseInt(ratingInput.value),
    reviewerName: nameInput.value.trim(),
    text: textInput.value.trim()
    };

    try {
        const response = await fetch("/Home/SubmitReview", {
        method: "POST",
    headers: {
        "Content-Type": "application/json"
            },
    body: JSON.stringify(reviewData)
        });

    const result = await response.json();

    // Show success toast
    document.getElementById("toastBody").textContent = result.message;
    toastElement.classList.remove('bg-danger');
    toastElement.classList.add('bg-primary');
    toast.show();

    // Reset form
    e.target.reset();
        document.querySelectorAll('#starRating i').forEach(star => star.classList.remove('text-warning'));
    } catch (err) {
        // Show error toast
        document.getElementById("toastBody").textContent = "Error submitting review.";
    toastElement.classList.remove('bg-primary');
    toastElement.classList.add('bg-danger');
    toast.show();
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