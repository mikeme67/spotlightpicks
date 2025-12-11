document.addEventListener("DOMContentLoaded", function() {

    const featuredStatus = document.getElementById("featured-status");
    if (featuredStatus) {
        featuredStatus.textContent = "Featured products will appear here soon!";
    }

    const reviewsStatus = document.getElementById("reviews-status");
    if (reviewsStatus) {
        reviewsStatus.textContent = "Reviews will be added shortly!";
    }

    console.log("Spotlight Picks page loaded successfully.");
});
