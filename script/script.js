// ===============================
// IA#2 JavaScript - Island Wellness Hub
// ===============================

console.log("Website Loaded");

// ---------- ADD TO CART ----------
function addToCart(name, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
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

// ---------- DISPLAY CART ----------
function displayCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartList = document.getElementById("cartItems");

    if (!cartList) return;

    cartList.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {

        let li = document.createElement("li");

        li.textContent = item.name + " - $" + item.price + " x " + item.quantity;

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";

        removeBtn.onclick = function () {
            removeItem(index);
        };

        li.appendChild(removeBtn);
        cartList.appendChild(li);

        subtotal += item.price * item.quantity;

    });

    let tax = subtotal * 0.15;
    let total = subtotal + tax;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}

// ---------- REMOVE ITEM ----------
function removeItem(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
    updateCartCount();
}

// ---------- CLEAR CART ----------
function clearCart() {
    localStorage.removeItem("cart");
    displayCart();
    updateCartCount();
}

// ---------- UPDATE CART COUNT ----------
function updateCartCount() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = cart.reduce((total, item) => total + item.quantity, 0);

    let cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }
}

// ---------- PLACE ORDER ----------
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

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    let tax = total * 0.15;
    let finalTotal = total + tax;

    alert("Order placed!\nTotal: $" + finalTotal.toFixed(2));

    localStorage.removeItem("cart");

    updateCartCount();

    window.location.href = "index.html";
}

// ---------- LOGIN ----------
function validateLogin(event) {

    event.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
        alert("Please fill in all fields!");
        return;
    }

    alert("Login successful!");
    window.location.href = "index.html";
}

// ---------- REGISTER ----------
function validateRegister(event) {

    event.preventDefault();

    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirmPassword").value;

    if (password.length < 6) {
        alert("Password must be at least 6 characters!");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    alert("Registration successful!");
    window.location.href = "login.html";
}

// ---------- SCROLL BUTTON ----------
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

// ---------- ON LOAD ----------
window.onload = function () {
    displayCart();
    updateCartCount();
};

// IA#2 GROUP PROJECT - Registration Function

function registerUser(event) {
    event.preventDefault();

    // Get values
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let dob = document.getElementById("dob").value;
    let gender = document.getElementById("gender").value;
    let phone = document.getElementById("phone").value.trim();
    let email = document.getElementById("email").value.trim();
    let trn = document.getElementById("trn").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    // Validate password length
    if (password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
    }

    // Confirm password
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Validate TRN format (000-000-000)
    let trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        alert("TRN must be in format 000-000-000");
        return;
    }

    // Calculate age
    let birthDate = new Date(dob);
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
        alert("You must be at least 18 years old");
        return;
    }

    // Get existing users
    let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    // Check if TRN already exists
    let exists = users.some(user => user.trn === trn);
    if (exists) {
        alert("TRN already registered");
        return;
    }

    // Create user object
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

    // Save user
    users.push(newUser);
    localStorage.setItem("RegistrationData", JSON.stringify(users));

    alert("Registration successful!");

    // Redirect to login
    window.location.href = "login.html";
}
