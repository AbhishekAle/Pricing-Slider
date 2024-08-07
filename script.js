document.addEventListener("DOMContentLoaded", () => {
  const cardWrapper = document.querySelector(".card-wrapper");
  const originalCards = Array.from(document.querySelectorAll(".pricing-card"));
  const dotsContainer = document.querySelector(".dots-container");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  const cardsToShow = 3;
  let currentIndex = 0;
  const totalCards = originalCards.length;
  let autoSlideInterval;

  // Function to handle Read More / Read Less button clicks
  function handleReadMoreClick() {
    const currentCard = this.closest(".pricing-card");
    const featuresList = currentCard.querySelector(".features");
    const additionalOptions = featuresList.querySelectorAll(
      ".additional-options"
    );
    const isExpanded = currentCard.classList.contains("expanded");

    // Collapse all cards first
    document.querySelectorAll(".pricing-card").forEach((card) => {
      card.classList.remove("expanded");
      card.querySelectorAll(".additional-options").forEach((option) => {
        option.classList.add("hidden");
      });
      const readMoreBtn = card.querySelector(".read-more");
      if (readMoreBtn) readMoreBtn.textContent = "Read More";
    });

    // Expand current card if it wasn't expanded before
    if (!isExpanded) {
      currentCard.classList.add("expanded");
      additionalOptions.forEach((option) => option.classList.remove("hidden"));
      this.textContent = "Read Less";
    }

    // Update card positions
    updateCardPosition();
  }

  // Attach event listeners to Read More buttons
  function attachReadMoreListeners() {
    const readMoreButtons = document.querySelectorAll(".read-more");
    readMoreButtons.forEach((button) => {
      button.removeEventListener("click", handleReadMoreClick); // Remove existing listener to avoid duplication
      button.addEventListener("click", handleReadMoreClick);
    });
  }

  // Create dots for pagination
  function createDots() {
    dotsContainer.innerHTML = ""; // Clear existing dots
    originalCards.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => showSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  // Update dots based on the current slide
  function updateDots() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex % totalCards);
    });
  }

  // Show a specific slide
  function showSlide(index) {
    currentIndex = index;
    updateCardPosition();
    updateDots();
  }

  // Handle card click
  function handleCardClick(card) {
    document
      .querySelectorAll(".pricing-card .header-1, .pricing-card .choose-plan")
      .forEach((el) => el.classList.remove("active"));

    card.querySelector(".header-1").classList.add("active");
    card.querySelector(".choose-plan").classList.add("active");

    clearInterval(autoSlideInterval);
  }

  // Add click event listeners to all cards
  function addCardClickListeners() {
    document.querySelectorAll(".pricing-card").forEach((card) => {
      card.removeEventListener("click", () => handleCardClick(card)); // Remove existing listener to avoid duplication
      card.addEventListener("click", () => handleCardClick(card));
    });
  }

  // Clone cards for infinite scroll effect
  function cloneCards() {
    for (let i = 0; i < cardsToShow; i++) {
      const clone = originalCards[i].cloneNode(true);
      cardWrapper.appendChild(clone);
    }
  }

  function updateCardPosition() {
    const cardWidth = originalCards[0].offsetWidth;
    const margin =
      parseInt(window.getComputedStyle(originalCards[0]).marginLeft) * 2;
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
        updateDots();
        attachReadMoreListeners();
        addCardClickListeners();
      }, 50);
    } else {
      currentIndex++;
      updateCardPosition();
      updateDots();
      attachReadMoreListeners();
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
        updateDots();
        attachReadMoreListeners();
        addCardClickListeners();
      }, 50);
    } else {
      currentIndex--;
      updateCardPosition();
      updateDots();
      attachReadMoreListeners();
    }
  }

  // Add event listeners to navigation arrows
  leftArrow.addEventListener("click", prevCard);
  rightArrow.addEventListener("click", nextCard);

  // Handle touch events for mobile swipe
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
    addCardClickListeners();
    createDots();
    updateDots();
    attachReadMoreListeners();

    // Start auto-slide
    autoSlideInterval = setInterval(nextCard, 3000); // Slide every 3 seconds
  }

  // Stop auto-slide on manual interaction
  [leftArrow, rightArrow].forEach((arrow) => {
    arrow.addEventListener("click", () => {
      clearInterval(autoSlideInterval);
    });
  });

  cardWrapper.addEventListener("touchstart", () => {
    clearInterval(autoSlideInterval);
  });

  // Responsive behavior
  window.addEventListener("resize", updateCardPosition);

  // Initialize slider functionality
  initializeSlider();
});
