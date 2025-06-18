document.addEventListener("DOMContentLoaded", () => {
  const parallaxContainer = document.getElementById("background");
  const parallaxSpeed = 0.1;

  window.addEventListener("scroll", () => {
    const offset = window.scrollY;
    const newY = offset * parallaxSpeed;
    parallaxContainer.style.backgroundPosition = `-${Math.floor(newY / 2)}px -${newY}px`;
  });
});
