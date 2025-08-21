document.addEventListener("DOMContentLoaded", () => {
  const totalElement = document.querySelector(".fixed-block-hide");
  const fixedElement = document.querySelector(".fixed-block");
  if (!totalElement || !fixedElement) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fixedElement.classList.add("hide");
        } else {
          fixedElement.classList.remove("hide");
        }
      });
    },
    { threshold: 0.1 }
    // Элемент считается видимым, если хотя бы 10% его высоты видны
  );
  observer.observe(totalElement);
});
