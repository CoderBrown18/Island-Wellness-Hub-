// ===============================
// IA#2 JavaScript - Island Wellness Hub (FINAL CLEAN VERSION)
// ===============================

console.log("Website Loaded");

// ===============================
// PRODUCT SYSTEM
// ===============================

const products = [
    {
        name: "Yoga Class",
        price: 2500,
        description: "Relaxing yoga sessions to reduce stress.",
        image: "assets/images/yoga.jpg"
    },
    {
        name: "Personal Training",
        price: 3500,
        description: "One-on-one fitness training.",
        image: "assets/images/training.jpg"
    },
    {
        name: "Massage Therapy",
        price: 4000,
        description: "Relieve muscle tension and relax.",
        image: "assets/images/massage.jpg"
    },
    {
        name: "Nutrition Consultation",
        price: 3000,
        description: "Healthy eating and lifestyle advice.",
        image: "assets/images/nutrition.jpg"
    }
];

// Save products ONLY once
if (!localStorage.getItem("AllProducts")) {
    localStorage.setItem("AllProducts", JSON.stringify(products));
}

// Display Products
function displayProducts() {

    let container = document.getElementById("productList");
    if (!container) return;

    let products = JSON.parse(localStorage.getItem("AllProducts")) || [];

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
            <div class="product">

                <img src="${product.image}" alt="${product.name}">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <p class="price">$${product.price}</p>

                <button onclick="addToCart('${product.name}', ${product.price})">
                    Add to Cart
                </button>

            </div>
        `;
    });
}


// ===============================
// CART SYSTEM
// ===============================

function addToCart(name, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart");

    updateCartCount();
}

function displayCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartList = document.getElementById("cartItems");
    if (!cartList) return;

    cartList.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {

        let li = document.createElement("li");

        let itemTotal = item.price * item.quantity;

        li.innerHTML = `
            ${item.name} - $${item.price} x ${item.quantity} = $${itemTotal}
        `;

        let btn = document.createElement("button");
        btn.textContent = "Remove";

        btn.onclick = function () {
            removeItem(index);
        };

        li.appendChild(btn);
        cartList.appendChild(li);

        subtotal += itemTotal;
    });

    let tax = subtotal * 0.15;
    let total = subtotal + tax;

    document.getElementById("subtotal").textContent = subtotal;
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}

function removeItem(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
    updateCartCount();
}

function clearCart() {
    localStorage.removeItem("cart");
    displayCart();
    updateCartCount();
}

function updateCartCount() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
    });

    let cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}


// ===============================
// CHECKOUT / ORDER
// ===============================

function placeOrder(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let address = document.getElementById("address").value;

    if (name === "" || email === "" || address === "") {
        alert("Please fill in all fields!");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    let tax = subtotal * 0.15;
    let total = subtotal + tax;

    alert("Order placed!\nTotal: $" + total.toFixed(2));

    localStorage.removeItem("cart");

    updateCartCount();

    window.location.href = "index.html";
}


// ===============================
// REGISTRATION SYSTEM
// ===============================

function registerUser(event) {
    event.preventDefault();

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let dob = document.getElementById("dob").value;
    let gender = document.getElementById("gender").value;
    let phone = document.getElementById("phone").value.trim();
    let email = document.getElementById("email").value.trim();
    let trn = document.getElementById("trn").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    let trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        alert("TRN must be in format 000-000-000");
        return;
    }

    let birthDate = new Date(dob);
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
        alert("You must be at least 18 years old");
        return;
    }

    let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    let exists = users.some(user => user.trn === trn);
    if (exists) {
        alert("TRN already registered");
        return;
    }

    let newUser = {
        firstName,
        lastName,
        dob,
        gender,
        phone,
        email,
        trn,
        password,
        dateRegistered: new Date().toLocaleDateString(),
        cart: [],
        invoices: []
    };

    users.push(newUser);
    localStorage.setItem("RegistrationData", JSON.stringify(users));

    alert("Registration successful!");
    window.location.href = "login.html";
}


// ===============================
// LOGIN SYSTEM
// ===============================

let loginAttempts = 0;

function loginUser(event) {

    event.preventDefault();

    let trn = document.getElementById("loginTRN").value.trim();
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    let foundUser = users.find(user => user.trn === trn && user.password === password);

    if (foundUser) {

        alert("Login successful!");

        localStorage.setItem("currentUser", JSON.stringify(foundUser));

        window.location.href = "products.html";

    } else {

        loginAttempts++;

        document.getElementById("errorMsg").textContent =
            "Invalid TRN or Password (" + loginAttempts + "/3)";

        if (loginAttempts >= 3) {
            alert("Too many attempts. Try again later.");
        }
    }
}


// ===============================
// SCROLL BUTTON
// ===============================

window.onscroll = function () {

    let btn = document.getElementById("topBtn");
    if (!btn) return;

    if (document.documentElement.scrollTop > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}


// ===============================
// ON LOAD
// ===============================

window.onload = function () {
    displayProducts();
    displayCart();
    updateCartCount();
};
