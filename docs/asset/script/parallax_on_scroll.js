// file: parallax_on_scroll.js

// const mode = "svg_filter"
const mode = "background_image";

switch (mode) {
  case "svg_filter": {
    document.addEventListener("DOMContentLoaded", () => {
      const parallaxSpeed = 0.1;

      const turbulenceOffset = document.getElementById(
        "nightsky-turbulenceOffset",
      );

      window.addEventListener("scroll", () => {
        const offset = window.scrollY;
        const dx = offset * parallaxSpeed;
        const dy = 2 * dx;

        turbulenceOffset.setAttribute("dx", `${-dx}`);
        turbulenceOffset.setAttribute("dy", `${-dy}`);
      });
    });
    break;
  }

  case "background_image": {
    document.addEventListener("DOMContentLoaded", () => {
      const parallaxSpeed = 0.05;

      const parallaxContainer = document.getElementById("background");

      window.addEventListener("scroll", () => {
        const offset = window.scrollY;
        const dx = offset * parallaxSpeed;
        const dy = 2 * dx;

        parallaxContainer.style.backgroundPosition = `-${dx}px -${dy}px`;
      });
    });
    break;
  }
}
