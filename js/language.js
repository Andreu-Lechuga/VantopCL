/**
 * VanTop - Servicio de Transporte Privado
 * Script de Cambio de Idioma
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const footerLanguageToggle = document.getElementById('footer-language-toggle');
    const currentLangElements = document.querySelectorAll('.current-lang');
    
    // Referencias a los elementos del menú desplegable de banderas
    const flagLinks = document.querySelectorAll('.submenu-link');
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    // Objeto para almacenar las traducciones cargadas
    let translations = {};
    
    // Función para cargar un archivo de traducción
    async function loadTranslation(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Error al cargar el idioma ${lang}`);
            }
            const data = await response.json();
            translations[lang] = data;
            return data;
        } catch (error) {
            console.error(`Error cargando el idioma ${lang}:`, error);
            return null;
        }
    }
    
    // Función para obtener una traducción específica usando notación de puntos
    // Ejemplo: getTranslationValue('es', 'hero.title-line1') devolverá el valor de translations['es'].hero.title-line1
    function getTranslationValue(lang, key) {
        if (!translations[lang]) return null;
        
        const keys = key.split('.');
        let value = translations[lang];
        
        for (const k of keys) {
            if (value === undefined || value === null) return null;
            value = value[k];
        }
        
        return value;
    }
    
    // Función para convertir claves de data-lang a formato de puntos para JSON
    function convertKeyToJsonPath(key) {
        // Mapeo de claves específicas a sus rutas JSON
        const keyMappings = {
            // Navegación
            'nav.services': 'nav.services',
            'nav.vehicle': 'nav.vehicle',
            'nav.driver': 'nav.driver',
            'nav.booking': 'nav.booking',
            'nav.contact': 'nav.contact',
            
            // Hero Section
            'hero.title-line1': 'hero.title-line1',
            'hero.title-line2': 'hero.title-line2',
            'hero.subtitle': 'hero.subtitle',
            'hero.location': 'hero.location',
            'hero.cta': 'hero.cta',
            'hero.availability': 'hero.availability',
            
            // Services Section
            'services.title': 'services.title',
            'services.airport.title': 'services.airport.title',
            'services.airport.desc': 'services.airport.desc',
            'services.events.title': 'services.events.title',
            'services.events.desc': 'services.events.desc',
            'services.hourly.title': 'services.hourly.title',
            'services.hourly.desc': 'services.hourly.desc',
            'services.city.title': 'services.city.title',
            'services.city.desc': 'services.city.desc',
            
            // Vehicle Section
            'vehicle.title': 'vehicle.title',
            'vehicle.model': 'vehicle.model',
            'vehicle.feature1': 'vehicle.feature1',
            'vehicle.feature2': 'vehicle.feature2',
            'vehicle.feature3': 'vehicle.feature3',
            'vehicle.feature4': 'vehicle.feature4',
            'vehicle.feature5': 'vehicle.feature5',
            'vehicle.feature6': 'vehicle.feature6',
            'vehicle.feature7': 'vehicle.feature7',
            'vehicle.description': 'vehicle.description',
            
            // Driver Section
            'driver-title': 'driver.title',
            'driver-name': 'driver.name',
            'driver-age': 'driver.age',
            'driver-license': 'driver.license',
            'driver-experience': 'driver.experience',
            'driver-description': 'driver.description',
            
            // Booking Form Section
            'booking-title': 'booking.title',
            'form-name': 'booking.form.name',
            'form-email': 'booking.form.email',
            'form-phone': 'booking.form.phone',
            'form-service-type': 'booking.form.serviceType',
            'form-select-service': 'booking.form.selectService',
            'form-service-airport': 'booking.form.airport',
            'form-service-event': 'booking.form.event',
            'form-service-hourly': 'booking.form.hourly',
            'form-service-daily': 'booking.form.daily',
            'form-service-city': 'booking.form.city',
            'form-service-intercity': 'booking.form.intercity',
            'form-date': 'booking.form.date',
            'form-time': 'booking.form.time',
            'form-origin': 'booking.form.origin',
            'form-destination': 'booking.form.destination',
            'form-comments': 'booking.form.comments',
            'form-submit': 'booking.form.submit',
            
            // Contact Section
            'contact.title': 'contact.title',
            'contact.phone.title': 'contact.phone.title',
            'contact.phone.value': 'contact.phone.value',
            'contact.email.title': 'contact.email.title',
            'contact.email.value': 'contact.email.value',
            'contact.instagram.title': 'contact.instagram.title',
            'contact.instagram.value': 'contact.instagram.value',
            'contact.form.title': 'contact.form.title',
            'contact.form.name': 'contact.form.name',
            'contact.form.email': 'contact.form.email',
            'contact.form.message': 'contact.form.message',
            'contact.form.submit': 'contact.form.submit',
            
            // Footer
            'footer.home': 'footer.home',
            'footer.services': 'footer.services',
            'footer.vehicle': 'footer.vehicle',
            'footer.driver': 'footer.driver',
            'footer.booking': 'footer.booking',
            'footer.contact': 'footer.contact',
            'footer.copyright': 'footer.copyright'
        };
        
        // Si existe un mapeo específico, usarlo
        if (keyMappings[key]) {
            return keyMappings[key];
        }
        
        // Si no hay mapeo específico, convertir guiones a puntos
        return key.replace(/-/g, '.');
    }
    
    // Función para mostrar todas las banderas
    function updateFlagVisibility(lang) {
        // Mostrar todas las banderas
        submenuItems.forEach(item => {
            item.classList.remove('hidden-flag');
        });
    }
    
    // Función para cambiar el idioma
    async function changeLanguage(lang) {
        // Cargar el archivo de traducción si aún no está cargado
        if (!translations[lang]) {
            await loadTranslation(lang);
        }
        
        // Si no se pudo cargar la traducción, mostrar error y salir
        if (!translations[lang]) {
            console.error(`No se pudo cargar el idioma ${lang}`);
            return;
        }
        
        // Actualizar todos los elementos con atributo data-lang
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            const jsonPath = convertKeyToJsonPath(key);
            
            // Obtener la traducción
            const translation = getTranslationValue(lang, jsonPath);
            
            // Aplicar la traducción si se encontró
            if (translation) {
                // Para elementos que contienen iconos, necesitamos preservarlos
                if (key.includes('feature') || key.includes('license') || key.includes('experience')) {
                    // Extraer el icono del HTML actual
                    const iconMatch = element.innerHTML.match(/<i class="[^"]+"><\/i>/);
                    const icon = iconMatch ? iconMatch[0] : '';
                    
                    // Si hay un icono, agregarlo al principio de la traducción
                    if (icon) {
                        element.innerHTML = `${icon} ${translation}`;
                    } else {
                        element.innerHTML = translation;
                    }
                } else {
                    element.innerHTML = translation;
                }
            }
        });
        
        // Actualizar la visibilidad de las banderas
        updateFlagVisibility(lang);
        
        // Actualizar placeholders
        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const key = element.getAttribute('data-lang-placeholder');
            const jsonPath = convertKeyToJsonPath(key);
            const translation = getTranslationValue(lang, jsonPath);
            
            if (translation) {
                element.placeholder = translation;
            }
        });
        
        // Actualizar el texto del botón de idioma
        currentLangElements.forEach(el => {
            el.textContent = lang.toUpperCase();
        });
        
        // Actualizar el estado de los checkboxes de toggle
        const checkboxes = document.querySelectorAll('.language-toggle-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = lang === 'en';
        });
        
        // Guardar preferencia en localStorage
        localStorage.setItem('vantop-language', lang);
        
        // Actualizar el atributo lang del HTML
        document.documentElement.lang = lang;
    }
    
    // Detectar idioma preferido o usar el guardado en localStorage
    function detectLanguage() {
        const savedLanguage = localStorage.getItem('vantop-language');
        
        if (savedLanguage) {
            return savedLanguage;
        }
        
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('es')) return 'es';
        if (browserLang.startsWith('pt')) return 'pt';
        return 'en'; // Inglés como fallback
    }
    
    // Establecer idioma inicial
    const initialLanguage = detectLanguage();
    changeLanguage(initialLanguage);
    
    // Event listener para cambio de idioma en el footer
    if (footerLanguageToggle) {
        footerLanguageToggle.addEventListener('click', function() {
            const currentLang = localStorage.getItem('vantop-language') || initialLanguage;
            // Rotar entre los idiomas disponibles: es -> en -> pt -> es
            let newLang;
            if (currentLang === 'es') newLang = 'en';
            else if (currentLang === 'en') newLang = 'pt';
            else newLang = 'es';
            
            changeLanguage(newLang);
        });
    }
    
    // Event listeners para las banderas del menú desplegable
    if (flagLinks && flagLinks.length > 0) {
        // Bandera de España
        flagLinks[0].addEventListener('click', function(e) {
            e.preventDefault();
            changeLanguage('es');
        });
        
        // Bandera de EEUU
        if (flagLinks[1]) {
            flagLinks[1].addEventListener('click', function(e) {
                e.preventDefault();
                changeLanguage('en');
            });
        }
        
        // Bandera de Brasil
        if (flagLinks[2]) {
            flagLinks[2].addEventListener('click', function(e) {
                e.preventDefault();
                changeLanguage('pt');
            });
        }
    }
});
