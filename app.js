document.addEventListener("DOMContentLoaded", function() {

    // Update Featured Section
    const featuredStatus = document.getElementById("featured-status");
    const featuredProducts = document.getElementById("featured-products");
    if (featuredStatus && featuredProducts) {
        featuredStatus.textContent = "Here are our top picks:";
        // Example featured products
        const products = ["Product 1", "Product 2", "Product 3"];
        products.forEach(product => {
            const item = document.createElement("p");
            item.textContent = product;
            featuredProducts.appendChild(item);
        });
    }

    // Update Reviews Section
    const reviewsStatus = document.getElementById("reviews-status");
    const reviewList = document.getElementById("review-list");
    if (reviewsStatus && reviewList) {
        reviewsStatus.textContent = "Check out the latest reviews:";
        // Example reviews
        const reviews = ["Review 1: ★★★★☆", "Review 2: ★★★☆☆", "Review 3: ★★★★★"];
        reviews.forEach(review => {
            const item = document.createElement("p");
            item.textContent = review;
            reviewList.appendChild(item);
        });
    }

    console.log("Spotlight Picks page loaded successfully.");
});
