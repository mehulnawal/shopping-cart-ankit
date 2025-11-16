document.addEventListener("DOMContentLoaded", loadCategoryProducts);

async function loadCategoryProducts() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("cat");

    const box = document.getElementById("categoryProducts");

    if (!category) {
        box.innerHTML = `<p class="col-span-2 text-center text-gray-500 mt-4">Invalid category.</p>`;
        return;
    }

    try {
        const res = await fetch('/api/getProducts.php');
        const products = await res.json();

        // NOW correct → dynamic category filter
        const filtered = products.filter(p => p.category === category);

        if (!filtered.length) {
            box.innerHTML = `<p class="col-span-2 text-center text-gray-500 mt-4">No products found in this category.</p>`;
            return;
        }

        box.innerHTML = filtered.map(p => `
    <a href="/product.html?id=${encodeURIComponent(p.id)}"
        class="block flex flex-col relative h-full overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-lg">

        <div class="border border-gray-200 p-2 flex flex-col h-full rounded-lg">

            <div class="w-full h-[220px] relative overflow-hidden rounded-md mx-auto mb-2">
                <img src="${p.image1}" class="absolute inset-0 w-full h-full object-cover">
                <img src="${p.image2}" class="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300">
            </div>

            <h3 class="mt-2 text-[14px] font-normal text-gray-800 leading-snug line-clamp-2 px-1">
                ${p.name}
            </h3>

            <div class="flex items-center gap-2 my-1 px-1">
                <span class="text-lg font-bold text-gray-900">₹${p.price}</span>
                <span class="line-through text-xs text-gray-500">₹${p.oldPrice}</span>
                <span class="text-xs text-green-700 font-semibold">${p.discount}% off</span>
            </div>

            <p class="text-xs text-green-700 font-medium px-1">₹${p.offerPrice || '---'} with 2 Special Offers</p>
            
            <p class="text-xs text-gray-600 px-1 mt-0.5">Free Delivery</p>

            <div class="flex items-center gap-2 mt-auto pt-2 px-1">
                <div class="bg-green-700 text-white px-1.5 py-0.5 rounded-sm flex items-center text-xs">
                    <span>${p.rating}</span>
                    <span class="ml-1 text-[10px]">★</span>
                </div>

                <span class="text-xs text-gray-600">(${p.ratingCount})</span>
            </div>

        </div>
    </a>
`).join('');

    } catch (e) {
        console.error(e);
        box.innerHTML = `<p class="col-span-2 text-center text-red-500">Failed to load products.</p>`;
    }
}
