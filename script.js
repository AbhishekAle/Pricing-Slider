document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".pricing-card");
  let currentIndex = 0;
  const totalCards = cards.length;
  let touchStartX = 0;
  let autoSlideInterval;

  const showCard = (index) => {
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
  };

  const nextCard = () => {
    currentIndex = (currentIndex + 1) % totalCards;
    showCard(currentIndex);
  };

  const prevCard = () => {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    showCard(currentIndex);
  };

  const setupMobileView = () => {
    showCard(currentIndex);
    const swipeThreshold = 50; // Minimum distance in pixels to detect a swipe

    // Touch start event to capture the starting position
    document.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    });

    // Touch end event to detect swipe direction
    document.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchDeltaX = touchEndX - touchStartX;

      if (Math.abs(touchDeltaX) > swipeThreshold) {
        if (touchDeltaX > 0) {
          prevCard();
        } else {
          nextCard();
        }
      }
    });

    // Automatically change card every 4 seconds
    autoSlideInterval = setInterval(nextCard, 5000);
  };

  const setupDesktopView = () => {
    // Show all cards in desktop view
    cards.forEach((card) => card.classList.add("active"));
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  };

  const handleResize = () => {
    if (window.innerWidth <= 1024) {
      setupMobileView();
    } else {
      setupDesktopView();
    }
  };

  // Initial setup
  handleResize();

  // Listen for window resize events
  window.addEventListener("resize", handleResize);

  // Setup choose plan button functionality
  const choosePlanButtons = document.querySelectorAll(".choose-plan");
  choosePlanButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Thank you for choosing this plan!");
      // Add more functionality here as needed
    });
  });
});
