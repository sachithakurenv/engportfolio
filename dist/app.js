const $ = (selector) => document.querySelector(selector);
const themeStorageKey = "sachi-portfolio-theme";

function setText(selector, value) {
  const el = $(selector);
  if (el) el.textContent = value || "";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const toggle = $(".theme-toggle");
  if (!toggle) return;
  const isDark = theme === "dark";
  toggle.setAttribute("aria-pressed", String(isDark));
  toggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  $(".theme-icon").textContent = isDark ? "☀" : "☾";
  $(".theme-label").textContent = isDark ? "Light" : "Dark";
}

function wireThemeToggle() {
  const savedTheme = localStorage.getItem(themeStorageKey);
  const systemTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(savedTheme || systemTheme);

  $(".theme-toggle")?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
  });
}

function renderCards(items, selector = "#about-cards") {
  const grid = $(selector);
  grid.replaceChildren(...items.map((item) => {
    const card = document.createElement("article");
    card.className = "about-card";
    const title = document.createElement("b");
    title.textContent = item.title;
    const text = document.createElement("p");
    text.textContent = item.text;
    card.append(title, text);
    return card;
  }));
}

function renderProjectDetail(project, target) {
  for (const section of project.details || []) {
    const heading = document.createElement("h3");
    heading.textContent = section.heading;
    const text = document.createElement("p");
    text.textContent = section.text;
    target.append(heading, text);
  }

  if (project.gallery?.length) {
    const gallery = document.createElement("div");
    gallery.className = "project-gallery";
    for (const item of project.gallery) {
      const src = typeof item === "string" ? item : item.src;
      const caption = typeof item === "string" ? "Project visual" : item.alt || "Project visual";
      const figure = document.createElement("figure");
      const imageLink = document.createElement("a");
      imageLink.href = src;
      imageLink.target = "_blank";
      imageLink.rel = "noreferrer";
      const image = document.createElement("img");
      image.src = src;
      image.alt = caption;
      imageLink.append(image);
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = caption;
      figure.append(imageLink, figcaption);
      gallery.append(figure);
    }
    target.append(gallery);
  }

  if (project.links?.length) {
    const links = document.createElement("div");
    links.className = "project-links";
    for (const item of project.links) {
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = item.label;
      links.append(link);
    }
    target.append(links);
  }
}

function renderProjects(projects) {
  const grid = $("#project-grid");
  grid.replaceChildren(...projects.map((project) => {
    const card = document.createElement("article");
    card.className = "project";

    const image = document.createElement("img");
    image.src = project.image;
    image.alt = "";

    const body = document.createElement("div");
    body.className = "project-body";

    const category = document.createElement("small");
    category.textContent = project.category;

    const title = document.createElement("h3");
    title.textContent = project.title;

    const summaryText = document.createElement("p");
    summaryText.className = "project-summary";
    summaryText.textContent = project.summary || "";

    const link = document.createElement("a");
    link.className = "project-open";
    link.href = `project.html?project=${encodeURIComponent(project.slug)}`;
    link.textContent = "Open full project";
    body.append(category, title, summaryText, link);
    card.append(image, body);
    return card;
  }));
}

function renderProjectPage(content) {
  const slug = new URLSearchParams(location.search).get("project");
  const project = content.projects.find((item) => item.slug === slug);
  if (!project) {
    location.replace("index.html#projects");
    return;
  }

  document.title = `${project.title} | ${content.siteTitle}`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", project.summary);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", location.href);
  setText("[data-project-category]", project.category);
  setText("[data-project-title]", project.title);
  setText("[data-project-summary]", project.summary);
  const image = $("[data-project-image]");
  image.src = project.image;
  image.alt = project.title;
  renderProjectDetail(project, $("#project-detail"));
}

function renderResume(content) {
  document.title = `Resume | ${content.siteTitle}`;
  setText("[data-resume-name]", content.siteTitle.replace("'s Portfolio", ""));
  setText("[data-resume-school]", content.education.title);
  setText("[data-resume-summary]", content.intro);
  setText("[data-resume-focus]", content.education.text);
  setText("[data-resume-email]", content.email);
  setText("[data-resume-phone]", content.phone);
  const projects = $("#resume-projects");
  projects.replaceChildren(...content.projects.map((project) => {
    const item = document.createElement("li");
    item.textContent = `${project.title}: ${project.summary}`;
    return item;
  }));
}

function renderSocials(items) {
  const socialList = $("#socials");
  if (!socialList) return;
  socialList.replaceChildren(...(items || []).map((item) => {
    const link = document.createElement("a");
    link.className = "contact-row";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = item.label;
    return link;
  }));
}

function wireEasterEggs() {
  let logoClicks = 0;
  $(".brand img")?.addEventListener("click", (event) => {
    event.preventDefault();
    logoClicks += 1;
    if (logoClicks === 3) document.body.classList.toggle("watershed-mode");
  });

  let typed = "";
  window.addEventListener("keydown", (event) => {
    typed = (typed + event.key.toUpperCase()).slice(-6);
    if (typed === "ILLINI") {
      document.body.classList.add("illini-mode");
      setTimeout(() => document.body.classList.remove("illini-mode"), 3200);
    }
  });
}

fetch("content.json", { cache: "no-store" })
  .then((response) => response.json())
  .then((content) => {
    if (new URLSearchParams(location.search).has("preview")) {
      const draft = localStorage.getItem("sachi-portfolio-draft");
      if (draft) content = JSON.parse(draft);
    }
    document.title = `${content.siteTitle} | Environmental Engineering`;
    setText("[data-site-title]", content.siteTitle);
    setText("[data-school]", content.school);
    setText("[data-tagline]", content.tagline);
    setText("[data-intro]", content.intro);
    setText("[data-hero-note]", content.heroNote);
    setText("[data-profile-title]", content.profileTitle);
    setText("[data-profile-text]", content.profileText);
    setText("[data-about-title]", content.aboutTitle);
    setText("[data-about-text]", content.aboutText);
    setText("[data-projects-title]", content.projectsTitle);
    setText("[data-projects-text]", content.projectsText);
    setText("[data-contact-eyebrow]", content.contactEyebrow);
    setText("[data-contact-title]", content.contactTitle);
    setText("[data-contact-text]", content.contactText);
    setText("[data-phone-value]", content.phone);
    setText("[data-email-value]", content.email);
    setText("[data-location]", content.location);
    setText("[data-footer-title]", content.siteTitle);
    setText("[data-footer-school]", content.school);
    $("[data-phone]")?.setAttribute("href", `tel:${content.phoneHref}`);
    $("[data-email]")?.setAttribute("href", `mailto:${content.email}`);
    $(".contact-link")?.setAttribute("href", `mailto:${content.email}`);
    if ($("#project-page")) renderProjectPage(content);
    else if ($("#resume-page")) renderResume(content);
    else {
      renderCards(content.aboutCards);
      setText("[data-education-title]", content.education.title);
      setText("[data-education-text]", content.education.text);
      renderSocials(content.socials);
      renderProjects(content.projects);
    }
  })
  .catch(() => document.body.classList.add("content-error"));

wireEasterEggs();
wireThemeToggle();
