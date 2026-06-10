const contactForms = document.querySelectorAll('#contactForm, #contactFormExtended');

contactForms.forEach((form) => {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop the form from reloading or navigating away
        
        const formData = new FormData(form);

        const fieldsets = form.querySelectorAll('fieldset');
        let formIsValid = true;

        fieldsets.forEach((fieldset) => {
            const isHidden = fieldset.classList.contains("hidden");
            const isRequired = fieldset.classList.contains("required");
            const errorMsg = fieldset.querySelector(".error-msg");

            if (isHidden || !isRequired) {
                if (errorMsg) errorMsg.style.display = "none";
                return;
            }

            const hasRadio = fieldset.querySelector('input[type="radio"]') !== null;
            const hasCheckbox = fieldset.querySelector('input[type="checkbox"]');
            let fieldsetValid = true;

            if (hasRadio) {
                fieldsetValid = fieldset.querySelector('input[type="radio"]:checked') !== null;
            } else if (hasCheckbox) {
                fieldsetValid = fieldset.querySelector('input[type="checkbox"]:checked') !== null;
            }

            if (errorMsg) {
                if (!fieldsetValid) {
                    errorMsg.style.display = "block";
                    formIsValid = false;
                } else {
                    errorMsg.style.display = "none";
                }
            }
        });

        if (!formIsValid) {
            e.preventDefault();
            return;
        }
        
        // Google Script Web App URL
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbynApdCMYAKGf3j-7-4hrxLKYINImFOzpITsgapV583myuHgx-UQl7KcbJhRydYpaj5ug/exec'; 
        
        // Change button text to show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerText = 'Wird gesendet...';
        submitBtn.disabled = true;

        const payload = new URLSearchParams(formData);
        console.log(payload.toString());

        // Send the data using standard URL-encoded format for Apps Script compatibility
        fetch(scriptUrl, {
            method: 'POST',
            body: payload
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                // To do: add success message
                submitBtn.innerText = '✔️ Gesendet';
                submitBtn.disabled = false;
                alert("Danke für Deine Anfrage! Ich melde mich in Kürze bei Dir.")
            } else {
                alert('Etwas ist schief gegangen. Bitte versuche es später erneut.');
                console.log(data.error);
                submitBtn.innerText = 'Senden';
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Systemfehler. Bitte versuche es später erneut.');
            submitBtn.innerText = 'Senden';
            submitBtn.disabled = false;
        });
    });
})