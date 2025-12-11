// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {

    // Update featured section
    const featuredStatus = document.getElementById("featured-status");
    if (featuredStatus) {
        featuredStatus.textContent = "Featured products will appear here soon!";
    }

    // Update reviews section
    const reviewsStatus = document.getElementById("reviews-status");
    if (reviewsStatus) {
        reviewsStatus.textContent = "Reviews will be added shortly!";
    }

    console.log("Spotlight Picks page loaded successfully.");
});
