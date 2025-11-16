// helper fetch wrapper
async function apiPost(url, payload) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return res.json();
}

async function loadProductList() {
    try {
        const res = await fetch('/api/getProducts.php');
        const products = await res.json();
        const list = document.getElementById('productList');

        if (!Array.isArray(products) || products.length === 0) {
            list.innerHTML = '<p class="text-gray-500">No products</p>';
            return;
        }

        list.innerHTML = products.map(p => `
      <div class="flex justify-between items-center bg-gray-50 p-3 rounded">
        <div>
          <div class="text-sm font-semibold">${p.id} - ${p.name}</div>
          <div class="text-xs text-gray-500">Category: ${p.category}</div>
          <div class="text-xs text-yellow-600">⭐ ${p.rating} (${p.ratingCount})</div>
        </div>
        <div class="flex gap-2">
          <button class="text-blue-600 text-sm" onclick="onEdit('${p.id}')">Edit</button>
          <button class="text-red-600 text-sm" onclick="onDelete('${p.id}')">Delete</button>
        </div>
      </div>
    `).join('');

    } catch (err) {
        console.error(err);
        alert('Failed to load products.');
    }
}

function showEditFields() {
    document.getElementById('rating').classList.remove('hidden');
    document.getElementById('ratingCount').classList.remove('hidden');
    document.getElementById('cancelEdit').classList.remove('hidden');
}

function hideEditFields() {
    document.getElementById('rating').classList.add('hidden');
    document.getElementById('ratingCount').classList.add('hidden');
    document.getElementById('cancelEdit').classList.add('hidden');
}

async function onEdit(id) {
    // load product and fill form
    const res = await fetch('/api/getProducts.php');
    const products = await res.json();
    const p = products.find(x => x.id === id);
    if (!p) { alert('Product not found'); return; }

    document.getElementById('formTitle').innerText = 'Edit Product';
    document.getElementById('submitBtn').innerText = 'Update Product';
    document.getElementById('productID').value = p.id;
    document.getElementById('productName').value = p.name;
    document.getElementById('image1').value = p.image1;
    document.getElementById('image2').value = p.image2;
    document.getElementById('price').value = p.price;
    document.getElementById('oldPrice').value = p.oldPrice;
    document.getElementById('discount').value = p.discount;
    document.getElementById('category').value = p.category;
    document.getElementById('description').value = p.description;
    document.getElementById('rating').value = p.rating;
    document.getElementById('ratingCount').value = p.ratingCount;

    showEditFields();
}

async function onDelete(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await apiPost('/api/deleteProduct.php', { id });
    if (res.success) {
        await loadProductList();
    } else {
        alert(res.error || 'Delete failed');
    }
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productID').value = '';
    document.getElementById('formTitle').innerText = 'Add Product';
    document.getElementById('submitBtn').innerText = 'Add Product';
    hideEditFields();
}

document.getElementById('cancelEdit').addEventListener('click', resetForm);

document.getElementById('productForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const payload = {
        id: document.getElementById('productID').value || undefined,
        name: document.getElementById('productName').value,
        image1: document.getElementById('image1').value,
        image2: document.getElementById('image2').value,
        price: document.getElementById('price').value,
        oldPrice: document.getElementById('oldPrice').value,
        discount: document.getElementById('discount').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value
    };

    // include rating fields if visible (edit mode)
    if (!document.getElementById('rating').classList.contains('hidden')) {
        payload.rating = document.getElementById('rating').value;
        payload.ratingCount = document.getElementById('ratingCount').value;
    }

    try {
        // If id is present -> edit, else add
        let res;
        if (payload.id) {
            res = await apiPost('/api/editProduct.php', payload);
        } else {
            res = await apiPost('/api/addProduct.php', payload);
        }

        if (res.success) {
            resetForm();
            await loadProductList();
            alert('Saved successfully.');
        } else {
            alert(res.error || 'Save failed');
        }
    } catch (err) {
        console.error(err);
        alert('Save failed');
    }
});

// initial load
loadProductList();
