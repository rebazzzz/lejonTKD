// contact.js - Contact form functionality and FAQ toggles

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const faqQuestions = document.querySelectorAll('.faq-question');

    // FAQ toggle functionality
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('show');
                }
            });
            
            // Toggle current item
            this.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('show');
        });
    });

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                // In a real application, you would send the form data to a server here
                console.log('Contact form submitted successfully');
                
                // Show success message
                showFormSuccess();
                
                // Reset form
                contactForm.reset();
            }
        });
    }

    // Form validation
    function validateContactForm() {
        let isValid = true;
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        
        formInputs.forEach(input => {
            if (input.hasAttribute('required') && input.value.trim() === '') {
                isValid = false;
                showFieldError(input, 'Detta fält är obligatoriskt');
            } else {
                clearFieldError(input);
            }
            
            // Email validation
            if (input.type === 'email' && input.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    isValid = false;
                    showFieldError(input, 'Ange en giltig e-postadress');
                }
            }
        });
        
        return isValid;
    }

    function showFieldError(field, message) {
        // Remove any existing error
        clearFieldError(field);
        
        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ff6b6b';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        // Insert after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
        
        // Style the field
        field.style.borderColor = '#ff6b6b';
    }

    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    function showFormSuccess() {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <div style="background: var(--color-accent); color: var(--color-surface); padding: 1rem; border-radius: var(--radius); text-align: center; margin-top: 1rem;">
                <p style="margin: 0; font-weight: 500;">Tack för ditt meddelande! Vi återkommer så snart som möjligt.</p>
            </div>
        `;
        
        // Insert before the form
        contactForm.parentNode.insertBefore(successMessage, contactForm);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Real-time validation
    const formInputs = contactForm?.querySelectorAll('input, textarea');
    formInputs?.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && this.value.trim() === '') {
                showFieldError(this, 'Detta fält är obligatoriskt');
            } else {
                clearFieldError(this);
            }
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
});