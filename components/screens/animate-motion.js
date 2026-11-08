export function animateMotion(keyframes, options) {
  return (element) => {
    if (!element) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation;
    const update = () => {
      animation?.cancel();
      animation = preference.matches ? undefined : element.animate(keyframes, options);
    };

    update();
    preference.addEventListener("change", update);
    return () => {
      preference.removeEventListener("change", update);
      animation?.cancel();
    };
  };
}
