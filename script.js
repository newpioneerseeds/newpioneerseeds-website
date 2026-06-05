(function () {
  "use strict";

  const EMAILJS_CONFIG = {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID"
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loader = document.querySelector("[data-loader]");
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const counters = Array.from(document.querySelectorAll("[data-counter]"));
  const heroImage = document.querySelector("[data-parallax]");
  const yearTarget = document.querySelector("[data-year]");
  const form = document.querySelector("[data-inquiry-form]");
  const formStatus = document.querySelector("[data-form-status]");
  const submitButton = document.querySelector("[data-submit-button]");
  const lightbox = document.querySelector("[data-lightbox-modal]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");
  const galleryButtons = Array.from(document.querySelectorAll("[data-lightbox]"));
  const testimonialTrack = document.querySelector("[data-testimonial-track]");
  const testimonialCards = Array.from(document.querySelectorAll(".testimonial-card"));
  const testimonialDots = document.querySelector("[data-testimonial-dots]");
  const testimonialPrev = document.querySelector("[data-testimonial-prev]");
  const testimonialNext = document.querySelector("[data-testimonial-next]");
  let testimonialIndex = 0;
  let testimonialTimer = null;
  let lastFocusedElement = null;

  document.body.classList.add("is-loading");

  const hideLoader = () => {
    if (hideLoader.done) return;
    hideLoader.done = true;
    window.setTimeout(() => {
      if (loader) {
        loader.classList.add("is-hidden");
      }
      document.body.classList.remove("is-loading");
    }, prefersReducedMotion ? 120 : 900);
  };

  window.addEventListener("load", hideLoader, { once: true });
  window.setTimeout(hideLoader, prefersReducedMotion ? 300 : 1700);

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMobileNav = () => {
    if (!navToggle || !navMenu) return;
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    navMenu.classList.remove("is-open");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      navMenu.classList.toggle("is-open", isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMobileNav));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileNav();
        closeLightbox();
      }
    });
  }

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0.01 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (revealItems.length) {
    if (prefersReducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );

      revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
        revealObserver.observe(item);
      });
    }
  }

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || "";
    const duration = 1350;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      counter.textContent = `${current.toLocaleString("en-IN")}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = `${target.toLocaleString("en-IN")}${suffix}`;
      }
    };

    requestAnimationFrame(tick);
  };

  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  if (heroImage && !prefersReducedMotion) {
    let ticking = false;
    const updateParallax = () => {
      const offset = Math.min(window.scrollY * 0.12, 80);
      heroImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateParallax);
      },
      { passive: true }
    );
  }

  document.querySelectorAll("[data-product-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const product = link.getAttribute("data-product-link");
      window.setTimeout(() => {
        const productInput = document.querySelector("#product");
        if (productInput && product) {
          productInput.value = product;
        }
      }, 350);
    });
  });

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      if (!item) return;
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  const openLightbox = (button) => {
    if (!lightbox || !lightboxImage) return;
    lastFocusedElement = document.activeElement;
    const src = button.getAttribute("data-full");
    const alt = button.querySelector("img")?.getAttribute("alt") || "Gallery preview";
    lightboxImage.src = src || "";
    lightboxImage.alt = alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage || !lightbox.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImage.src = "";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => openLightbox(button));
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  const updateTestimonials = () => {
    if (!testimonialTrack) return;
    testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;

    testimonialCards.forEach((card, index) => {
      card.classList.toggle("is-active", index === testimonialIndex);
    });

    testimonialDots?.querySelectorAll("button").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === testimonialIndex);
      dot.setAttribute("aria-current", index === testimonialIndex ? "true" : "false");
    });
  };

  const goToTestimonial = (index) => {
    testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;
    updateTestimonials();
  };

  const startTestimonials = () => {
    if (prefersReducedMotion || testimonialCards.length < 2) return;
    stopTestimonials();
    testimonialTimer = window.setInterval(() => {
      goToTestimonial(testimonialIndex + 1);
    }, 6200);
  };

  const stopTestimonials = () => {
    if (testimonialTimer) {
      window.clearInterval(testimonialTimer);
      testimonialTimer = null;
    }
  };

  if (testimonialCards.length && testimonialDots && testimonialPrev && testimonialNext) {
    testimonialCards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
      dot.addEventListener("click", () => {
        goToTestimonial(index);
        startTestimonials();
      });
      testimonialDots.appendChild(dot);
    });

    testimonialPrev.addEventListener("click", () => {
      goToTestimonial(testimonialIndex - 1);
      startTestimonials();
    });

    testimonialNext.addEventListener("click", () => {
      goToTestimonial(testimonialIndex + 1);
      startTestimonials();
    });

    const slider = document.querySelector("[data-testimonial-slider]");
    slider?.addEventListener("mouseenter", stopTestimonials);
    slider?.addEventListener("mouseleave", startTestimonials);
    slider?.addEventListener("focusin", stopTestimonials);
    slider?.addEventListener("focusout", startTestimonials);

    updateTestimonials();
    startTestimonials();
  }

  const isEmailConfigured = () => {
    return Object.values(EMAILJS_CONFIG).every((value) => value && !value.startsWith("YOUR_EMAILJS"));
  };

  const setFieldError = (field, message) => {
    const row = field.closest(".form-row");
    const error = document.querySelector(`[data-error-for="${field.name}"]`);
    row?.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) {
      error.textContent = message;
    }
  };

  const validateForm = () => {
    if (!form) return false;

    let isValid = true;
    const fields = Array.from(form.querySelectorAll("input, select, textarea"));

    fields.forEach((field) => {
      let message = "";
      const value = field.value.trim();

      if (field.required && !value) {
        message = "This field is required.";
      } else if (field.name === "name" && value && value.length < 2) {
        message = "Please enter a valid name.";
      } else if (field.name === "mobile" && value && !/^[0-9+\-\s()]{8,18}$/.test(value)) {
        message = "Please enter a valid mobile number.";
      } else if (field.name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = "Please enter a valid email address.";
      } else if (field.name === "message" && value && value.length < 10) {
        message = "Please add a little more detail.";
      }

      setFieldError(field, message);
      if (message) isValid = false;
    });

    return isValid;
  };

  const buildWhatsAppMessage = (formData) => {
    const lines = [
      "Hello New Pioneer Seeds Pvt. Ltd.,",
      "I would like to send a seed inquiry.",
      "",
      `Name: ${formData.get("name")}`,
      `Mobile: ${formData.get("mobile")}`,
      `Email: ${formData.get("email") || "Not provided"}`,
      `Product Interest: ${formData.get("product")}`,
      `Message: ${formData.get("message")}`
    ];

    return `https://wa.me/919058684357?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  if (form) {
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => setFieldError(field, ""));
      field.addEventListener("blur", () => validateForm());
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (formStatus) {
        formStatus.textContent = "";
        formStatus.classList.remove("is-error");
      }

      if (!validateForm()) {
        formStatus?.classList.add("is-error");
        if (formStatus) {
          formStatus.textContent = "Please review the highlighted fields before submitting.";
        }
        return;
      }

      const formData = new FormData(form);
      const payload = {
        name: formData.get("name"),
        mobile: formData.get("mobile"),
        email: formData.get("email") || "Not provided",
        product: formData.get("product"),
        message: formData.get("message"),
        company_email: "newpioneerseeds@gmail.com"
      };

      submitButton?.setAttribute("disabled", "true");
      if (submitButton) {
        submitButton.textContent = "Submitting...";
      }

      try {
        if (isEmailConfigured() && window.emailjs) {
          emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
          await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, payload);
          if (formStatus) {
            formStatus.textContent = "Thank you. Your inquiry has been sent successfully.";
          }
          form.reset();
        } else {
          const whatsappUrl = buildWhatsAppMessage(formData);
          if (formStatus) {
            formStatus.textContent =
              "Thank you. Opening WhatsApp with your inquiry so our team can respond quickly.";
          }
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        }
      } catch (error) {
        console.error("Inquiry submission failed:", error);
        formStatus?.classList.add("is-error");
        if (formStatus) {
          formStatus.textContent =
            "Your inquiry could not be sent right now. Please call or WhatsApp +91 9058684357.";
        }
      } finally {
        submitButton?.removeAttribute("disabled");
        if (submitButton) {
          submitButton.textContent = "Submit Inquiry";
        }
      }
    });
  }
})();
