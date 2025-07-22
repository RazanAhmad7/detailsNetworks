
document.addEventListener("DOMContentLoaded", function () {
    const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;

    // Accept
    document.querySelectorAll(".accept-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const reviewCard = this.closest(".review-card");
            const reviewId = reviewCard.getAttribute("data-review-id");

            try {
                const response = await fetch(`/Admin/Approve/${reviewId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'RequestVerificationToken': token
                    }
                });

                const result = await response.json();

                if (result.success) {
                    reviewCard.querySelector(".review-action-buttons")?.classList.add("d-none");
                    reviewCard.querySelector(".approved-btn")?.classList.remove("d-none");

                    // After Accept or Reject is clicked and status updated
                    const card = button.closest(".review-card");
                    const changeStatusBtn = card.querySelector(".change-status-btn");

                    if (changeStatusBtn) {
                        changeStatusBtn.classList.remove("disabled");
                    }

                }
            } catch (err) {
                console.error(err);
                alert("Failed to approve.");
            }
        });
    });

    // Reject
    document.querySelectorAll(".reject-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const reviewCard = this.closest(".review-card");
            const reviewId = reviewCard.getAttribute("data-review-id");

            try {
                const response = await fetch(`/Admin/Reject/${reviewId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'RequestVerificationToken': token
                    }
                });

                const result = await response.json();

                if (result.success) {
                    reviewCard.querySelector(".review-action-buttons")?.classList.add("d-none");
                    reviewCard.querySelector(".rejected-btn")?.classList.remove("d-none");

                    // After Accept or Reject is clicked and status updated
                    const card = button.closest(".review-card");
                    const changeStatusBtn = card.querySelector(".change-status-btn");

                    if (changeStatusBtn) {
                        changeStatusBtn.classList.remove("disabled");
                    }

                }
            } catch (err) {
                console.error(err);
                alert("Failed to reject.");
            }
        });
    });

    // Change Status
    document.querySelectorAll(".change-status-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const reviewCard = this.closest(".review-card");
            const reviewId = reviewCard?.getAttribute("data-review-id");

            if (!reviewId) {
                alert("Review ID not found in HTML.");
                return;
            }

            const approvedBtn = reviewCard.querySelector(".approved-btn");
            const rejectedBtn = reviewCard.querySelector(".rejected-btn");

            if (!approvedBtn || !rejectedBtn) {
                alert("Approved/Rejected buttons not found inside review card.");
                return;
            }

            try {
                const response = await fetch(`/Admin/ToggleStatus/${reviewId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'RequestVerificationToken': token
                    }
                });

                const result = await response.json();

                if (result.status === "Approved") {
                    rejectedBtn.classList.add("d-none");
                    approvedBtn.classList.remove("d-none");
                    console.log("Switched to Approved");
                } else if (result.status === "Rejected") {
                    approvedBtn.classList.add("d-none");
                    rejectedBtn.classList.remove("d-none");
                    console.log("Switched to Rejected");
                } else {
                    alert("Unexpected status value returned.");
                    console.log("Unexpected status:", result);
                }

            } catch (err) {
                console.error(err);
                alert("Failed to change status.");
            }
        });
    });
});


// for read more buttons:
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".review-content").forEach(container => {
        const text = container.querySelector(".review-text");
        const btn = container.querySelector(".read-more-btn");

        // Detect if text is truncated (scrollHeight > clientHeight)
        if (text.scrollHeight > text.clientHeight + 2) { // +2px tolerance
            btn.classList.add("visible");
            btn.addEventListener("click", () => {
                text.classList.toggle("expanded");
                btn.textContent = text.classList.contains("expanded") ? "Read less" : "Read more";
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".message-content").forEach(container => {
        const text = container.querySelector(".message-text");
        const btn = container.querySelector(".read-more-btn");

        if (text.scrollHeight > text.clientHeight + 2) {
            btn.classList.add("visible");
            btn.addEventListener("click", () => {
                text.classList.toggle("expanded");
                btn.textContent = text.classList.contains("expanded") ? "Read less" : "Read more";
            });
        }
    });
});


// delete contact message: 
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.delete-contact-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const form = this.closest('form');

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--main-orange'),
                cancelButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--main-blue'),
                background: getComputedStyle(document.documentElement).getPropertyValue('--main-blue'),
                color: getComputedStyle(document.documentElement).getPropertyValue('--main-white'),
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Send fetch request instead of submitting form normally
                    fetch(form.action, {
                        method: 'POST',
                        headers: {
                            'RequestVerificationToken': form.querySelector('input[name="__RequestVerificationToken"]').value
                        }
                    })
                        .then(response => {
                            if (response.ok) {
                                Swal.fire({
                                    title: 'Deleted!',
                                    text: 'Your message has been deleted.',
                                    icon: 'success',
                                    confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--main-orange'),
                                    background: getComputedStyle(document.documentElement).getPropertyValue('--main-blue'),
                                    color: getComputedStyle(document.documentElement).getPropertyValue('--main-white')
                                }).then(() => {
                                    form.closest('tr').remove(); // Remove the row from table
                                });
                            } else {
                                Swal.fire('Error!', 'Failed to delete the message.', 'error');
                            }
                        });
                }
            });
        });
    });
});