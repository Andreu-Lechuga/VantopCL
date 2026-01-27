/**
 * VanTop - Servicio de Transporte Privado
 * Script de Validación de Formularios
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los formularios
    const bookingForm = document.getElementById('booking-form');
    const contactForm = document.getElementById('contact-form');
    
    // Mensajes de error en español e inglés
    const errorMessages = {
        'es': {
            'required': 'Este campo es obligatorio',
            'email': 'Por favor, introduce un correo electrónico válido',
            'phone': 'Por favor, introduce un número de teléfono válido',
            'date': 'Por favor, selecciona una fecha válida',
            'time': 'Por favor, selecciona una hora válida',
            'minLength': 'Este campo debe tener al menos {min} caracteres',
            'maxLength': 'Este campo no puede tener más de {max} caracteres',
            'future': 'La fecha debe ser futura'
        },
        'en': {
            'required': 'This field is required',
            'email': 'Please enter a valid email address',
            'phone': 'Please enter a valid phone number',
            'date': 'Please select a valid date',
            'time': 'Please select a valid time',
            'minLength': 'This field must have at least {min} characters',
            'maxLength': 'This field cannot have more than {max} characters',
            'future': 'The date must be in the future'
        }
    };
    
    // Función para obtener el idioma actual
    function getCurrentLanguage() {
        return localStorage.getItem('vantop-language') || 'es';
    }
    
    // Función para mostrar mensajes de error
    function showError(input, message) {
        // Eliminar error existente si lo hay
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Crear y añadir nuevo mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        
        // Añadir borde rojo al input
        input.style.borderColor = '#e74c3c';
        
        // Insertar mensaje después del input
        input.parentElement.appendChild(errorDiv);
    }
    
    // Función para limpiar errores
    function clearError(input) {
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }
    
    // Validadores
    const validators = {
        required: function(value) {
            return value.trim() !== '';
        },
        email: function(value) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(value);
        },
        phone: function(value) {
            // Acepta formatos como: +56 9 1234 5678, +56912345678, 912345678
            const regex = /^(\+?56)?(\s?\d{1})(\s?\d{4})(\s?\d{4})$/;
            return regex.test(value);
        },
        date: function(value) {
            return value !== '';
        },
        time: function(value) {
            return value !== '';
        },
        minLength: function(value, min) {
            return value.length >= min;
        },
        maxLength: function(value, max) {
            return value.length <= max;
        },
        future: function(value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        }
    };
    
    // Función para validar un campo
    function validateField(input, rules) {
        const value = input.value;
        const currentLang = getCurrentLanguage();
        
        // Limpiar error previo
        clearError(input);
        
        // Validar reglas
        for (const rule in rules) {
            if (rule === 'required' && rules[rule] && !validators.required(value)) {
                showError(input, errorMessages[currentLang].required);
                return false;
            }
            
            if (value.trim() !== '') {  // Solo validar otras reglas si el campo no está vacío
                if (rule === 'email' && rules[rule] && !validators.email(value)) {
                    showError(input, errorMessages[currentLang].email);
                    return false;
                }
                
                if (rule === 'phone' && rules[rule] && !validators.phone(value)) {
                    showError(input, errorMessages[currentLang].phone);
                    return false;
                }
                
                if (rule === 'date' && rules[rule] && !validators.date(value)) {
                    showError(input, errorMessages[currentLang].date);
                    return false;
                }
                
                if (rule === 'time' && rules[rule] && !validators.time(value)) {
                    showError(input, errorMessages[currentLang].time);
                    return false;
                }
                
                if (rule === 'minLength' && !validators.minLength(value, rules[rule])) {
                    let message = errorMessages[currentLang].minLength.replace('{min}', rules[rule]);
                    showError(input, message);
                    return false;
                }
                
                if (rule === 'maxLength' && !validators.maxLength(value, rules[rule])) {
                    let message = errorMessages[currentLang].maxLength.replace('{max}', rules[rule]);
                    showError(input, message);
                    return false;
                }
                
                if (rule === 'future' && rules[rule] && !validators.future(value)) {
                    showError(input, errorMessages[currentLang].future);
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Validación del formulario de reserva
    if (bookingForm) {
        // Definir reglas de validación para cada campo
        const bookingRules = {
            'name': { required: true, minLength: 3, maxLength: 100 },
            'email': { required: true, email: true },
            'phone': { required: true, phone: true },
            'service-type': { required: true },
            'date': { required: true, date: true, future: true },
            'time': { required: true, time: true },
            'origin': { required: true },
            'destination': { required: true }
        };
        
        // Validar al enviar el formulario
        bookingForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validar cada campo
            for (const fieldName in bookingRules) {
                const field = bookingForm.querySelector(`#${fieldName}`);
                if (field) {
                    if (!validateField(field, bookingRules[fieldName])) {
                        isValid = false;
                    }
                }
            }
            
            // Prevenir envío si hay errores
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Validar campos al perder el foco
        for (const fieldName in bookingRules) {
            const field = bookingForm.querySelector(`#${fieldName}`);
            if (field) {
                field.addEventListener('blur', function() {
                    validateField(this, bookingRules[fieldName]);
                });
                
                // Limpiar error al comenzar a escribir
                field.addEventListener('input', function() {
                    clearError(this);
                });
            }
        }
    }
    
    // Validación del formulario de contacto rápido
    if (contactForm) {
        // Definir reglas de validación para cada campo
        const contactRules = {
            'quick-name': { required: true, minLength: 3, maxLength: 100 },
            'quick-email': { required: true, email: true },
            'quick-message': { required: true, minLength: 10, maxLength: 500 }
        };
        
        // Validar al enviar el formulario
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validar cada campo
            for (const fieldName in contactRules) {
                const field = contactForm.querySelector(`#${fieldName}`);
                if (field) {
                    if (!validateField(field, contactRules[fieldName])) {
                        isValid = false;
                    }
                }
            }
            
            // Prevenir envío si hay errores
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Validar campos al perder el foco
        for (const fieldName in contactRules) {
            const field = contactForm.querySelector(`#${fieldName}`);
            if (field) {
                field.addEventListener('blur', function() {
                    validateField(this, contactRules[fieldName]);
                });
                
                // Limpiar error al comenzar a escribir
                field.addEventListener('input', function() {
                    clearError(this);
                });
            }
        }
    }
});
