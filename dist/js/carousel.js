$(document).ready(function () {
  // Contenedor principal del carrusel
  const carousel = $('#hero-carousel');

  // --- Verificación Inicial ---
  // Si el carrusel no existe en la página, no ejecutar nada.
  if (carousel.length === 0) {
    return;
  }

  // --- Selección de Elementos ---
  // Se buscan elementos solo dentro del contenedor carousel
  const items = carousel.find('[data-carousel-item]');
  const dotsContainer = carousel.find('#pagination-dots');

  // --- Variables de Estado ---
  const totalItems = items.length;
  let currentIndex = 0;
  let autoPlayInterval = null;
  const autoPlayDelay = 5000; // 5 segundos

  // --- Definición de Funciones ---

  /**
   * Mueve el carrusel a un slide específico usando un fundido (fade).
   * @param {number} index - El índice del slide (0 a totalItems - 1).
   */
  function goToSlide(index) {
    // Asegurarse de que el índice esté dentro de los límites
    if (index < 0 || index >= totalItems) {
      console.warn('Índice de slide fuera de rango:', index);
      return;
    }

    // Ocultar todos los items con un fundido
    items.fadeOut(300);

    // Mostrar el item seleccionado con un fundido
    // Se usa un pequeño delay para asegurar que el fadeOut comience primero
    items.eq(index).delay(300).fadeIn(300);

    // Actualizar los dots de paginación
    if (dotsContainer.length) {
      dotsContainer
        .children()
        .removeClass('bg-cookie-400') // Clase activa
        .addClass('bg-white/50'); // Clase inactiva

      dotsContainer.children().eq(index).removeClass('bg-white/50').addClass('bg-cookie-400');
    }

    // Actualizar el índice actual
    currentIndex = index;
  }

  /**
   * Mueve al siguiente slide (circular).
   */
  function nextSlide() {
    const newIndex = (currentIndex + 1) % totalItems;
    goToSlide(newIndex);
  }

  /**
   * Mueve al slide anterior (circular).
   */
  function prevSlide() {
    // El (+ totalItems) asegura que el módulo siempre sea positivo
    const newIndex = (currentIndex - 1 + totalItems) % totalItems;
    goToSlide(newIndex);
  }

  /**
   * Detiene el intervalo de autoplay.
   */
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  /**
   * Inicia (o reinicia) el intervalo de autoplay.
   */
  function startAutoPlay() {
    stopAutoPlay(); // Limpiar cualquier intervalo anterior
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  }

  /**
   * Configura el estado inicial del carrusel, genera los dots
   * y adjunta los listeners de eventos.
   */
  function initializeCarousel() {
    // 1. Generar dots de paginación
    if (dotsContainer.length && totalItems > 0) {
      for (let i = 0; i < totalItems; i++) {
        // Añadir data-attribute para la delegación de eventos
        // y un aria-label por accesibilidad
        dotsContainer.append(
          `<button 
             type="button" 
             class="dot w-3 h-3 rounded-full bg-white/50 transition-colors duration-300" 
             data-slide-to="${i}" 
             aria-label="Ir al slide ${i + 1}">
           </button>`
        );
      }
    }

    // 2. Adjuntar Listeners de Eventos (Delegación)
    // Se adjuntan todos los listeners al contenedor principal carousel

    // Botón Siguiente
    carousel.on('click', '[data-carousel-next]', function () {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });

    // Botón Anterior
    carousel.on('click', '[data-carousel-prev]', function () {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    });

    // Dots de paginación
    carousel.on('click', '[data-slide-to]', function () {
      // 'this' es el <button> que fue clickeado
      const newIndex = parseInt($(this).data('slide-to'), 10);

      // Validar que el índice sea un número y sea diferente al actual
      if (!isNaN(newIndex) && newIndex !== currentIndex) {
        stopAutoPlay();
        goToSlide(newIndex);
        startAutoPlay();
      }
    });

    // 3. Establecer Estado Inicial
    items.hide(); // Ocultar todos los slides al inicio
    goToSlide(0); // Mostrar el primer slide (esto también activa el dot)
    startAutoPlay(); // Iniciar el autoplay
  }

  // --- Ejecución ---
  // Iniciar todo el módulo del carrusel
  initializeCarousel();
});
