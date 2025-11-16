// CONFIG
const JSON_PATH = "../data/products.json";

document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cartBtn");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");

    if (cartIcon) {
        cartIcon.addEventListener("click", () => {
            cartDrawer.classList.remove("translate-x-full");
            cartOverlay.classList.remove("hidden");
        });
    }

    function hideCart() {
        cartDrawer.classList.add("translate-x-full");
        cartOverlay.classList.add("hidden");
    }

    closeCart?.addEventListener("click", hideCart);
    cartOverlay?.addEventListener("click", hideCart);
});

// Random reviews
const REVIEW_POOL = [
    "Loved the fit, fabric is good.",
    "Color was slightly different but wearable.",
    "Excellent quality for the price.",
    "Received sooner than expected, happy!",
    "Stitching is neat, looks premium.",
    "Size chart is accurate, fits well.",
    "Material is comfortable for daily wear.",
    "Packaging was good, product intact.",
    "Good value for money, recommended.",
    "Not happy with the zipper, bit stiff.",
    "Wash quality is fine, no fade so far.",
    "Looks exactly like the picture.",
    "Comfortable and stylish, will buy again.",
    "Decent product, but delivery delayed.",
    "Perfect length, great for casual outings.",
    "Fabric feels soft, color holds well.",
    "A bit thin but ok for the price.",
    "Design is trendy, got compliments.",
    "Buttons came loose once, but fixed.",
    "Overall satisfied, will recommend to friends."
];

function pickRandom(arr, n) {
    const copy = [...arr];
    const out = [];
    while (out.length < n && copy.length) {
        out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return out;
}

function getProductId() {
    return new URLSearchParams(window.location.search).get("id");
}

async function loadProduct() {
    try {
        const res = await fetch(JSON_PATH);
        const products = await res.json();

        const id = getProductId();
        const product = products.find(p => p.id === id);

        if (!product) {
            document.getElementById("productTitle").innerText = "Product not found";
            return;
        }

        renderProduct(product, products);

    } catch (err) {
        console.error("JSON load error:", err);
    }
}

function renderProduct(product, all) {

    // MAIN IMAGE
    document.getElementById("mainImageWrap").innerHTML = `
        <img src="${product.image1}" class="w-full h-full object-cover">
    `;

    // THUMBNAILS (responsive)
    document.getElementById("thumbs").innerHTML = `
        <img src="${product.image1}" data-src="${product.image1}"
            class="w-16 h-20 sm:w-20 sm:h-28 rounded cursor-pointer ring-2 ring-green-600">
        <img src="${product.image2}" data-src="${product.image2}"
            class="w-16 h-20 sm:w-20 sm:h-28 rounded cursor-pointer">
    `;

    // TEXT
    document.getElementById("productTitle").innerText = product.name;
    document.getElementById("productPrice").innerText = `₹${product.price}`;
    document.getElementById("productOld").innerText = product.oldPrice ? `₹${product.oldPrice}` : "";
    document.getElementById("productDiscount").innerText = product.discount ? `${product.discount}% off` : "";

    const rating = product.rating || "4.3";
    document.getElementById("ratingBadge").innerText = rating;
    document.getElementById("avgRating").innerText = rating;
    document.getElementById("ratingCount").innerText = ` (${product.ratingCount || 4890})`;

    document.getElementById("productDescription").innerText = product.description;

    document.getElementById("repeatOffers").innerHTML =
        "Buy 2 Get 2 Free (Add 4 item to cart) ".repeat(3);

    // CUSTOMER IMAGES (responsive)
    document.getElementById("customerImages").innerHTML = `
        <img src="${product.image1}" class="w-16 h-16 sm:w-20 sm:h-20 rounded shadow object-cover">
        <img src="${product.image2}" class="w-16 h-16 sm:w-20 sm:h-20 rounded shadow object-cover">
    `;

    // REVIEWS
    renderReviews(pickRandom(REVIEW_POOL, 6), product);

    // PRODUCTS FOR YOU (responsive)
    const similar = all.filter(p => p.id !== product.id).slice(0, 2);

    document.getElementById("productsForYou").innerHTML = similar.map(p => `
        <a href="product.html?id=${p.id}">
            <div class="bg-white shadow rounded">
                <img src="${p.image1}" class="h-40 sm:h-52 w-full object-cover">
                <div class="p-2 text-[12px] sm:text-[13px]">${p.name}</div>
                <div class="px-2 pb-3 font-bold text-green-700">₹${p.price}</div>
            </div>
        </a>
    `).join("");

    document.querySelectorAll("#thumbs img").forEach(img => {
        img.onclick = () => {
            document.getElementById("mainImageWrap").innerHTML =
                `<img src="${img.dataset.src}" class="w-full h-full object-cover">`;

            document.querySelectorAll("#thumbs img")
                .forEach(i => i.classList.remove("ring-2", "ring-green-600"));

            img.classList.add("ring-2", "ring-green-600");
        };
    });

    document.getElementById("addToCartBtn").onclick = () =>
        window.location.href = `checkout.html?id=${product.id}`;

    document.getElementById("buyNowBtn").onclick = () =>
        window.location.href = `checkout.html?id=${product.id}`;
}

function renderReviews(list, product) {
    const out = document.getElementById("reviewsList");
    out.innerHTML = "";

    const names = ["Amit Patel", "Sneha Khan", "Neha Verma", "Raj Tiwari", "Ritu Sharma"];
    const dates = [
        "October 25, 2025",
        "October 28, 2025",
        "October 19, 2025",
        "October 10, 2025",
        "September 29, 2025"
    ];

    list.forEach((text, i) => {
        const name = names[i % names.length];
        const date = dates[i % dates.length];
        const stars = 5;
        const helpful = Math.floor(Math.random() * 900) + 200;

        out.innerHTML += `
        <div class="bg-white rounded-xl p-4 shadow">

            <p class="text-[14px] sm:text-[15px] font-semibold mb-1">${name}</p>

            <div class="flex items-center gap-2 mb-2">
                <span class="bg-green-600 text-white text-[11px] sm:text-[13px] px-2 py-1 rounded font-semibold">
                    ${stars} ★
                </span>
                <span class="text-[11px] sm:text-[12px] text-gray-600">Posted on ${date}</span>
            </div>

            <p class="text-[13px] sm:text-[14px] text-gray-800 mb-3">${text}</p>

            <div class="flex gap-3 mb-3">
                <img src="${product.image1}" class="w-20 h-20 sm:w-24 sm:h-24 rounded object-cover">
                <img src="${product.image2}" class="w-20 h-20 sm:w-24 sm:h-24 rounded object-cover">
            </div>

            <div class="flex items-center text-gray-700 text-[13px] sm:text-[14px] gap-2">
                <span class="text-[18px] sm:text-[20px]">👍</span>
                <span>Helpful (${helpful})</span>
            </div>

        </div>`;
    });
}

loadProduct();
