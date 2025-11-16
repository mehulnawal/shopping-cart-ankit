document.addEventListener("DOMContentLoaded", loadCategoryProducts);

async function loadCategoryProducts() {

    const params = new URLSearchParams(window.location.search);
    const category = params.get("cat");

    const box = document.getElementById("categoryProducts");
    const pagination = document.getElementById("paginationControls");

    if (!category) {
        box.innerHTML = `<p class="col-span-2 text-center text-gray-500 mt-4">Invalid category.</p>`;
        return;
    }

    try {
        const res = await fetch('/api/getProducts.php');
        const products = await res.json();

        // FILTER PRODUCTS BY CATEGORY
        const filtered = products.filter(p => p.category === category);

        if (!filtered.length) {
            box.innerHTML = `<p class="col-span-2 text-center text-gray-500 mt-4">No products found.</p>`;
            return;
        }

        // -----------------------
        // PAGINATION CONFIG
        // -----------------------
        let currentPage = 1;
        const perPage = 6;   // show 6 items per page
        const totalPages = Math.ceil(filtered.length / perPage);

        function renderPage() {
            const start = (currentPage - 1) * perPage;
            const end = start + perPage;
            const pageItems = filtered.slice(start, end);

            box.innerHTML = pageItems.map(p => `
                <a href="/product.html?id=${encodeURIComponent(p.id)}"
                    class="block flex flex-col relative h-full overflow-hidden rounded-lg bg-white shadow-sm">

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

            renderPaginationButtons();
        }

        function renderPaginationButtons() {
            pagination.innerHTML = `
                <button 
                    class="px-4 py-1 bg-gray-200 rounded ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}" 
                    id="prevPage">Previous</button>

                <span class="text-gray-700 text-sm">Page ${currentPage} of ${totalPages}</span>

                <button 
                    class="px-4 py-1 bg-gray-200 rounded ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}" 
                    id="nextPage">Next</button>
            `;

            // attach events
            document.getElementById("prevPage").onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPage();
                }
            };

            document.getElementById("nextPage").onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPage();
                }
            };
        }

        // INITIAL RENDER
        renderPage();

    } catch (e) {
        console.error(e);
        box.innerHTML = `<p class="col-span-2 text-center text-red-500">Failed to load products.</p>`;
    }
}
