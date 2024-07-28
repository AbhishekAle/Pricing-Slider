document.addEventListener("DOMContentLoaded", () => {
  const cardWrapper = document.querySelector(".card-wrapper");
  const cards = document.querySelectorAll(".pricing-card");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  let currentIndex = 0;
  const cardsToShow = 3;
  const totalCards = cards.length;

  function updateCardPosition() {
    const cardWidth = cards[0].offsetWidth;
    const margin = parseInt(window.getComputedStyle(cards[0]).marginLeft) * 2;
    const offset = currentIndex * (cardWidth + margin);
    cardWrapper.style.transform = `translateX(-${offset}px)`;
  }

  function cloneCards() {
    for (let i = 0; i < cardsToShow; i++) {
      cardWrapper.appendChild(cards[i].cloneNode(true));
    }
  }

  function nextCard() {
    if (currentIndex >= totalCards) {
      cardWrapper.style.transition = "none";
      currentIndex = 0;
      updateCardPosition();
      setTimeout(() => {
        cardWrapper.style.transition = "transform 0.5s ease";
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
        cardWrapper.style.transition = "transform 0.5s ease";
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

  // Initial setup
  cloneCards();
  updateCardPosition();

  // Responsive behavior
  window.addEventListener("resize", updateCardPosition);

  // Setup choose plan button functionality
  const choosePlanButtons = document.querySelectorAll(".choose-plan");
  choosePlanButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Thank you for choosing this plan!");
    });
  });
});
