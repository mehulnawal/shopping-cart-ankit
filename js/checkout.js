async function loadCheckout() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    const res = await fetch("../assets/products.json");
    const products = await res.json();

    const product = products.find(p => p.id == id);

    if (!product) return;

    document.getElementById("mrpValue").textContent = "₹" + product.oldPrice;
    document.getElementById("saleValue").textContent = "₹" + product.price;
    document.getElementById("totalPayable").textContent = "₹" + product.price;
    document.getElementById("itemCount").textContent = "1";
}

loadCheckout();
