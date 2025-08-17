const textBlockMore = document.querySelectorAll(".text-block");
if (textBlockMore.length > 0) {
  textBlockMore.forEach((block) => {
    const blockContent = block.querySelector(".text-block__content");
    const btnMore = block.querySelector(".text-block__more");
    btnMore.addEventListener("click", () => {
      blockContent.classList.toggle("content-show");
      btnMore.classList.toggle("active");
    });
  });
}
