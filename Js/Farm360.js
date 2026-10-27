document.addEventListener("DOMContentLoaded", () => {

  document.body.classList.remove("page-transition");

  window.navigateToPage = (href) => {
    document.body.classList.add("page-transition");

    setTimeout(() => {
      window.location.href = href;
    }, 350);
  };

    document.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", (e) => {

            const href = link.getAttribute("href");

            if (
                !href ||
                href.startsWith("#") ||
                link.target === "_blank" ||
                link.hostname !== window.location.hostname
            ) {
                return;
            }

            e.preventDefault();

            document.body.classList.add("page-transition");

            setTimeout(() => {
                window.location.href = href;
            }, 350);

        });

    });

  /* ========================================
     1. NAVIGATION LINK CLICK HANDLER
  ======================================== */

  const navLinks = document.querySelectorAll(".section-btn");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {

      navLinks.forEach((btn) => {
        btn.classList.remove("active");
      });

      this.classList.add("active");

    });
  });


  /* ========================================
     2. SCROLLSPY INTERSECTION OBSERVER
  ======================================== */

  const sections = document.querySelectorAll(".section[id]");

  if (sections.length > 0) {

    const observerOptions = {
      root: null,

      // Detect the section around the upper-middle portion
      rootMargin: "-30% 0px -50% 0px",

      threshold: 0
    };


    const observer = new IntersectionObserver((entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          const currentId = entry.target.getAttribute("id");

          navLinks.forEach((link) => {

            const linkTarget = link.getAttribute("href");

            if (linkTarget === `#${currentId}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }

          });

        }

      });

    }, observerOptions);


    // Observe every section
    sections.forEach((section) => {
      observer.observe(section);
    });

  }


  /* ========================================
     3. IMAGE CAROUSEL
  ======================================== */

  const images = [
    {
      src: "Assets/Table.png",
      alt: "Farm360 typography design system"
    },
    {
      src: "Assets/Filter Section.png",
      alt: "Farm360 color design system"
    },
    {
      src: "Assets/Filter Section-1.png",
      alt: "Farm360 component library"
    }
  ];

  let currentIndex = 0;

  const carouselImage = document.getElementById("carousel-image");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");


  // Check whether carousel elements exist
  if (carouselImage && prevBtn && nextBtn) {

    function updateCarousel() {

      const currentImage = images[currentIndex];

      carouselImage.src = currentImage.src;
      carouselImage.alt = currentImage.alt;

      // Disable buttons at the beginning and end
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === images.length - 1;

    }


    // Previous image
    prevBtn.addEventListener("click", () => {

      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }

    });


    // Next image
    nextBtn.addEventListener("click", () => {

      if (currentIndex < images.length - 1) {
        currentIndex++;
        updateCarousel();
      }

    });


    // Load the first image
    updateCarousel();

  } else {

    console.warn("Carousel elements were not found in the HTML.");

  }

});