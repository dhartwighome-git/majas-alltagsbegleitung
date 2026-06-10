// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBv7_fz-X9GtsuTNu-yII4d72So6F24eDk",
    authDomain: "ghn-care.firebaseapp.com",
    projectId: "ghn-care",
    storageBucket: "ghn-care.firebasestorage.app",
    messagingSenderId: "1037138646761",
    appId: "1:1037138646761:web:356baadc89cd4cb1250278"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("login-form");
const errorEl = document.getElementById("login-error");
const emailSymbol = document.getElementById("email-symbol");
const emailEl = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

// To do: Sign up

// Log in
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        form.reset();
    } catch (err) {
        errorEl.textContent = err.message;
    }
});

// Log out
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
});

// Protect page
onAuthStateChanged(auth, (user) => {
    const isLoggedIn = !!user;

    document.body.classList.toggle("logged-in", isLoggedIn);
    document.body.classList.toggle("logged-out", !isLoggedIn);

    if (isLoggedIn) {
        emailEl.classList.remove("hidden");
        emailSymbol.classList.remove("hidden");
        emailEl.textContent = user.email;
        logoutBtn.classList.remove("hidden");
    } else {
        // Remove log-out button
        emailEl.classList.add("hidden");
        emailSymbol.classList.add("hidden");
        logoutBtn.classList.add("hidden");
    }
});

// Optional globals
window.app = app;
window.auth = auth;

// Header animation
const SCROLL_THRESHOLD = 50;
window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
    document.body.classList.add('scrolled');
    } else {
    document.body.classList.remove('scrolled');
    }
});

// // Fill reviews container
// const reviewsContainer = document.getElementById("text-container-reviews");

// // Fetch reviews
// const reviews = getReviews();
// async function getReviews() {
//     const snapshot = await getDocs(collection(db, "reviews"));

//     snapshot.forEach(doc => {
//         const data = doc.data();
//         const reviewBox = createReviewBox(data);
//         reviewsContainer.appendChild(reviewBox);
//     })
// }

// // Display reviews
// function createReviewBox(data) {
//     // Fill reviews container
//     /* Data:
//         - gender*
//         - firstName*
//         - lastName*
//         - email*
//         - birthday*
//         - title*
//         - message*,
//         - starRating*
//     */
//     const box = document.createElement("div");
//     box.className = "text-container box-shadow";

//     // Top container
//     const topContainer = document.createElement("div");
//     topContainer.className = "top-container"

//     // Name
//     const person = document.createElement("h3");
//     person.className = "review-person";
//     person.textContent = `${data.firstName ?? ""} ${data.lastName ?? ""}`;

//     // Star Rating
//     const starRating = document.createElement("p");
//     starRating.className = "review-rating";
//     const rating = Math.floor(data.starRating || 5);
//     starRating.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);

//     topContainer.append(person, starRating)

//     // Message container
//     const messageContainer = document.createElement("div");
//     messageContainer.className = "message-container"

//     // Title
//     const reviewTitle = document.createElement("h4");
//     reviewTitle.className = "review-title";
//     const reviewTitleText = data.reviewTitle || ""
//     reviewTitle.textContent = reviewTitleText;

//     // Message
//     const message = document.createElement("p");
//     message.className = "review-message";
//     const messageText = data.message || ""
//     message.textContent = messageText;

//     box.append(topContainer);
//     if (reviewTitleText !== "" || messageText !== "") {
//         if (reviewTitleText !== "") messageContainer.append(reviewTitle)
//         if (messageText !== "") messageContainer.append(message);
//         box.append(messageContainer);
//     }
//     return box;
// }

// // Helper function
// function calculateAge(birthday) {
//     let birthDate;

//     if (!birthday) return null;

//     // Firestore Timestamp
//     if (birthday.toDate) {
//         birthDate = birthday.toDate();
//     }
//     // String or Date
//     else {
//         birthDate = new Date(birthday);
//     }

//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();

//     const hasHadBirthdayThisYear =
//         today.getMonth() > birthDate.getMonth() ||
//         (today.getMonth() === birthDate.getMonth() &&
//         today.getDate() >= birthDate.getDate());

//     if (!hasHadBirthdayThisYear) {
//         age--;
//     }

//     return age;
// }

// const contactform = document.getElementById('contactForm');

// contactform.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const data = {
//         name: document.getElementById("contactFormName").value,
//         email: document.getElementById("contactFormEmail").value,
//         message: document.getElementById("contactFormMessage").value
//     };

//     const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     });

//     const result = await res.json();
//     alert(result.message);
//     contactform.reset();
// });

const header = document.querySelector("header");

// dynamically measure header height
function updateHeaderOffset() {
    const height = header.offsetHeight;
    document.documentElement.style.setProperty("--header-offset", height + "px")
}

header.addEventListener("transitionend", (e) => {
    if(e.propertyName === "height" || e.propertyName === "min-height") {
        updateHeaderOffset();
    }
})

