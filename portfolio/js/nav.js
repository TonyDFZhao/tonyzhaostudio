(function () {
  const toggleIcon = "assets/nav-toggle.svg";
  const menuIcon = "assets/nav-menu.svg";
  const MOBILE_MAX = 402;

  function getCurrentPage() {
    const path = window.location.pathname;
    return path.slice(path.lastIndexOf("/") + 1) || SITE_CONFIG.homePage;
  }

  function buildNameInner(compact) {
    const nameClass = compact ? "sidebar__name sidebar__name--compact" : "sidebar__name";
    return `<div class="${nameClass}">
      <p class="sidebar__name-line">Tony <span class="sidebar__name-muted">Dongfang</span></p>
      <p class="sidebar__name-line">Zhao</p>
    </div>`;
  }

  function buildNameHtml(compact) {
    if (compact) {
      return `<button type="button" class="sidebar__name-link sidebar__name-link--expand" id="sidebar-name-expand" aria-label="Expand navigation">
        ${buildNameInner(true)}
      </button>`;
    }
    return `<a class="sidebar__name-link" href="${SITE_CONFIG.aboutPage}">
      ${buildNameInner(false)}
    </a>`;
  }

  function buildProjectList(currentPage) {
    return SITE_CONFIG.projects
      .map((p) => {
        const active = p.page === currentPage ? " is-active" : "";
        return `
          <li class="sidebar__project">
            <a class="sidebar__project-link${active}" href="${p.page}">
              <span class="sidebar__project-year">${p.year}</span>
              <span class="sidebar__project-title">${p.title}</span>
            </a>
          </li>`;
      })
      .join("");
  }

  function buildViewToggle(showToggle, mode) {
    if (!showToggle) {
      return `<div class="sidebar__view-toggle sidebar__view-toggle--reserved" aria-hidden="true"></div>`;
    }
    const galleryActive = mode === "gallery";
    return `
      <div class="sidebar__view-toggle" data-view-toggle>
        <div class="sidebar__view-options">
          <button type="button" class="sidebar__view-option${galleryActive ? " is-active" : ""}" data-set-view="gallery">
            Gallery VIEW
            ${galleryActive ? '<span class="sidebar__view-badge">ON</span>' : ""}
          </button>
          <button type="button" class="sidebar__view-option${!galleryActive ? " is-active" : ""}" data-set-view="grid">
            Grid VIEW
            ${!galleryActive ? '<span class="sidebar__view-badge">ON</span>' : ""}
          </button>
        </div>
      </div>`;
  }

  function buildDesktopSidebar(options) {
    const { showViewToggle = false, viewMode = "gallery", aboutActive = false } = options;
    const currentPage = getCurrentPage();
    const aboutClass = aboutActive ? " is-active" : "";

    return `
      <nav class="sidebar nav-desktop" id="sidebar" aria-label="Site navigation">
        <div class="sidebar__header" id="sidebar-header">
          <button type="button" class="sidebar__toggle" id="sidebar-toggle" aria-expanded="true" aria-label="Collapse navigation">
            <img src="${toggleIcon}" width="12" height="11" alt="" />
          </button>
          ${buildNameHtml(true)}
        </div>
        <div class="sidebar__body">
          ${buildNameHtml(false)}
          <div>
            <p class="sidebar__projects-label">Projects</p>
            <ul class="sidebar__projects">${buildProjectList(currentPage)}</ul>
          </div>
          <div class="sidebar__about${aboutClass}">
            <a class="sidebar__about-link" href="${SITE_CONFIG.aboutPage}">Bio/CV</a>
          </div>
        </div>
        ${buildViewToggle(showViewToggle, viewMode)}
      </nav>`;
  }

  function buildMobileNav(options) {
    const { aboutActive = false } = options;
    const currentPage = getCurrentPage();
    const aboutClass = aboutActive ? " is-active" : "";

    return `
      <nav class="topnav nav-mobile" id="topnav" aria-label="Site navigation">
        <div class="topnav__head">
          ${buildNameHtml(false)}
          <button type="button" class="topnav__menu" id="mobile-menu-toggle" aria-expanded="false" aria-label="Open navigation">
            <img src="${menuIcon}" width="12" height="8" alt="" />
          </button>
        </div>
        <div class="topnav__body" id="topnav-body" aria-hidden="true">
          <div class="topnav__projects">
            <p class="sidebar__projects-label">Projects</p>
            <ul class="sidebar__projects">${buildProjectList(currentPage)}</ul>
          </div>
          <div class="sidebar__about${aboutClass}">
            <a class="sidebar__about-link" href="${SITE_CONFIG.aboutPage}">Bio/CV</a>
          </div>
        </div>
      </nav>`;
  }

  window.renderSidebar = function (options) {
    return buildDesktopSidebar(options) + buildMobileNav(options);
  };

  function setNavCollapsed(collapsed) {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebar-toggle");
    const app = document.getElementById("app");
    if (!sidebar) return;

    sidebar.classList.toggle("is-collapsed", collapsed);
    if (toggle) {
      toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
      toggle.setAttribute(
        "aria-label",
        collapsed ? "Expand navigation" : "Collapse navigation"
      );
    }
    if (app) app.classList.toggle("is-nav-collapsed", collapsed);
    localStorage.setItem("portfolio-nav-collapsed", collapsed ? "1" : "0");
  }

  function setMobileMenuOpen(open) {
    const topnav = document.getElementById("topnav");
    const body = document.getElementById("topnav-body");
    const toggle = document.getElementById("mobile-menu-toggle");
    if (!topnav || !body) return;

    topnav.classList.toggle("is-expanded", open);
    body.setAttribute("aria-hidden", open ? "false" : "true");
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    }
  }

  window.initSidebar = function () {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("sidebar-toggle");
    const stored = localStorage.getItem("portfolio-nav-collapsed");
    if (stored === "1") setNavCollapsed(true);

    toggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      setNavCollapsed(!sidebar.classList.contains("is-collapsed"));
    });

    document.getElementById("sidebar-name-expand")?.addEventListener("click", () => {
      setNavCollapsed(false);
    });

    document.getElementById("mobile-menu-toggle")?.addEventListener("click", () => {
      const topnav = document.getElementById("topnav");
      setMobileMenuOpen(!topnav?.classList.contains("is-expanded"));
    });
  };

  window.isMobileViewport = function () {
    return window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
  };
})();
