// registration.js - Form validation and submission for registration page

document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    const personalNumberInput = document.getElementById('personal-number');
    const addGuardianCheckbox = document.getElementById('add-guardian');
    const guardianSection = document.getElementById('guardian-section');
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');
    const modalConfirm = document.getElementById('modal-confirm');

    // Function to calculate age from personnummer
    function calculateAge(personnummer) {
        if (!personnummer || personnummer.length < 8) return null;
        const birthYear = parseInt(personnummer.substring(0, 4));
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    }

    // Function to toggle guardian section
    function toggleGuardianSection() {
        const personnummer = personalNumberInput.value.replace(/\D/g, '');
        const age = calculateAge(personnummer);
        const showGuardian = (age !== null && age < 18) || addGuardianCheckbox.checked;
        
        if (showGuardian) {
            guardianSection.style.display = 'block';
            // Make guardian fields required when visible
            const guardianFields = guardianSection.querySelectorAll('input');
            guardianFields.forEach(field => field.setAttribute('required', ''));
        } else {
            guardianSection.style.display = 'none';
            // Remove required when hidden
            const guardianFields = guardianSection.querySelectorAll('input');
            guardianFields.forEach(field => field.removeAttribute('required'));
        }
    }

    // Event listeners for guardian section toggle
    if (personalNumberInput) {
        personalNumberInput.addEventListener('input', toggleGuardianSection);
        personalNumberInput.addEventListener('blur', toggleGuardianSection);
    }

    if (addGuardianCheckbox) {
        addGuardianCheckbox.addEventListener('change', toggleGuardianSection);
    }

    // Form validation
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // In a real application, you would send the form data to a server here
                console.log('Form submitted successfully');
                
                // Show success modal
                successModal.classList.add('active');
                
                // Reset form
                registrationForm.reset();
                toggleGuardianSection();
            }
        });
    }

    // Close modal handlers
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            successModal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    // Real-time validation
    const formInputs = registrationForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });

    // Validation functions
    function validateForm() {
        let isValid = true;
        const formInputs = registrationForm.querySelectorAll('input, select, textarea');
        
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        // Clear previous error
        clearError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && value === '') {
            showError(field, 'Detta fält är obligatoriskt');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, 'Ange en giltig e-postadress');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value !== '') {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value)) {
                showError(field, 'Ange ett giltigt telefonnummer');
                return false;
            }
        }
        
        // Personal number validation (simple version)
        if (fieldName === 'personal-number' && value !== '') {
            const personalNumberRegex = /^\d{8}-\d{4}$/;
            if (!personalNumberRegex.test(value)) {
                showError(field, 'Ange personnummer i formatet YYYYMMDD-XXXX');
                return false;
            }
        }
        
        // Postal code validation
        if (fieldName === 'postal-code' && value !== '') {
            const postalCodeRegex = /^\d{3}\s?\d{2}$/;
            if (!postalCodeRegex.test(value)) {
                showError(field, 'Ange ett giltigt postnummer');
                return false;
            }
        }
        
        return true;
    }

    function showError(field, message) {
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        field.style.borderColor = '#ff6b6b';
    }

    function clearError(field) {
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        field.style.borderColor = '';
    }

    // Format personal number input (already declared above)
    if (personalNumberInput) {
        personalNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 8) {
                value = value.substring(0, 8) + '-' + value.substring(8, 12);
            }
            
            e.target.value = value;
        });
    }

    // Format postal code input
    const postalCodeInput = document.getElementById('postal-code');
    if (postalCodeInput) {
        postalCodeInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 3) {
                value = value.substring(0, 3) + ' ' + value.substring(3, 5);
            }
            
            e.target.value = value;
        });
    }
});