window.addEventListener("load", updateHeaderOffset);
window.addEventListener("resize", updateHeaderOffset);
window.addEventListener("scroll", updateHeaderOffset);


const homeLinks = document.querySelectorAll(".home-link");
const showImpressumBtn = document.getElementById("show-impressum");
const showDatenschutzBtn = document.getElementById("show-datenschutz");

const homeView = document.getElementById("home");
const impressumView = document.getElementById("impressum");
const datenschutzView = document.getElementById("datenschutz");

homeLinks.forEach(link => {
    link.addEventListener("click", () => {
        homeView.classList.remove("hidden");
        homeView.classList.add("flex-view")
        impressumView.classList.add("hidden");
        datenschutzView.classList.add("hidden");
    })
})

showImpressumBtn.addEventListener("click", () => {
    homeView.classList.add("hidden");
    impressumView.classList.remove("hidden");
    datenschutzView.classList.add("hidden");
})

showDatenschutzBtn.addEventListener("click", () => {
    homeView.classList.add("hidden");
    impressumView.classList.add("hidden");
    datenschutzView.classList.remove("hidden");
})

function closeAll() {
    document.querySelectorAll(".js-collapsible:not(.permanent *)").forEach(el => {
        el.classList.add("collapsed");
    });

    document.querySelectorAll(".js-arrow:not(.permanent *)").forEach(el => {
        el.classList.remove("is-rotated");
    });
}

const allToggleButtons = document.querySelectorAll(".js-toggle-btn");

console.log(allToggleButtons);

allToggleButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.stopPropagation();

        const currentGroup = event.currentTarget.closest(".js-collapsible-group");
        const btnArrow = button.querySelector(".js-arrow");
        const groupCollapsibles = currentGroup.querySelectorAll(".js-collapsible");

        const isOpen = !groupCollapsibles[0].classList.contains("collapsed");
        closeAll();

        if (isOpen) {
            groupCollapsibles.forEach(item => {
                item.classList.add("collapsed");
            });
            btnArrow.classList.remove("is-rotated");
            return;
        }

        groupCollapsibles.forEach(item => {
            item.classList.remove("collapsed");
        });
        btnArrow.classList.add("is-rotated");
    });
});

document.addEventListener("click", () => {
    closeAll();
})

function clearInputs(container) {
    const inputs = container.querySelectorAll("input");
    inputs.forEach(input => {
        if (input.type === "checkbox" << input.type === "radio") {
            input.checked = false;
        } else {
            input.value = "";
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Gather all your flex items
    const items = document.querySelectorAll('.container');
    
    items.forEach(item => {
        // 2. Read the custom data-order attribute value
        const orderValue = item.getAttribute('data-order');
        
        // 3. If the value exists, apply it straight to the element's CSS order property
        if (orderValue !== null) {
            item.style.order = orderValue;
        }
    });

    const customCheckbox = document.getElementById('custom');
    const customTextInput = document.getElementById('customText');

    if (customCheckbox && customTextInput) {
        customCheckbox.addEventListener('change', () => {
            // If checked, disabled is false. If unchecked, disabled is true.
            customTextInput.disabled = !customCheckbox.checked;

            // Optional: Clear the text field if they uncheck the box
            if (!customCheckbox.checked) {
                customTextInput.value = '';
            }
        });
    }

    const fieldsetPflegestufe = document.getElementById("Pflegestufe");
    const fieldsetPflegeperson = document.getElementById("Pflegeperson");

    fieldsetPflegestufe.addEventListener("change", () => {
        const choice = fieldsetPflegestufe.querySelector("input[type=radio]:checked");
        if (choice) {
            if (choice.id !== "none") {
                fieldsetPflegeperson.classList.remove("hidden")
            } else {
                fieldsetPflegeperson.classList.add("hidden");
                clearInputs(fieldsetPflegeperson);
            }
        }
    })
})

// document.querySelector('form').addEventListener('submit', (event) => {
//   const fieldsets = document.querySelectorAll('fieldset');
//   const errorMsg = document.getElementById('error-msg');
  
//   // Checks if AT LEAST ONE fieldset contains a checked box
//   const legalSubmission = Array.from(fieldsets).some(fieldset => 
//     fieldset.querySelector('input[type="checkbox"]:checked')
//   );

//   if (!legalSubmission) {
//     event.preventDefault();
//     errorMsg.style.display = 'block'; // Show error
//   } else {
//     errorMsg.style.display = 'none';  // Hide error if they fixed it
//   }
// });

const toggleButtons = document.querySelectorAll(".form-toggle-btn");

toggleButtons.forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {

        const simpleForm = document.getElementById("contactForm");
        const extendedForm = document.getElementById("contactFormExtended");

        simpleForm.classList.toggle('hidden');
        extendedForm.classList.toggle('hidden');
    });
})
