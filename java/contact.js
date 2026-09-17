/* =========================================================
   FOODHUB - CONTACT PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    setupContactForm();
});

/* ================= CONTACT FORM ================= */

function setupContactForm() {
    const form = document.getElementById("contact-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInput =
            document.getElementById("contact-name");

        const emailInput =
            document.getElementById("contact-email");

        const subjectInput =
            document.getElementById("contact-subject");

        const messageInput =
            document.getElementById("contact-message");

        const successMessage =
            document.getElementById("contact-success");

        const name = nameInput
            ? nameInput.value.trim()
            : "";

        const email = emailInput
            ? emailInput.value.trim()
            : "";

        const subject = subjectInput
            ? subjectInput.value.trim()
            : "";

        const message = messageInput
            ? messageInput.value.trim()
            : "";

        /* ================= VALIDATION ================= */

        if (name === "") {
            showFormError(
                nameInput,
                "Please enter your name."
            );
            return;
        }

        if (email === "") {
            showFormError(
                emailInput,
                "Please enter your email."
            );
            return;
        }

        if (!isValidEmail(email)) {
            showFormError(
                emailInput,
                "Please enter a valid email address."
            );
            return;
        }

        if (subject === "") {
            showFormError(
                subjectInput,
                "Please enter a subject."
            );
            return;
        }

        if (message === "") {
            showFormError(
                messageInput,
                "Please enter your message."
            );
            return;
        }

        if (message.length < 10) {
            showFormError(
                messageInput,
                "Message should contain at least 10 characters."
            );
            return;
        }

        /* ================= SUCCESS ================= */

        clearFormError();

        if (successMessage) {
            successMessage.textContent =
                "Your message has been sent successfully!";

            successMessage.classList.remove("hidden");
        }

        toast("Message sent successfully");

        form.reset();

        /* Hide success message after 5 seconds */

        setTimeout(function () {
            if (successMessage) {
                successMessage.classList.add("hidden");
            }
        }, 5000);
    });

    /* ================= CLEAR ERRORS ================= */

    form.querySelectorAll("input, textarea, select")
        .forEach(function (field) {
            field.addEventListener(
                "input",
                function () {
                    field.classList.remove(
                        "input-error"
                    );
                }
            );
        });
}

/* ================= EMAIL VALIDATION ================= */

function isValidEmail(email) {
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}

/* ================= FORM ERROR ================= */

function showFormError(input, message) {
    clearFormError();

    if (!input) {
        return;
    }

    input.classList.add("input-error");

    let errorElement =
        input.parentElement.querySelector(
            ".form-error"
        );

    if (!errorElement) {
        errorElement =
            document.createElement("small");

        errorElement.className =
            "form-error";

        input.parentElement.appendChild(
            errorElement
        );
    }

    errorElement.textContent = message;

    input.focus();
}

/* ================= CLEAR FORM ERROR ================= */

function clearFormError() {
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
