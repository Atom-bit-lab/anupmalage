document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     PAGE TRANSITION
  ======================================== */

  document.body.classList.remove("page-transition");

  window.navigateToPage = (href) => {
    document.body.classList.add("page-transition");

    setTimeout(() => {
      window.location.href = href;
    }, 350);
  };


  // Handle normal <a> page navigation
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

      navigateToPage(href);

    });

  });


  // Handle the Back button
  const backButton = document.querySelector(".back-btn");

  if (backButton) {

    backButton.onclick = function () {

      navigateToPage("Home.html");

    };

  }


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
   2. VIDEO DEMO
======================================== */

// Loop videos (0–10 seconds)
document.querySelectorAll(".demoVideo_loop").forEach(video => {

  video.addEventListener("timeupdate", () => {

    if (video.currentTime >= 10) {
      video.currentTime = 0;
      video.play();
    }

  });

});


// Full-length play-button videos
document.querySelectorAll(".Video_demo_play").forEach(container => {

  const video = container.querySelector(".demoVideo_play");
  const playButton = container.querySelector(".video-play");

  playButton.addEventListener("click", () => {

    video.play();

    container.classList.add("playing");

    playButton.style.opacity = "0";
    playButton.style.pointerEvents = "none";

  });

  // Video plays until its natural end
  video.addEventListener("ended", () => {

    container.classList.remove("playing");

    playButton.style.opacity = "1";
    playButton.style.pointerEvents = "auto";

  });

});

  /* ========================================
     3. SCROLLSPY INTERSECTION OBSERVER
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

});