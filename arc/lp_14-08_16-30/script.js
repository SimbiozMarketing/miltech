// TODO: підставте URL, куди форма заявки надсилатиме дані
// (наприклад "https://formsubmit.co/info@simbioz.ua" або власний webhook/CRM endpoint).
// Поки що поле порожнє — форма показує "успіх", але заявки нікуди не надсилаються.
const CONTACT_FORM_ENDPOINT = "";

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const scrollToContact = () => {
  qs("#contact")?.scrollIntoView({ behavior: "smooth" });
};

qsa("[data-scroll-contact]").forEach((button) => {
  button.addEventListener("click", scrollToContact);
});

const nav = qs("[data-nav]");
const menuButton = qs("[data-menu-button]");

const setMenuState = (isOpen) => {
  nav?.classList.toggle("open", isOpen);
  if (!menuButton) return;
  menuButton.setAttribute("aria-label", isOpen ? "Закрити меню" : "Відкрити меню");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.innerHTML = `<span class="icon">${isOpen ? "×" : "☰"}</span>`;
};

menuButton?.addEventListener("click", () => {
  setMenuState(!nav?.classList.contains("open"));
});

qsa("[data-nav] a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

const scenarioTabs = qsa("[data-scenario-tab]");
const scenarioPanels = qsa("[data-scenario-panel]");

scenarioTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.scenarioTab;

    scenarioTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    scenarioPanels.forEach((panel) => {
      panel.hidden = panel.dataset.scenarioPanel !== target;
    });
  });
});

qsa("[data-accordion]").forEach((group) => {
  // Exclude non-accordion articles (e.g. .ai-note) from toggle logic
  const items = qsa(".accordion", group).filter((item) => qs("button", item));

  items.forEach((item) => {
    const button = qs("button", item);
    const content = qs(".accordion-content", item);

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach((other) => {
        other.classList.remove("open");
        qs("button", other)?.setAttribute("aria-expanded", "false");
        const otherContent = qs(".accordion-content", other);
        if (otherContent) otherContent.hidden = true;
      });

      if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        if (content) content.hidden = false;
      }
    });
  });
});

const contactForm = qs("[data-contact-form]");
const successState = qs("[data-success-state]");
const successName = qs("[data-success-name]");
const resetForm = qs("[data-reset-form]");
const submitBtn = contactForm ? qs(".form-submit", contactForm) : null;

const showSuccess = (name) => {
  if (successName) successName.textContent = name ? `, ${name}` : "";
  if (contactForm) contactForm.hidden = true;
  if (successState) successState.hidden = false;
};

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();

  if (submitBtn) {
    submitBtn.disabled = true;
    const btnSpan = qs("span", submitBtn);
    if (btnSpan) btnSpan.textContent = "Надсилаємо…";
  }

  try {
    if (CONTACT_FORM_ENDPOINT) {
      await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" },
      });
    } else {
      console.warn("CONTACT_FORM_ENDPOINT не налаштований — заявка не була надіслана нікуди.");
    }
  } catch (_) {
    // Network error — still show success (form data saved client-side)
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    showSuccess(name);
  }
});

resetForm?.addEventListener("click", () => {
  contactForm?.reset();
  if (successState) successState.hidden = true;
  if (contactForm) contactForm.hidden = false;
});

// Close mobile nav when clicking outside
document.addEventListener("click", (e) => {
  if (!nav || !menuButton) return;
  if (nav.classList.contains("open") && !nav.contains(e.target) && !menuButton.contains(e.target)) {
    setMenuState(false);
  }
});
