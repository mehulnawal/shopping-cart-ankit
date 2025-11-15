async function loadProducts() {
    const response = await fetch("assets/products.json");
    const products = await response.json();

    const container = document.getElementById("product-list");

    container.innerHTML = products
        .map(p => `
        <a href="../public_html/product.html?id=${p.id}" class="block bg-white rounded-xl overflow-hidden shadow">

            <!-- IMAGE -->
            <div class="w-full h-[300px] overflow-hidden">
                <img src="${p.image1}"
                     class="w-full h-full object-cover">
            </div>

            <div class="p-3">

                <!-- NAME -->
                <p class="text-[13px] font-medium text-gray-800 leading-tight line-clamp-2">
                    ${p.name}
                </p>

                <!-- PRICE + OLD PRICE + DISCOUNT -->
                <div class="mt-1">
                    <span class="text-[18px] font-semibold text-green-700">₹${p.price}.00</span>
                    <span class="text-[13px] line-through text-gray-400 ml-1">₹${p.oldPrice}.00</span>
                    <span class="text-[13px] text-red-500 font-semibold ml-1">${p.discount}% off</span>
                </div>

                <!-- SPECIAL OFFERS -->
                <p class="text-[12px] text-green-600 font-medium mt-1">₹755 with 2 Special Offers</p>

                <!-- FREE DELIVERY -->
                <p class="text-[12px] text-green-700 font-medium mt-1">Free Delivery</p>

                <!-- RATING BOX -->
                <div class="flex items-center gap-2 mt-2">
                    <span class="bg-green-600 text-white px-2 py-1 text-[12px] rounded-md font-semibold">
                        ⭐ ${p.rating}
                    </span>
                    <span class="text-[12px] text-gray-600">(${p.ratingCount})</span>
                </div>

            </div>
        </a>
    `)
        .join("");
}

loadProducts();


// cart logic 
const cartIcon = document.querySelector("span:last-child"); // 🛒 icon
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

// OPEN CART
cartIcon.addEventListener("click", () => {
    cartDrawer.classList.remove("translate-x-full");
    cartOverlay.classList.remove("hidden");
});

// CLOSE CART
function hideCart() {
    cartDrawer.classList.add("translate-x-full");
    cartOverlay.classList.add("hidden");
}

closeCart.addEventListener("click", hideCart);
cartOverlay.addEventListener("click", hideCart);