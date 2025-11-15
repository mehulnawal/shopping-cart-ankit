document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("product-list");
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // Filter only "home" category products
    const homeProducts = products.filter(p => p.category === "home");

    if (homeProducts.length === 0) {
        box.innerHTML = `
            <p class="text-gray-500 text-[13px]">No products available in home category.</p>
        `;
        return;
    }

    box.innerHTML = homeProducts
        .map(
            (p) => `
        <a href="product.html?id=${p.id}" class="block">
        
            <!-- PRODUCT CARD -->
            <div class="bg-white p-3 rounded-xl shadow hover:shadow-lg transition mx-auto">

                <!-- IMAGE BOX -->
                <div class="w-full h-[565px] relative overflow-hidden rounded-xl mx-auto">

                    <!-- Image 1 -->
                    <img src="${p.image1}" 
                        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300">

                    <!-- Image 2 (hover show) -->
                    <img src="${p.image2}" 
                        class="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300">
                </div>

                <!-- TITLE -->
                <h3 class="mt-3 text-[13px] font-medium text-gray-900 leading-tight">
                    ${p.name}
                </h3>

                <!-- PRICES -->
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-green-600 font-bold text-[16px]">₹${p.price}</span>
                    <span class="line-through text-gray-400 text-[12px]">₹${p.oldPrice}</span>
                    <span class="text-red-600 text-[12px] font-bold">${p.discount}% OFF</span>
                </div>

                <!-- FREE DELIVERY -->
                <p class="text-green-600 text-[12px] mt-1">Free Delivery</p>

            </div>

        </a>
    `
        )
        .join("");
});
