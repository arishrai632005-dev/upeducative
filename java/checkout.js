/* =========================================================
   FOODHUB - CHECKOUT PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    renderCheckoutSummary();
    setupCheckoutForm();
});

/* ================= CHECKOUT SUMMARY ================= */

function renderCheckoutSummary() {
    const summaryItems =
        document.getElementById("checkout-items");

    const subtotalElement =
        document.getElementById("checkout-subtotal");

    const deliveryElement =
        document.getElementById("checkout-delivery");

    const discountElement =
        document.getElementById("checkout-discount");

    const totalElement =
        document.getElementById("checkout-total");

    const cart = getCart();

    if (cart.length === 0) {
        if (summaryItems) {
            summaryItems.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some food before checkout.</p>
                    <a href="menu.html" class="btn btn-primary">
                        Browse Menu
                    </a>
                </div>
            `;
        }

        return;
    }

    let subtotal = 0;

    if (summaryItems) {
        summaryItems.innerHTML = cart
            .map(function (cartItem) {
                const food = FOODS.find(
                    function (item) {
                        return item.id === cartItem.id;
                    }
                );

                if (!food) {
                    return "";
                }

                const itemTotal =
                    food.price * cartItem.qty;

                subtotal += itemTotal;

                return `
                    <div class="summary-row">
                        <span>
                            ${food.name} × ${cartItem.qty}
                        </span>

                        <strong>
                            ${money(itemTotal)}
                        </strong>
                    </div>
                `;
            })
            .join("");
    } else {
        cart.forEach(function (cartItem) {
            const food = FOODS.find(
                function (item) {
                    return item.id === cartItem.id;
                }
            );

            if (food) {
                subtotal +=
                    food.price * cartItem.qty;
            }
        });
    }

    const delivery =
        subtotal >= FREE_DELIVERY_LIMIT
            ? 0
            : DELIVERY_CHARGE;

    const couponApplied =
        localStorage.getItem(
            "foodhub_coupon"
        ) === COUPON_CODE;

    const discount =
        couponApplied
            ? subtotal * COUPON_DISCOUNT
            : 0;

    const total =
        subtotal + delivery - discount;

    if (subtotalElement) {
        subtotalElement.textContent =
            money(subtotal);
    }

    if (deliveryElement) {
        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : money(delivery);
    }

    if (discountElement) {
        discountElement.textContent =
            discount > 0
                ? "-" + money(discount)
                : money(0);
    }

    if (totalElement) {
        totalElement.textContent =
            money(total);
    }
}

/* ================= CHECKOUT FORM ================= */

function setupCheckoutForm() {
    const form =
        document.getElementById("checkout-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const cart = getCart();

        if (cart.length === 0) {
            toast("Your cart is empty");
            return;
        }

        clearCheckoutErrors();

        const name =
            document.getElementById("checkout-name");

        const phone =
            document.getElementById("checkout-phone");

        const email =
            document.getElementById("checkout-email");

        const address =
            document.getElementById("checkout-address");

        const city =
            document.getElementById("checkout-city");

        const pincode =
            document.getElementById("checkout-pincode");

        const payment =
            document.querySelector(
                'input[name="payment"]:checked'
            );

        /* ================= VALIDATION ================= */

        if (!name || name.value.trim() === "") {
            showCheckoutError(
                name,
                "Please enter your name."
            );
            return;
        }

        if (!phone || phone.value.trim() === "") {
            showCheckoutError(
                phone,
                "Please enter your phone number."
            );
            return;
        }

        if (!isValidPhone(phone.value.trim())) {
            showCheckoutError(
                phone,
                "Please enter a valid 10-digit phone number."
            );
            return;
        }

        if (!email || email.value.trim() === "") {
            showCheckoutError(
                email,
                "Please enter your email."
            );
            return;
        }

        if (!isValidEmail(email.value.trim())) {
            showCheckoutError(
                email,
                "Please enter a valid email address."
            );
            return;
        }

        if (
            !address ||
            address.value.trim() === ""
        ) {
            showCheckoutError(
                address,
                "Please enter your delivery address."
            );
            return;
        }

        if (!city || city.value.trim() === "") {
            showCheckoutError(
                city,
                "Please enter your city."
            );
            return;
        }

        if (
            !pincode ||
            pincode.value.trim() === ""
        ) {
            showCheckoutError(
                pincode,
                "Please enter your PIN code."
            );
            return;
        }

        if (!isValidPincode(pincode.value.trim())) {
            showCheckoutError(
                pincode,
                "Please enter a valid 6-digit PIN code."
            );
            return;
        }

        if (!payment) {
            toast("Please select a payment method");
            return;
        }

        /* ================= PLACE ORDER ================= */

        placeOrder();
    });
}

/* ================= PLACE ORDER ================= */

function placeOrder() {
    const orderId =
        "FH" +
        Date.now()
            .toString()
            .slice(-8);

    const orderTime =
        new Date().toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    localStorage.setItem(
        "foodhub_last_order",
        JSON.stringify({
            orderId: orderId,
            orderTime: orderTime
        })
    );

    /* Clear cart */

    localStorage.removeItem("foodhub_cart");

    localStorage.removeItem("foodhub_coupon");

    updateCartCount();

    /* Hide checkout form */

    const checkoutLayout =
        document.getElementById(
            "checkout-layout"
        );

    if (checkoutLayout) {
        checkoutLayout.classList.add("hidden");
    }

    /* Show success section */

    const successSection =
        document.getElementById(
            "order-success"
        );

    if (successSection) {
        successSection.classList.remove(
            "hidden"
        );
    }

    const orderIdElement =
        document.getElementById("order-id");

    const orderTimeElement =
        document.getElementById(
            "order-time"
        );

    if (orderIdElement) {
        orderIdElement.textContent =
            orderId;
    }

    if (orderTimeElement) {
        orderTimeElement.textContent =
            orderTime;
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    toast("Order placed successfully");
}

/* ================= PHONE VALIDATION ================= */

function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}

/* ================= PINCODE VALIDATION ================= */

function isValidPincode(pincode) {
    return /^\d{6}$/.test(pincode);
}

/* ================= CHECKOUT ERROR ================= */

function showCheckoutError(
    input,
    message
) {
    clearCheckoutErrors();

    if (!input) {
        return;
    }

    input.classList.add("input-error");

    let error =
        input.parentElement.querySelector(
            ".form-error"
        );

    if (!error) {
        error =
            document.createElement("small");

        error.className = "form-error";

        input.parentElement.appendChild(
            error
        );
    }

    error.textContent = message;

    input.focus();
}

/* ================= CLEAR ERRORS ================= */

function clearCheckoutErrors() {
    document
        .querySelectorAll(".form-error")
        .forEach(function (element) {
            element.remove();
        });

    document
        .querySelectorAll(".input-error")
        .forEach(function (element) {
            element.classList.remove(
                "input-error"
            );
        });
}

/* ================= EMAIL VALIDATION ================= */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}
