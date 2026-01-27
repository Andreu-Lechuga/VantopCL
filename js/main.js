/**
 * VanTop - Servicio de Transporte Privado
 * Script Principal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const header = document.querySelector('.header');
    const hamburgerBtn = document.querySelector('.hamburger input');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLanguageToggle = document.getElementById('mobile-language-toggle');
    const mobileLanguageMenu = document.querySelector('.mobile-language-menu .item');
    const mobileLanguageLink = document.querySelector('.mobile-language-menu .link');
    
    // Crear overlay para el menú móvil
    const menuOverlay = document.createElement('div');
    menuOverlay.classList.add('menu-overlay');
    document.body.appendChild(menuOverlay);
    
    // Función para cambiar la imagen principal en la galería del vehículo
    window.changeMainImage = function(src) {
        const mainImage = document.getElementById('main-vehicle-img');
        if (mainImage) {
            mainImage.src = src;
            
            // Actualizar la clase active en las miniaturas
            const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
            thumbs.forEach(thumb => {
                if (thumb.getAttribute('src') === src) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });
        }
    };
    
    // Slider de miniaturas con soporte táctil
    const initThumbsSlider = function() {
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        const thumbsContainer = document.querySelector('.gallery-thumbs');
        const thumbsWrapper = document.querySelector('.gallery-thumbs-wrapper');
        
        if (!prevBtn || !nextBtn || !thumbsContainer || !thumbsWrapper) return;
        
        let position = 0;
        const thumbWidth = 80; // Ancho de cada miniatura
        const gap = 8; // Espacio entre miniaturas (--spacing-sm)
        const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
        const maxPosition = Math.max(0, (thumbs.length * (thumbWidth + gap)) - thumbsWrapper.offsetWidth);
        
        // Función para actualizar la posición del slider
        const updateSliderPosition = () => {
            position = Math.max(0, Math.min(position, maxPosition)); // Asegurar que la posición esté dentro de los límites
            thumbsContainer.style.transform = `translateX(${-position}px)`;
            
            // Actualizar visibilidad de los botones de navegación
            if (position <= 0) {
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'default';
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.cursor = 'pointer';
            }
            
            if (position >= maxPosition) {
                nextBtn.style.opacity = '0.5';
                nextBtn.style.cursor = 'default';
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.cursor = 'pointer';
            }
        };
        
        // Evento para el botón anterior
        prevBtn.addEventListener('click', () => {
            // Mover por el ancho de una miniatura + gap
            position = Math.max(0, position - (thumbWidth + gap));
            updateSliderPosition();
        });
        
        // Evento para el botón siguiente
        nextBtn.addEventListener('click', () => {
            // Mover por el ancho de una miniatura + gap
            position = Math.min(maxPosition, position + (thumbWidth + gap));
            updateSliderPosition();
        });
        
        // Inicializar estado de los botones
        updateSliderPosition();
        
        // Variables para navegación táctil
        let touchStartX = 0;
        let touchEndX = 0;
        let initialPosition = 0;
        let isDragging = false;
        
        // Eventos táctiles para dispositivos móviles
        thumbsWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            initialPosition = position;
            isDragging = true;
            
            // Desactivar transición durante el arrastre para una respuesta inmediata
            thumbsContainer.style.transition = 'none';
        }, { passive: true });
        
        thumbsWrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touchCurrentX = e.touches[0].clientX;
            const diff = touchStartX - touchCurrentX;
            
            // Actualizar posición durante el arrastre
            position = initialPosition + diff;
            
            // Aplicar resistencia en los límites
            if (position < 0) {
                position = Math.max(-50, -diff * 0.3); // Resistencia al inicio
            } else if (position > maxPosition) {
                position = maxPosition + Math.min(50, (diff - maxPosition + initialPosition) * 0.3); // Resistencia al final
            }
            
            // Actualizar posición visualmente
            thumbsContainer.style.transform = `translateX(${-position}px)`;
        }, { passive: true });
        
        // Función para manejar el final del toque
        const handleTouchEnd = () => {
            if (!isDragging) return;
            
            // Restaurar transición
            thumbsContainer.style.transition = 'transform var(--transition-normal)';
            
            // Ajustar a la posición correcta
            updateSliderPosition();
            
            isDragging = false;
        };
        
        thumbsWrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
        thumbsWrapper.addEventListener('touchcancel', handleTouchEnd, { passive: true });
        
        // Actualizar maxPosition cuando cambia el tamaño de la ventana
        window.addEventListener('resize', () => {
            maxPosition = Math.max(0, (thumbs.length * (thumbWidth + gap)) - thumbsWrapper.offsetWidth);
            updateSliderPosition();
        });
    };
    
    // Inicializar el slider de miniaturas
    initThumbsSlider();
    
    // Inicializar el estado del header según el tamaño de pantalla
    if (window.innerWidth >= 800) {
        // En tablet (≥800px) y desktop (≥1024px): siempre fondo negro fijo
        header.classList.add('header-scrolled');
        header.style.setProperty('--header-opacity', '1');
    }
    
    // Menú lateral móvil toggle con hamburger
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (hamburgerBtn && mobileSidebar) {
        hamburgerBtn.addEventListener('change', function() {
            if (this.checked) {
                mobileSidebar.classList.add('active');
                menuOverlay.classList.add('active');
                document.body.classList.add('menu-open');
            } else {
                mobileSidebar.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Cerrar menú lateral al hacer clic en el overlay
    menuOverlay.addEventListener('click', function() {
        // Para hamburger
        if (hamburgerBtn && hamburgerBtn.checked) {
            hamburgerBtn.checked = false;
        }
        
        // Cerrar menú lateral
        if (mobileSidebar) {
            mobileSidebar.classList.remove('active');
        }
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
    
    // Cerrar menú lateral al hacer clic en un enlace del menú móvil
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Para hamburger
            if (hamburgerBtn && hamburgerBtn.checked) {
                hamburgerBtn.checked = false;
            }
            
            // Cerrar menú lateral
            if (mobileSidebar) {
                mobileSidebar.classList.remove('active');
            }
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Cambiar estilo del header al hacer scroll (para móvil, tablet y desktop)
    window.addEventListener('scroll', function() {
        // Solo aplicar animación en dispositivos menores a 800px (móvil)
        if (window.innerWidth < 800) {
            const scrollY = window.scrollY;
            
            if (scrollY <= 0) {
                // Al inicio: completamente transparente
                header.classList.remove('header-scrolled');
                header.style.setProperty('--header-opacity', '0');
            } else if (scrollY >= 50) {
                // Después de 50px: completamente opaco
                header.classList.add('header-scrolled');
                header.style.setProperty('--header-opacity', '0.9');
            } else {
                // Entre 0 y 50px: transición progresiva
                const progress = scrollY / 50; // 0 a 1
                const opacity = progress * 0.9; // 0 a 0.9
                
                header.classList.add('header-scrolled');
                header.style.setProperty('--header-opacity', opacity.toString());
            }
        } else {
            // En tablet (≥800px) y desktop (≥1024px): siempre fondo negro fijo
            header.classList.add('header-scrolled');
            header.style.setProperty('--header-opacity', '1');
        }
    });
    
    // Animaciones al hacer scroll
    const scrollAnimations = document.querySelectorAll('.scroll-animation');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        scrollAnimations.forEach(animation => {
            const elementTop = animation.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                animation.classList.add('active');
            }
        });
    }
    
    // Verificar animaciones al cargar la página
    checkScroll();
    
    // Manejar click en el menú de idiomas móvil
    if (mobileLanguageLink) {
        mobileLanguageLink.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir comportamiento predeterminado del enlace
            
            // Alternar la clase submenu-active para mostrar/ocultar el submenú
            mobileLanguageMenu.classList.toggle('submenu-active');
            
            // Cerrar el submenú cuando se hace click fuera de él
            document.addEventListener('click', function closeSubmenu(event) {
                // Si el click no fue dentro del menú de idiomas
                if (!mobileLanguageMenu.contains(event.target)) {
                    mobileLanguageMenu.classList.remove('submenu-active');
                    document.removeEventListener('click', closeSubmenu);
                }
            });
        });
    }
    
    // Verificar animaciones al hacer scroll
    window.addEventListener('scroll', checkScroll);
    
    // Manejar cambio de tamaño de ventana para la animación del header
    window.addEventListener('resize', function() {
        // Re-ejecutar la lógica de scroll para ajustar el header según el nuevo tamaño
        const scrollEvent = new Event('scroll');
        window.dispatchEvent(scrollEvent);
        
        // Aplicar inmediatamente el estado correcto del header según el nuevo tamaño
        if (window.innerWidth >= 800) {
            // En tablet (≥800px) y desktop (≥1024px): siempre fondo negro fijo
            header.classList.add('header-scrolled');
            header.style.setProperty('--header-opacity', '1');
        } else {
            // En móvil (<800px): aplicar lógica de scroll
            const scrollY = window.scrollY;
            if (scrollY <= 0) {
                header.classList.remove('header-scrolled');
                header.style.setProperty('--header-opacity', '0');
            } else if (scrollY >= 50) {
                header.classList.add('header-scrolled');
                header.style.setProperty('--header-opacity', '0.9');
            } else {
                const progress = scrollY / 50;
                const opacity = progress * 0.9;
                header.classList.add('header-scrolled');
                header.style.setProperty('--header-opacity', opacity.toString());
            }
        }
    });
    
    // Manejar enlaces de WhatsApp
    document.querySelectorAll('[data-social="whatsapp"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Número de WhatsApp (reemplazar con el número real)
            const phoneNumber = '+56978636483';
            
            // Mensaje predeterminado
            const message = encodeURIComponent('Hola, me gustaría consultar sobre los servicios de VanTop.');
            
            // Crear enlace de WhatsApp
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            
            // Abrir WhatsApp en nueva ventana
            window.open(whatsappUrl, '_blank');
        });
    });
    
    // Manejar envío de formularios
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí se implementaría la lógica para enviar el formulario
            // Por ahora, solo mostramos un mensaje de éxito
            alert('¡Gracias por tu reserva! Te contactaremos pronto para confirmar los detalles.');
            bookingForm.reset();
        });
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí se implementaría la lógica para enviar el formulario
            // Por ahora, solo mostramos un mensaje de éxito
            alert('¡Gracias por tu mensaje! Te responderemos lo antes posible.');
            contactForm.reset();
        });
    }
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
