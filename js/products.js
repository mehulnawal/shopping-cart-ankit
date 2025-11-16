document.addEventListener("DOMContentLoaded", async () => {
  const box = document.getElementById("product-list");

  try {
    const res = await fetch('/api/getProducts.php');
    const products = await res.json();

    // ✅ SHOW ALL PRODUCTS (no filter)
    const allProducts = products || [];

    if (!allProducts.length) {
      box.innerHTML = `<p class="text-gray-500 text-[13px]">No products available.</p>`;
      return;
    }

    box.innerHTML = allProducts.map(p => `
        <a href="/product.html?id=${encodeURIComponent(p.id)}" 
            class="block w-1/2 flex flex-col relative h-full overflow-hidden"> 
        
            <div class="bg-[#fdfdfdb3] border border-gray-300/40 border-b-2 shadow-sm p-4 flex flex-col h-full"> 
                
                <div class="w-[65%] h-[250px] relative overflow-hidden rounded-md mx-auto"> 
                    <img src="${p.image1}" class="absolute inset-0 w-full h-full object-cover">
                    <img src="${p.image2}" class="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300">
                </div>

                <h3 class="mt-3 text-[15px] sm:text-xs font-normal text-gray-800 leading-snug line-clamp-2 h-[2em]">
                    ${p.name}
                </h3>
                
                <div class="flex items-center gap-2 my-2">
                    <span class="text-lg sm:text-base text-gray-900 font-bold">₹${p.price}</span>
                    <span class="line-through text-sm sm:text-xs text-gray-500">₹${p.oldPrice}</span>
                    <span class="text-sm sm:text-xs text-gray-700">${p.discount}% off</span> 
                </div>
                
                <p class="text-sm sm:text-xs text-green-700 mt-1">₹755 with 2 Special Offers</p>
                
                <p class="text-sm sm:text-xs text-gray-600 mt-1">Free Delivery</p>
                
                <div class="flex items-center gap-2 mt-auto">
                    <div class="bg-green-700 text-white px-1.5 py-0.5 rounded-[30px] flex items-center text-xs">
                        <span>${p.rating}</span>
                        <span class="ml-0.5">⭐</span>
                    </div>
                    
                    <span class="text-sm sm:text-xs text-gray-600">(${p.ratingCount})</span>
                </div>
            </div>

        </a>
        `).join('');

  } catch (err) {
    console.error(err);
    box.innerHTML = `<p class="text-red-500">Failed to load products.</p>`;
  }
});


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