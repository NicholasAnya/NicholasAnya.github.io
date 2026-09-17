(function initPortfolioSite() {
  var updatedNode = document.getElementById("last-updated");
  if (updatedNode) {
    updatedNode.textContent = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  var yearNode = document.getElementById("footer-year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  // Typewriter effect for the intro paragraph
  var typeTarget = document.querySelector("[data-typewriter]");
  if (typeTarget) {
    var fullText = typeTarget.textContent.replace(/\s+/g, " ").trim();
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var alreadyTyped = false;
    try {
      alreadyTyped = window.sessionStorage.getItem("intro-typed") === "1";
    } catch (storageError) {
      alreadyTyped = false;
    }

    // Ghost copy keeps the layout height fixed while the visible text types in
    typeTarget.setAttribute("aria-label", fullText);
    typeTarget.textContent = "";

    var ghost = document.createElement("span");
    ghost.className = "type-ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.textContent = fullText;

    var live = document.createElement("span");
    live.className = "type-live";
    live.setAttribute("aria-hidden", "true");
    var liveText = document.createTextNode("");
    var cursor = document.createElement("span");
    cursor.className = "type-cursor";
    live.appendChild(liveText);
    live.appendChild(cursor);

    typeTarget.appendChild(ghost);
    typeTarget.appendChild(live);

    if (reducedMotion || alreadyTyped) {
      liveText.nodeValue = fullText;
    } else {
      var typedCount = 0;
      var typeNext = function () {
        typedCount += 1;
        liveText.nodeValue = fullText.slice(0, typedCount);
        if (typedCount >= fullText.length) {
          try {
            window.sessionStorage.setItem("intro-typed", "1");
          } catch (storageError) {
            /* private browsing: animation simply repeats */
          }
          return;
        }
        var lastChar = fullText.charAt(typedCount - 1);
        var delay = 7 + Math.random() * 12;
        if (lastChar === "." || lastChar === "!" || lastChar === "?") {
          delay = 200;
        } else if (lastChar === ",") {
          delay = 90;
        }
        window.setTimeout(typeNext, delay);
      };
      window.setTimeout(typeNext, 450);
    }
  }

  // Header: elevate once scrolled, and track reading progress
  var header = document.querySelector(".site-header");
  var progressBar = document.querySelector(".scroll-progress");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      if (progressBar) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        progressBar.style.transform =
          "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  // Nav: highlight the section currently in view
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var setActive = function (id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  // Scroll reveal for sections and cards
  var revealObserver = null;
  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
  }

  function reveal(elements) {
    Array.prototype.forEach.call(elements, function (el) {
      if (el.hasAttribute("data-reveal")) {
        return;
      }
      el.setAttribute("data-reveal", "");
      if (revealObserver) {
        revealObserver.observe(el);
      } else {
        el.classList.add("is-visible");
      }
    });
  }

  reveal(
    document.querySelectorAll(".section .kicker, .section h2, .section-note, .papers-grid .entry")
  );

  var projectsList = document.getElementById("projects-list");
  if (!projectsList) {
    return;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderProjects(projects) {
    if (!projects.length) {
      projectsList.innerHTML =
        '<p class="empty-state">Projects will be added here soon.</p>';
      return;
    }

    projectsList.innerHTML = projects
      .map(function (project, projectIndex) {
        var tags = Array.isArray(project.tags)
          ? project.tags
              .map(function (tag) {
                return '<span class="tag">' + escapeHtml(tag) + "</span>";
              })
              .join("")
          : "";

        var githubIcon =
          '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" /></svg>';
        var documentIcon =
          '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h5" /></svg>';
        var documents = Array.isArray(project.documents) ? project.documents : [];

        var links = [
          project.repoUrl
            ? '<a href="' +
              escapeHtml(project.repoUrl) +
              '" target="_blank" rel="noopener noreferrer">' +
              githubIcon +
              "View the code on GitHub</a>"
            : "",
          project.demoUrl
            ? '<a href="' +
              escapeHtml(project.demoUrl) +
              '" target="_blank" rel="noopener noreferrer">Live demo</a>'
            : "",
        ].concat(
          documents.map(function (document) {
            return (
              '<a href="' +
              escapeHtml(document.url) +
              '" target="_blank" rel="noopener noreferrer">' +
              documentIcon +
              escapeHtml(document.label || "View result") +
              "</a>"
            );
          })
        )
          .filter(Boolean)
          .join("");

        var figures = Array.isArray(project.figures) ? project.figures : [];
        var figuresHtml = figures.length
          ? '<div class="project-figures" data-carousel data-project-index="' +
            projectIndex +
            '">' +
            '<div class="figure-track">' +
            figures
              .map(function (figure, figureIndex) {
                return (
                  '<figure data-figure-index="' +
                  figureIndex +
                  '"' +
                  (figureIndex === 0 ? "" : " hidden") +
                  ">" +
                  '<img src="' +
                  escapeHtml(figure.src) +
                  '" alt="' +
                  escapeHtml(figure.alt) +
                  '" loading="lazy" />' +
                  "<figcaption>" +
                  '<span class="fig-label">Fig. ' +
                  ("0" + (figureIndex + 1)).slice(-2) +
                  "</span>" +
                  (figure.caption ? escapeHtml(figure.caption) : "") +
                  "</figcaption>" +
                  "</figure>"
                );
              })
              .join("") +
            "</div>" +
            (figures.length > 1
              ? '<div class="figure-controls">' +
                '<button type="button" class="figure-control" data-carousel-prev aria-label="Show previous figure">&lsaquo;</button>' +
                '<span class="figure-count" aria-live="polite">1 / ' +
                figures.length +
                "</span>" +
                '<button type="button" class="figure-control" data-carousel-next aria-label="Show next figure">&rsaquo;</button>' +
                "</div>" +
                '<div class="figure-thumbs" aria-label="Figure navigation">' +
                figures
                  .map(function (figure, figureIndex) {
                    return (
                      '<button type="button" class="figure-thumb' +
                      (figureIndex === 0 ? " is-active" : "") +
                      '" data-carousel-dot="' +
                      figureIndex +
                      '" aria-label="Show figure ' +
                      (figureIndex + 1) +
                      '"><img src="' +
                      escapeHtml(figure.src) +
                      '" alt="" loading="lazy" /></button>'
                    );
                  })
                  .join("") +
                "</div>"
              : "") +
            "</div>"
          : "";

        var bodyHtml = (function () {
          var desc = project.description;
          if (!desc) {
            return "";
          }
          var paragraphs = Array.isArray(desc) ? desc : [desc];
          return paragraphs
            .map(function (para) {
              return "<p>" + escapeHtml(para) + "</p>";
            })
            .join("");
        })();

        var metaHtml =
          (tags ? '<div class="entry-tags">' + tags + "</div>" : "") +
          (links ? '<div class="entry-links">' + links + "</div>" : "");

        return (
          '<article class="entry project-card' +
          (figuresHtml ? " has-figures" : "") +
          '">' +
          '<div class="project-main">' +
          '<div class="entry-title">' + escapeHtml(project.title) + "</div>" +
          '<div class="entry-body">' + bodyHtml + "</div>" +
          "</div>" +
          figuresHtml +
          (metaHtml ? '<div class="project-meta">' + metaHtml + "</div>" : "") +
          "</article>"
        );
      })
      .join("");
  }

  function initProjectFigureCarousels() {
    var carousels = projectsList.querySelectorAll("[data-carousel]");

    carousels.forEach(function (carousel) {
      var figures = Array.prototype.slice.call(
        carousel.querySelectorAll("[data-figure-index]")
      );
      var count = carousel.querySelector(".figure-count");
      var previous = carousel.querySelector("[data-carousel-prev]");
      var next = carousel.querySelector("[data-carousel-next]");
      var dots = Array.prototype.slice.call(
        carousel.querySelectorAll("[data-carousel-dot]")
      );
      var activeIndex = 0;

      function showFigure(nextIndex) {
        activeIndex = (nextIndex + figures.length) % figures.length;

        figures.forEach(function (figure, index) {
          figure.hidden = index !== activeIndex;
        });

        if (count) {
          count.textContent = activeIndex + 1 + " / " + figures.length;
        }

        dots.forEach(function (dot, index) {
          dot.classList.toggle("is-active", index === activeIndex);
        });
      }

      if (previous) {
        previous.addEventListener("click", function () {
          showFigure(activeIndex - 1);
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          showFigure(activeIndex + 1);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showFigure(Number(dot.getAttribute("data-carousel-dot")));
        });
      });

      if (figures.length > 1) {
        // Arrow-key navigation when the carousel is focused
        carousel.setAttribute("tabindex", "0");
        carousel.setAttribute("role", "group");
        carousel.setAttribute("aria-label", "Project figures, use arrow keys to navigate");
        carousel.addEventListener("keydown", function (event) {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            showFigure(activeIndex - 1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            showFigure(activeIndex + 1);
          }
        });

        // Swipe navigation on touch devices
        var touchStartX = null;
        carousel.addEventListener(
          "touchstart",
          function (event) {
            touchStartX = event.changedTouches[0].clientX;
          },
          { passive: true }
        );
        carousel.addEventListener(
          "touchend",
          function (event) {
            if (touchStartX === null) {
              return;
            }
            var deltaX = event.changedTouches[0].clientX - touchStartX;
            touchStartX = null;
            if (Math.abs(deltaX) > 45) {
              showFigure(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
            }
          },
          { passive: true }
        );
      }
    });
  }

  // Lightbox: click a figure to view it full-screen
  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Enlarged figure");
  lightbox.innerHTML =
    '<figure><img alt="" /><figcaption></figcaption></figure>' +
    '<button type="button" class="lightbox-close" aria-label="Close enlarged figure">&times;</button>';
  document.body.appendChild(lightbox);

  var lightboxImg = lightbox.querySelector("img");
  var lightboxCaption = lightbox.querySelector("figcaption");
  var lightboxTimer = null;

  function openLightbox(img) {
    var figure = img.closest("figure");
    var caption = figure ? figure.querySelector("figcaption") : null;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
    lightboxCaption.innerHTML = caption ? caption.innerHTML : "";
    window.clearTimeout(lightboxTimer);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    void lightbox.offsetWidth;
    lightbox.classList.add("is-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    lightboxTimer = window.setTimeout(function () {
      lightbox.hidden = true;
      lightboxImg.removeAttribute("src");
    }, 240);
  }

  lightbox.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });

  projectsList.addEventListener("click", function (event) {
    var img = event.target.closest(".figure-track img");
    if (img) {
      openLightbox(img);
    }
  });

  fetch("assets/data/projects.json")
    .then(function (res) {
      if (!res.ok) {
        throw new Error("Unable to load project data.");
      }
      return res.json();
    })
    .then(function (data) {
      renderProjects(Array.isArray(data.projects) ? data.projects : []);
      initProjectFigureCarousels();
      reveal(projectsList.querySelectorAll(".project-card"));

      // Projects and their images render after the browser's initial anchor
      // jump, pushing later sections down. Keep re-aligning to the requested
      // hash (instantly, not smoothly) until layout settles or the visitor
      // starts scrolling on their own.
      var hashId = window.location.hash ? window.location.hash.slice(1) : "";
      if (hashId && document.getElementById(hashId)) {
        var userTookOver = false;
        ["wheel", "touchstart", "keydown"].forEach(function (eventName) {
          window.addEventListener(
            eventName,
            function () {
              userTookOver = true;
            },
            { passive: true, once: true }
          );
        });

        var alignToHash = function () {
          if (userTookOver) {
            return;
          }
          var target = document.getElementById(hashId);
          if (!target) {
            return;
          }
          var root = document.documentElement;
          var previousBehavior = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto";
          target.scrollIntoView();
          root.style.scrollBehavior = previousBehavior;
        };

        alignToHash();
        Array.prototype.forEach.call(
          projectsList.querySelectorAll("img"),
          function (img) {
            if (!img.complete) {
              img.addEventListener("load", alignToHash, { once: true });
            }
          }
        );
        window.addEventListener("load", alignToHash, { once: true });
      }
    })
    .catch(function () {
      projectsList.innerHTML =
        '<p class="empty-state">Project data could not be loaded.</p>';
    });
})();
