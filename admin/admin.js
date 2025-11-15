async function loadProducts() {
    try {
        const response = await fetch("../assets/products.json");
        const products = await response.json();

        const list = document.getElementById("productList");

        list.innerHTML = products.map(p => `
            <div class="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                <div>
                    <p class="text-[14px] font-semibold">${p.id} - ${p.name}</p>
                    <p class="text-[12px] text-gray-500">Category: ${p.category}</p>
                    <p class="text-[12px] text-yellow-600">⭐ ${p.rating} (${p.ratingCount})</p>
                </div>

                <img src="${p.image1}" class="w-16 h-16 rounded object-cover" />
            </div>
        `).join("");

    } catch (err) {
        console.error("Failed to load JSON:", err);
    }
}

loadProducts();
