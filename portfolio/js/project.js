(function () {
  const projectId = document.body.dataset.projectId;
  const project = SITE_CONFIG.projects.find((p) => p.id === projectId);

  if (!project) return;

  const VIEW_KEY = "portfolio-view";
  let mobileTrack = null;
  let scrollSyncTimer = null;

  function imageSrc(item) {
    return project.imageDir + encodeURI(item.file).replace(/#/g, "%23");
  }

  function getGalleryFit(item) {
    return item.galleryFit === "fit" ? "fit" : "fill";
  }

  function applyGalleryFit(img, item) {
    const fit = getGalleryFit(item);
    img.classList.toggle("gallery__image--fit", fit === "fit");
    img.classList.toggle("gallery__image--fill", fit === "fill");
  }

  function renderCaption(item) {
    const fields = [
      ["gallery-title", item.title],
      ["gallery-size", item.size],
      ["gallery-medium", item.medium],
      ["gallery-year", item.year],
    ];
    fields.forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const text = value || "";
      el.textContent = text;
      el.hidden = !text;
    });
    const details = document.getElementById("gallery-caption-details");
    if (details) {
      details.hidden = ![item.size, item.medium, item.year].some(Boolean);
    }
  }

  function getCurrentIndex() {
    return Number(sessionStorage.getItem(`portfolio-index-${projectId}`) || "0");
  }

  function setCurrentIndex(index) {
    sessionStorage.setItem(`portfolio-index-${projectId}`, String(index));
  }

  function removeGalleryNavigation() {
    document.querySelectorAll(".gallery__nav-zone").forEach((el) => el.remove());
  }

  function setupGalleryNavigation() {
    const stage = document.querySelector(".gallery__stage");
    if (!stage || stage.querySelector(".gallery__nav-zone")) return;

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "gallery__nav-zone gallery__nav-zone--prev";
    prev.setAttribute("aria-label", "Previous image");

    const next = document.createElement("button");
    next.type = "button";
    next.className = "gallery__nav-zone gallery__nav-zone--next";
    next.setAttribute("aria-label", "Next image");

    const caption = stage.querySelector(".gallery__caption");
    stage.insertBefore(prev, caption);
    stage.insertBefore(next, caption);

    prev.addEventListener("click", () => {
      goToIndex(getCurrentIndex() - 1);
    });
    next.addEventListener("click", () => {
      goToIndex(getCurrentIndex() + 1);
    });
  }

  function renderGallery(index) {
    const items = project.images;
    const img = document.getElementById("gallery-image");
    if (!img) return;
    if (!items.length) {
      img.alt = "No images yet — add files in site-config.js";
      return;
    }
    const i = ((index % items.length) + items.length) % items.length;
    const item = items[i];
    img.src = imageSrc(item);
    img.alt = item.title || project.title;
    applyGalleryFit(img, item);
    renderCaption(item);
    setCurrentIndex(i);
  }

  function goToIndex(index) {
    const items = project.images;
    if (!items.length) return;
    const i = ((index % items.length) + items.length) % items.length;
    if (isMobileViewport() && mobileTrack) {
      const slide = mobileTrack.children[i];
      if (slide) {
        mobileTrack.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
      }
      renderCaption(items[i]);
      setCurrentIndex(i);
      return;
    }
    renderGallery(i);
  }

  function setupMobileGallery() {
    if (mobileTrack) return;

    const stage = document.querySelector(".gallery__stage");
    const desktopWrap = stage?.querySelector(".gallery__image-wrap");
    if (!stage || !desktopWrap || !project.images.length) return;

    mobileTrack = document.createElement("div");
    mobileTrack.className = "gallery__mobile-track";
    mobileTrack.setAttribute("role", "region");
    mobileTrack.setAttribute("aria-label", "Gallery images");

    project.images.forEach((item, index) => {
      const slide = document.createElement("div");
      slide.className = "gallery__mobile-slide";
      slide.dataset.index = String(index);

      const img = document.createElement("img");
      img.className = "gallery__image gallery__image--fit";
      img.src = imageSrc(item);
      img.alt = item.title || project.title;

      slide.appendChild(img);
      mobileTrack.appendChild(slide);
    });

    stage.insertBefore(mobileTrack, desktopWrap);

    mobileTrack.addEventListener("scroll", () => {
      clearTimeout(scrollSyncTimer);
      scrollSyncTimer = setTimeout(syncCaptionFromScroll, 80);
    }, { passive: true });

    const storedIndex = getCurrentIndex();
    requestAnimationFrame(() => {
      const slide = mobileTrack.children[storedIndex];
      if (slide) mobileTrack.scrollLeft = slide.offsetLeft;
      renderCaption(project.images[storedIndex]);
    });
  }

  function syncCaptionFromScroll() {
    if (!mobileTrack || !project.images.length) return;
    const scrollLeft = mobileTrack.scrollLeft;
    const width = mobileTrack.clientWidth || 1;
    const index = Math.round(scrollLeft / width);
    const clamped = Math.max(0, Math.min(index, project.images.length - 1));
    if (clamped !== getCurrentIndex()) {
      setCurrentIndex(clamped);
      renderCaption(project.images[clamped]);
    }
  }

  function teardownMobileGallery() {
    mobileTrack?.remove();
    mobileTrack = null;
  }

  function resetGalleryMode() {
    teardownMobileGallery();
    removeGalleryNavigation();
    initGalleryMode();
  }

  function isGridVisible(item) {
    return item.showInGrid !== false;
  }

  function renderGrid() {
    const grid = document.getElementById("project-grid");
    if (!grid) return;
    if (!project.images.length) {
      grid.innerHTML = `<p class="grid__empty">Add images for this project in <code>js/site-config.js</code>.</p>`;
      return;
    }
    const gridEntries = project.images
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => isGridVisible(item));
    if (!gridEntries.length) {
      grid.innerHTML = `<p class="grid__empty">No grid images — set <code>showInGrid: true</code> (or remove <code>showInGrid: false</code>) in <code>js/site-config.js</code>.</p>`;
      return;
    }
    grid.innerHTML = gridEntries
      .map(
        ({ item, index }) => `
        <div class="grid__cell">
          <a class="grid__cell-link" href="#" data-grid-index="${index}" aria-label="${item.title || "View work"}">
            <img src="${imageSrc(item)}" alt="${item.title || ""}" loading="lazy" />
          </a>
        </div>`
      )
      .join("");
    grid.querySelectorAll("[data-grid-index]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const index = Number(link.dataset.gridIndex);
        setView("gallery", { persist: false });
        goToIndex(index);
      });
    });
  }

  function setupGridWheelScroll() {
    const gridMain = document.querySelector(".main--grid");
    if (!gridMain || gridMain.dataset.wheelBound) return;
    gridMain.dataset.wheelBound = "1";

    gridMain.addEventListener(
      "wheel",
      (e) => {
        if (!e.target.closest(".grid__cell")) return;
        if (gridMain.scrollHeight <= gridMain.clientHeight) return;
        if (e.deltaY === 0) return;
        gridMain.scrollTop += e.deltaY;
        e.preventDefault();
      },
      { passive: false }
    );
  }

  function gridViewEnabled() {
    return project.showGridView !== false;
  }

  function getStoredView() {
    if (isMobileViewport() || !gridViewEnabled()) return "gallery";
    return sessionStorage.getItem(VIEW_KEY) || "gallery";
  }

  function setView(mode, options = {}) {
    const { persist = true } = options;
    if ((isMobileViewport() || !gridViewEnabled()) && mode === "grid") return;

    const app = document.getElementById("app");
    const gallery = document.querySelector("[data-view='gallery']");
    const grid = document.querySelector("[data-view='grid']");
    const isGallery = mode === "gallery";

    app.classList.toggle("app--project-gallery", isGallery);
    app.classList.toggle("app--project-grid", !isGallery);
    gallery?.classList.toggle("is-hidden", !isGallery);
    grid?.classList.toggle("is-hidden", isGallery);

    document.querySelectorAll("[data-set-view]").forEach((btn) => {
      const active = btn.dataset.setView === mode;
      btn.classList.toggle("is-active", active);
      const badge = btn.querySelector(".sidebar__view-badge");
      if (active && !badge) {
        btn.insertAdjacentHTML("beforeend", '<span class="sidebar__view-badge">ON</span>');
      } else if (!active && badge) {
        badge.remove();
      }
    });

    if (persist) sessionStorage.setItem(VIEW_KEY, mode);
  }

  function initGalleryMode() {
    const mobile = isMobileViewport();

    if (mobile) {
      removeGalleryNavigation();
      setupMobileGallery();
      return;
    }

    teardownMobileGallery();
    setupGalleryNavigation();
    const galleryImg = document.getElementById("gallery-image");
    if (galleryImg) galleryImg.classList.add("gallery__image--fill");
    renderGallery(getCurrentIndex());
  }

  window.initProjectPage = function () {
    const navHost = document.getElementById("nav-host");
    const mobile = isMobileViewport();
    const storedView = getStoredView();

    navHost.innerHTML = renderSidebar({
      showViewToggle: !mobile && gridViewEnabled(),
      viewMode: storedView,
    });
    initSidebar();

    renderGrid();
    setupGridWheelScroll();
    initGalleryMode();
    setView(storedView);

    document.querySelectorAll("[data-set-view]").forEach((btn) => {
      btn.addEventListener("click", () => setView(btn.dataset.setView));
    });

    document.addEventListener("keydown", (e) => {
      const galleryEl = document.querySelector("[data-view='gallery']");
      if (!galleryEl || galleryEl.classList.contains("is-hidden")) return;
      if (e.key === "ArrowRight") goToIndex(getCurrentIndex() + 1);
      if (e.key === "ArrowLeft") goToIndex(getCurrentIndex() - 1);
    });

    let wasMobile = isMobileViewport();

    window.addEventListener("resize", () => {
      const nowMobile = isMobileViewport();
      if (nowMobile) {
        setView("gallery", { persist: false });
      }
      if (nowMobile !== wasMobile) {
        resetGalleryMode();
        wasMobile = nowMobile;
      }
    });
  };
})();
