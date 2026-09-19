const $ = (selector) => document.querySelector(selector);

function setText(selector, value) {
  const el = $(selector);
  if (el) el.textContent = value || "";
}

function renderCards(items) {
  const grid = $("#about-cards");
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

    const link = document.createElement("a");
    link.href = project.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "View More";

    body.append(category, title, link);
    card.append(image, body);
    return card;
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

fetch("content.json")
  .then((response) => response.json())
  .then((content) => {
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
    setText("[data-address]", content.address);
    setText("[data-footer-title]", content.siteTitle);
    setText("[data-footer-school]", content.school);
    $("[data-phone]")?.setAttribute("href", `tel:${content.phoneHref}`);
    $("[data-email]")?.setAttribute("href", `mailto:${content.email}`);
    $(".button.secondary")?.setAttribute("href", `mailto:${content.email}`);
    renderCards(content.aboutCards);
    renderProjects(content.projects);
  })
  .catch(() => document.body.classList.add("content-error"));

wireEasterEggs();
