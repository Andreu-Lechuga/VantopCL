// Control de opacidad del hero section
class HeroOpacityController {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.currentOpacity = 0.1; // Opacidad fija a 0.1
        this.init();
    }

    init() {
        // Establecer la opacidad inicial
        this.setOpacity(this.currentOpacity);
    }

    setOpacity(opacity) {
        // Validar que la opacidad esté entre 0 y 1
        opacity = Math.max(0, Math.min(1, opacity));
        this.currentOpacity = opacity;
        
        // Actualizar la variable CSS
        document.documentElement.style.setProperty('--hero-overlay-opacity', opacity);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.heroOpacityController = new HeroOpacityController();
});

// Métodos globales para usar desde la consola del navegador
window.setHeroOpacity = (opacity) => {
    if (window.heroOpacityController) {
        window.heroOpacityController.setOpacity(opacity);
    }
};

window.getHeroOpacity = () => {
    if (window.heroOpacityController) {
        return window.heroOpacityController.currentOpacity;
    }
    return null;
}; 