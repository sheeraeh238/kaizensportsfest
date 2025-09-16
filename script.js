document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // NAV TOGGLE
  // -----------------------------
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("header nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }

  // -----------------------------
  // AUTO-HIDE HEADER ON SCROLL
  // -----------------------------
  let lastScrollTop = 0;
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });

  // -----------------------------
  // HERO SLIDESHOW WITH TABS
  // -----------------------------
  const heroBg = document.querySelector(".hero-bg");
  const heroNext = document.querySelector(".hero-bg.next");
  const heroTabsContainer = document.querySelector(".hero-tabs");

  const heroImages = [
    "./images/hero-bg1.jpg",
    "./images/hero-bg2.jpg",
    "./images/hero-bg3.jpg",
    "./images/hero-bg4.jpg",
    "./images/hero-bg5.jpg"
  ];

  let currentHero = 0;
  let heroInterval = null;
  const SLIDE_DELAY = 4000;

  // Create tabs dynamically
  if (heroTabsContainer) {
    heroImages.forEach((_, i) => {
      const tab = document.createElement("div");
      tab.classList.add("hero-tab");
      if (i === 0) tab.classList.add("active");
      tab.addEventListener("click", () => {
        showHeroSlide(i);
        startHeroAutoPlay();
      });
      heroTabsContainer.appendChild(tab);
    });
  }

  function updateTabs() {
    const tabs = document.querySelectorAll(".hero-tab");
    tabs.forEach((t, i) => {
      t.classList.toggle("active", i === currentHero);
    });
  }

  function showHeroSlide(index) {
    if (!heroBg || !heroNext) return;
    currentHero = index % heroImages.length;

    heroNext.style.backgroundImage = `url('${heroImages[currentHero]}')`;
    heroNext.style.opacity = "1";

    setTimeout(() => {
      heroBg.style.backgroundImage = heroNext.style.backgroundImage;
      heroNext.style.opacity = "0";
      updateTabs();
    }, 1000);
  }

  function startHeroAutoPlay() {
    stopHeroAutoPlay();
    heroInterval = setInterval(() => {
      currentHero = (currentHero + 1) % heroImages.length;
      showHeroSlide(currentHero);
    }, SLIDE_DELAY);
  }

  function stopHeroAutoPlay() {
    if (heroInterval) {
      clearInterval(heroInterval);
      heroInterval = null;
    }
  }

  if (heroBg) {
    heroBg.style.backgroundImage = `url('${heroImages[0]}')`;
    showHeroSlide(currentHero);
    startHeroAutoPlay();
  }

  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener("mouseenter", stopHeroAutoPlay);
    hero.addEventListener("mouseleave", startHeroAutoPlay);
    hero.addEventListener("touchstart", stopHeroAutoPlay);
    hero.addEventListener("touchend", startHeroAutoPlay);
  }

  // -----------------------------
  // CATEGORIES CAROUSEL
  // -----------------------------
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    let isUserInteracting = false;
    let scrollSpeed = 1;

    const checkLoop = () => {
      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
        carousel.scrollLeft = 0;
      } else if (carousel.scrollLeft <= 0) {
        carousel.scrollLeft = carousel.scrollWidth - carousel.clientWidth;
      }
    };

    function autoScroll() {
      if (!isUserInteracting) {
        carousel.scrollLeft += scrollSpeed;
        checkLoop();
      }
      requestAnimationFrame(autoScroll);
    }
    autoScroll();

    carousel.addEventListener("mouseenter", () => { isUserInteracting = true; });
    carousel.addEventListener("mouseleave", () => { isUserInteracting = false; });
    carousel.addEventListener("touchstart", () => { isUserInteracting = true; });
    carousel.addEventListener("touchend", () => { isUserInteracting = false; });

    const leftBtn = document.querySelector(".carousel-btn.left");
    const rightBtn = document.querySelector(".carousel-btn.right");
    if (leftBtn && rightBtn) {
      leftBtn.addEventListener("click", () => {
        isUserInteracting = true;
        carousel.scrollLeft -= 250; checkLoop();
        setTimeout(() => { isUserInteracting = false; }, 1500);
      });
      rightBtn.addEventListener("click", () => {
        isUserInteracting = true;
        carousel.scrollLeft += 250; checkLoop();
        setTimeout(() => { isUserInteracting = false; }, 1500);
      });
    }

    let isDown = false, startX, scrollLeft;
    carousel.addEventListener("mousedown", (e) => {
      isDown = true; startX = e.pageX; scrollLeft = carousel.scrollLeft;
      isUserInteracting = true; carousel.style.cursor = "grabbing";
    });
    carousel.addEventListener("mouseleave", () => {
      isDown = false; isUserInteracting = false; carousel.style.cursor = "grab";
    });
    carousel.addEventListener("mouseup", () => {
      isDown = false; isUserInteracting = false; carousel.style.cursor = "grab";
    });
    carousel.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const walk = (e.pageX - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk; checkLoop();
    });
  }

  // -----------------------------
  // TYPEFORM MODAL
  // -----------------------------
  const typeformBtn = document.getElementById("showTypeform");
  const modal = document.getElementById("typeformModal");
  const closeBtn = document.getElementById("closeTypeform");

  if (typeformBtn && modal && closeBtn) {
    modal.setAttribute("aria-hidden", "true");

    typeformBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
      setTimeout(() => modal.classList.add("show"), 10);
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });

    const closeModal = () => {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      setTimeout(() => { modal.style.display = "none"; }, 300);
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
    });
  }
});
