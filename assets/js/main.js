(function initPortfolioSite() {
  var updatedNode = document.getElementById("last-updated");
  if (updatedNode) {
    updatedNode.textContent = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

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
                  (figure.caption
                    ? "<figcaption>" + escapeHtml(figure.caption) + "</figcaption>"
                    : "") +
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
                '<div class="figure-dots" aria-label="Figure navigation">' +
                figures
                  .map(function (_, figureIndex) {
                    return (
                      '<button type="button" class="figure-dot' +
                      (figureIndex === 0 ? " is-active" : "") +
                      '" data-carousel-dot="' +
                      figureIndex +
                      '" aria-label="Show figure ' +
                      (figureIndex + 1) +
                      '"></button>'
                    );
                  })
                  .join("") +
                "</div>"
              : "") +
            "</div>"
          : "";

        return (
          '<article class="entry project-card">' +
          '<div class="entry-title">' + escapeHtml(project.title) + "</div>" +
          '<div class="entry-body">' +
          (function () {
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
          })() +
          "</div>" +
          figuresHtml +
          (tags ? '<div class="entry-tags">' + tags + "</div>" : "") +
          (links ? '<div class="entry-links">' + links + "</div>" : "") +
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
    });
  }

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
    })
    .catch(function () {
      projectsList.innerHTML =
        '<p class="empty-state">Project data could not be loaded.</p>';
    });
})();
