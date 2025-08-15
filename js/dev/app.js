(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const isMobile = { Android: function() {
  return navigator.userAgent.match(/Android/i);
}, BlackBerry: function() {
  return navigator.userAgent.match(/BlackBerry/i);
}, iOS: function() {
  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}, Opera: function() {
  return navigator.userAgent.match(/Opera Mini/i);
}, Windows: function() {
  return navigator.userAgent.match(/IEMobile/i);
}, any: function() {
  return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
} };
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    setTimeout(() => {
      lockPaddingElements.forEach((lockPaddingElement) => {
        lockPaddingElement.style.paddingRight = "";
      });
      document.body.style.paddingRight = "";
      document.documentElement.removeAttribute("data-fls-scrolllock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.setAttribute("data-fls-scrolllock", "");
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
function menuInit() {
  document.addEventListener("click", function(e) {
    const targetElement = e.target;
    if (bodyLockStatus && targetElement.closest("[data-fls-menu]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
function universalToggle(parentClass, buttonClass, activeClass) {
  const items = document.querySelectorAll(`.${buttonClass}`);
  const removeActiveClasses = (elements) => {
    elements.forEach((element) => {
      element.closest(`.${parentClass}`).classList.remove(activeClass);
    });
  };
  if (items.length) {
    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const parentElement = item.closest(`.${parentClass}`);
        parentElement.classList.toggle(activeClass);
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.closest(`.${parentClass}`).classList.remove(activeClass);
          }
        });
      });
      document.addEventListener("click", (e) => {
        const targetElement = e.target;
        if (!targetElement.closest(`.${buttonClass}`) && document.querySelectorAll(`.${parentClass}.${activeClass}`).length > 0) {
          removeActiveClasses(document.querySelectorAll(`.${parentClass}.${activeClass}`));
        }
      });
      document.addEventListener("mouseover", (e) => {
        const targetElement = e.target;
        if (typeof isMobile !== "undefined" && !isMobile.any()) {
          if (targetElement.closest(`.${buttonClass}`)) {
            removeActiveClasses(document.querySelectorAll(`.${parentClass}.${activeClass}`));
            targetElement.closest(`.${parentClass}`).classList.add(activeClass);
          }
          if (!targetElement.closest(`.${parentClass}`) && !targetElement.closest(`.${buttonClass}`) && !targetElement.closest(".submenu")) {
            removeActiveClasses(document.querySelectorAll(`.${parentClass}.${activeClass}`));
          }
        }
      });
    });
  }
}
universalToggle("menu__item", "menu__toggle", "submenu-open");
universalToggle("lang-block", "lang-block__current", "lang-active");
