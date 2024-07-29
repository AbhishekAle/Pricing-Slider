document.addEventListener("DOMContentLoaded", () => {
  const cardWrapper = document.querySelector(".card-wrapper");
  const cards = Array.from(document.querySelectorAll(".pricing-card"));
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  let currentIndex = 0;
  const cardsToShow = 3;
  const totalCards = cards.length;
  let autoSlideInterval;

  // Function to handle card click
  function handleCardClick(card) {
    document
      .querySelectorAll(".pricing-card .header-1, .pricing-card .choose-plan")
      .forEach((el) => {
        el.classList.remove("active");
      });

    card.querySelector(".header-1").classList.add("active");
    card.querySelector(".choose-plan").classList.add("active");

    // Stop auto-slide on card click
    clearInterval(autoSlideInterval);
  }

  // Add click event listeners to all cards
  function addCardClickListeners() {
    document.querySelectorAll(".pricing-card").forEach((card) => {
      card.addEventListener("click", () => handleCardClick(card));
    });
  }

  // Clone cards for the infinite scroll effect
  function cloneCards() {
    for (let i = 0; i < cardsToShow; i++) {
      const clone = cards[i].cloneNode(true);
      cardWrapper.appendChild(clone);
    }
  }

  function updateCardPosition() {
    const cardWidth = cards[0].offsetWidth;
    const margin = parseInt(window.getComputedStyle(cards[0]).marginLeft) * 2;
    const offset = currentIndex * (cardWidth + margin);
    cardWrapper.style.transform = `translateX(-${offset}px)`;
  }

  function nextCard() {
    if (currentIndex >= totalCards) {
      cardWrapper.style.transition = "none";
      currentIndex = 0;
      updateCardPosition();
      setTimeout(() => {
        cardWrapper.style.transition = "transform 1.5s ease";
        currentIndex++;
        updateCardPosition();
      }, 50);
    } else {
      currentIndex++;
      updateCardPosition();
    }
  }

  function prevCard() {
    if (currentIndex <= 0) {
      cardWrapper.style.transition = "none";
      currentIndex = totalCards;
      updateCardPosition();
      setTimeout(() => {
        cardWrapper.style.transition = "transform 1.5s ease";
        currentIndex--;
        updateCardPosition();
      }, 50);
    } else {
      currentIndex--;
      updateCardPosition();
    }
  }

  leftArrow.addEventListener("click", prevCard);
  rightArrow.addEventListener("click", nextCard);

  // Touch events for swiping on mobile
  let touchStartX = 0;
  let touchEndX = 0;

  cardWrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });

  cardWrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
      nextCard();
    }
    if (touchEndX - touchStartX > 50) {
      prevCard();
    }
  }

  // Initialize the slider
  function initializeSlider() {
    cloneCards();
    updateCardPosition();
    addCardClickListeners(); // Ensure click listeners are added to all cards, including clones

    // Start auto-slide
    autoSlideInterval = setInterval(nextCard, 3000); // Slide every 3 seconds
  }

  // Stop auto-slide on manual interaction
  [leftArrow, rightArrow].forEach((arrow) => {
    arrow.addEventListener("click", () => {
      clearInterval(autoSlideInterval);
    });
  });

  // Stop auto-slide on touch interaction
  cardWrapper.addEventListener("touchstart", () => {
    clearInterval(autoSlideInterval);
  });

  // Responsive behavior
  window.addEventListener("resize", updateCardPosition);

  // Initialize slider functionality
  initializeSlider();
});
