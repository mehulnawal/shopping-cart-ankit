// Load products from LocalStorage
function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}

// Save products to LocalStorage
function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// Generate Product ID (P0001)
function generateProductID() {
    let lastID = localStorage.getItem("lastID") || 0;
    lastID++;
    localStorage.setItem("lastID", lastID);
    return "P" + String(lastID).padStart(4, "0");
}

// ⭐ Generate random rating (4.0 to 5.0)
function generateRandomRating() {
    return (Math.random() * (5 - 4) + 4).toFixed(1);
}

// ⭐ Generate random rating count (50 to 5000)
function generateRandomRatingCount() {
    return Math.floor(Math.random() * (5000 - 50) + 50);
}

// Load products into admin list
function loadProductList() {
    const list = document.getElementById("productList");
    const products = getProducts();

    list.innerHTML = products
        .map(
            (p) => `
        <div class="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
                <p class="text-[13px]"><b>${p.id}</b> - ${p.name}</p>
                <p class="text-[12px] text-gray-500">Category: ${p.category}</p>
                <p class="text-[12px] text-yellow-600">⭐ ${p.rating} (${p.ratingCount})</p>
            </div>

            <div class="flex gap-3">
                <button onclick="editProduct('${p.id}')"
                    class="text-blue-600 text-[13px]">Edit</button>

                <button onclick="deleteProduct('${p.id}')"
                    class="text-red-600 text-[13px]">Delete</button>
            </div>
        </div>
    `
        )
        .join("");
}

// Delete product
function deleteProduct(id) {
    if (!confirm("Are you sure?")) return;

    const products = getProducts().filter((p) => p.id !== id);
    saveProducts(products);
    loadProductList();
}

// Edit product
function editProduct(id) {
    const products = getProducts();
    const product = products.find((p) => p.id === id);

    // Switch to edit mode
    document.getElementById("formTitle").innerText = "Edit Product";
    document.getElementById("submitBtn").innerText = "Update Product";
    document.getElementById("cancelEdit").classList.remove("hidden");

    // Show rating fields
    document.getElementById("rating").classList.remove("hidden");
    document.getElementById("ratingCount").classList.remove("hidden");

    // Fill form
    document.getElementById("productID").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("image1").value = product.image1;
    document.getElementById("image2").value = product.image2;
    document.getElementById("price").value = product.price;
    document.getElementById("oldPrice").value = product.oldPrice;
    document.getElementById("discount").value = product.discount;
    document.getElementById("category").value = product.category;
    document.getElementById("description").value = product.description;

    // ⭐ Load ratings in form
    document.getElementById("rating").value = product.rating;
    document.getElementById("ratingCount").value = product.ratingCount;
}

// Exit edit mode
function cancelEditMode() {
    document.getElementById("formTitle").innerText = "Add Product";
    document.getElementById("submitBtn").innerText = "Add Product";
    document.getElementById("cancelEdit").classList.add("hidden");

    // Hide rating fields
    document.getElementById("rating").classList.add("hidden");
    document.getElementById("ratingCount").classList.add("hidden");

    document.getElementById("productForm").reset();
}

// Handle Add / Update Product
document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const products = getProducts();
    const editingID = document.getElementById("productID").value;

    const isEditing = editingID !== "";

    const newProduct = {
        id: editingID || generateProductID(),
        name: document.getElementById("productName").value,
        image1: document.getElementById("image1").value,
        image2: document.getElementById("image2").value,
        price: document.getElementById("price").value,
        oldPrice: document.getElementById("oldPrice").value,
        discount: document.getElementById("discount").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,

        // ⭐ If editing, take from form — else auto-generate
        rating: isEditing
            ? document.getElementById("rating").value
            : generateRandomRating(),

        ratingCount: isEditing
            ? document.getElementById("ratingCount").value
            : generateRandomRatingCount(),
    };

    if (isEditing) {
        const index = products.findIndex((p) => p.id === newProduct.id);
        products[index] = newProduct;
    } else {
        products.push(newProduct);
    }

    saveProducts(products);
    cancelEditMode();
    loadProductList();
});

// Load products initially
loadProductList();
