/**
 * ELK Roofing - Main JavaScript
 * Contains all interactive functionality for the website
 */

document.addEventListener("DOMContentLoaded", function () {
  initHeaderScroll();
  initMobileMenu();
  initSmoothScrolling();
  initTestimonialSlider();
  initServiceModals();
  initContactForm();
  initAnimations();
  initFloatingButton();
  initGallery();
});

/**
 * Header scroll effect
 * Adds a class to the header when scrolled
 */
function initHeaderScroll() {
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.classList.remove("scrolled");
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    }
  });
}

/**
 * Mobile Menu Toggle - Clean and Simple
 */
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  const hamburger = document.querySelector(".hamburger");
  const body = document.body;

  // Safety check
  if (!mobileMenuBtn || !mobileNav || !mobileNavOverlay || !hamburger) {
    console.error("Mobile menu elements not found");
    return;
  }

  function showMenu() {
    console.log('Showing mobile menu');
    
    // Add show classes
    mobileNav.classList.add("show");
    mobileNavOverlay.classList.add("show");
    hamburger.classList.add("open");
    body.classList.add("mobile-menu-open");
    
    // Update ARIA
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    
    console.log('Mobile menu shown');
  }

  function hideMenu() {
    console.log('Hiding mobile menu');
    
    // Remove show classes
    mobileNav.classList.remove("show");
    mobileNavOverlay.classList.remove("show");
    hamburger.classList.remove("open");
    body.classList.remove("mobile-menu-open");
    
    // Update ARIA
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    
    console.log('Mobile menu hidden');
  }

  function toggleMenu(e) {
    if (e) e.preventDefault();
    
    const isMenuOpen = mobileNav.classList.contains("show");
    console.log('Toggle menu - Currently open:', isMenuOpen);

    if (isMenuOpen) {
      hideMenu();
    } else {
      showMenu();
    }
  }

  // Event listeners
  mobileMenuBtn.addEventListener("click", toggleMenu);
  
  // Keyboard support
  mobileMenuBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Close on overlay click
  mobileNavOverlay.addEventListener("click", hideMenu);

  // Close on nav link click
  const mobileNavLinks = mobileNav.querySelectorAll("a");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", hideMenu);
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("show")) {
      hideMenu();
    }
  });

  // Close on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992 && mobileNav.classList.contains("show")) {
      hideMenu();
    }
  });
}

/**
 * Smooth Scrolling for Anchor Links
 * Provides smooth scrolling to element when clicking on anchor links
 * Uses a completely custom approach to ensure relative scrolling
 */
function initSmoothScrolling() {
  // Create custom smooth scroll function to ensure consistent behavior
  function smoothScrollTo(targetElement) {
    if (!targetElement) return;
    
    // Calculate header height dynamically
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 80;
    
    // Get the distance from the current viewport position to the target
    const targetRect = targetElement.getBoundingClientRect();
    
    // Calculate amount to scroll (accounting for header)
    const scrollAmount = targetRect.top - headerHeight;
    
    // Use scrollBy for relative scrolling from current position
    window.scrollBy({
      top: scrollAmount,
      behavior: "smooth"
    });
  }
  
  // Add click handler to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Skip for href="#"
      if (this.getAttribute("href") === "#") return;
      
      // Find target element
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Detect if this is a mobile menu link
        const isMobileMenuLink = anchor.closest(".nav-links") && window.innerWidth <= 992;
        
        // Use a longer delay for mobile menu links to ensure the menu animation completes
        // and the page layout stabilizes before scrolling
        const scrollDelay = isMobileMenuLink ? 300 : 50;
        
        // Use custom scroll function with appropriate delay
        setTimeout(() => {
          // On mobile, recalculate the position right before scrolling
          // This helps with accuracy after the menu is closed
          smoothScrollTo(targetElement);
        }, scrollDelay);
      }
    });
  });
  
  // Make floating button use the same smooth scroll
  const floatingBtn = document.querySelector('.floating-btn a');
  if (floatingBtn) {
    floatingBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        smoothScrollTo(targetElement);
      }
    });
  }
}

/**
 * Testimonial Slider Functionality
 * Manages the testimonial slider with navigation (manual control only)
 */
function initTestimonialSlider() {
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const testimonialDots = document.querySelectorAll(".testimonial-dot");
  const prevTestimonial = document.querySelector(".prev-testimonial");
  const nextTestimonial = document.querySelector(".next-testimonial");
  const testimonialSlider = document.querySelector(".testimonial-slider");

  if (!testimonialSlider) return;

  let currentSlide = 0;
  let touchStartX = 0;

  function showSlide(index) {
    // Handle wrapping around
    if (index < 0) index = testimonialSlides.length - 1;
    if (index >= testimonialSlides.length) index = 0;

    // Hide all slides
    testimonialSlides.forEach((slide) => {
      slide.classList.remove("active");
    });

    // Show the current slide with animation
    testimonialSlides[index].classList.add("active");

    // Update dots
    testimonialDots.forEach((dot) => {
      dot.classList.remove("active");
    });
    testimonialDots[index].classList.add("active");

    currentSlide = index;
  }

  // Event listeners for navigation
  if (prevTestimonial) {
    prevTestimonial.addEventListener("click", () => {
      showSlide(currentSlide - 1);
    });
  }

  if (nextTestimonial) {
    nextTestimonial.addEventListener("click", () => {
      showSlide(currentSlide + 1);
    });
  }

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  // Touch events for swipe on mobile
  testimonialSlider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  testimonialSlider.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        // Simple threshold
        if (diff > 0) {
          showSlide(currentSlide + 1); // Next slide
        } else {
          showSlide(currentSlide - 1); // Previous slide
        }
      }
    },
    { passive: true }
  );

  // Initial slide setup
  showSlide(0);
}

/**
 * Service Modal Functionality
 * Handles opening and closing of service details modals
 */
function initServiceModals() {
  const modal = document.getElementById("serviceModal");
  if (!modal) return;

  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.querySelector(".close-modal");
  const mobileCloseBtn = document.querySelector(".mobile-close-btn");

  // Service details content
  const serviceDetails = {
    residential: {
      title: "Residential Roofing",
      content: `
                <p>Our residential roofing services are designed to provide homeowners with peace of mind and lasting protection. We offer a wide range of roofing options to suit your style, budget, and needs.</p>
                <h4>Our Residential Roofing Services Include:</h4>
                <ul>
                    <li>Roof installation for new construction</li>
                    <li>Complete roof replacement</li>
                    <li>Roof repairs and maintenance</li>
                    <li>Roof inspections and certifications</li>
                    <li>Emergency roof repairs</li>
                </ul>
                <h4>Roofing Materials We Offer:</h4>
                <ul>
                    <li>Asphalt shingles (3-tab, architectural, and premium)</li>
                    <li>Metal roofing (standing seam, metal shingles)</li>
                    <li>Tile roofing (clay, concrete)</li>
                    <li>Slate roofing</li>
                    <li>Wood shakes and shingles</li>
                    <li>Flat roofing systems</li>
                </ul>
                <p>All our residential roofing services come with comprehensive warranties and are performed by our experienced, factory-trained installers.</p>
            `,
    },
    commercial: {
      title: "Commercial Roofing",
      content: `
                <p>ELK Roofing provides comprehensive commercial roofing solutions designed to protect your business investment while minimizing disruption to your operations.</p>
                <h4>Our Commercial Roofing Services Include:</h4>
                <ul>
                    <li>New commercial roof installation</li>
                    <li>Commercial roof replacement</li>
                    <li>Roof repairs and maintenance programs</li>
                    <li>Roof coatings and restoration</li>
                    <li>Emergency leak repairs</li>
                    <li>Preventative maintenance plans</li>
                </ul>
                <h4>Commercial Roofing Systems We Offer:</h4>
                <ul>
                    <li>TPO (Thermoplastic Polyolefin)</li>
                    <li>EPDM (Ethylene Propylene Diene Monomer)</li>
                    <li>PVC (Polyvinyl Chloride)</li>
                    <li>Modified Bitumen</li>
                    <li>Built-Up Roofing (BUR)</li>
                    <li>Metal Roofing Systems</li>
                    <li>Green Roofing Solutions</li>
                </ul>
                <p>We understand that commercial roofing projects require careful planning and execution. Our team works closely with business owners and property managers to develop roofing solutions that meet their specific needs and budget constraints.</p>
            `,
    },
    siding: {
      title: "Siding Installation",
      content: `
                <p>Quality siding not only enhances your home's curb appeal but also provides essential protection against the elements. At ELK Roofing, we offer professional siding installation services using premium materials.</p>
                <h4>Benefits of New Siding:</h4>
                <ul>
                    <li>Improved energy efficiency</li>
                    <li>Enhanced curb appeal and property value</li>
                    <li>Better protection against weather elements</li>
                    <li>Reduced maintenance requirements</li>
                    <li>Noise reduction</li>
                </ul>
                <h4>Siding Options We Offer:</h4>
                <ul>
                    <li>Vinyl Siding</li>
                    <li>Fiber Cement Siding</li>
                    <li>Wood Siding</li>
                    <li>Engineered Wood Siding</li>
                    <li>Metal Siding</li>
                    <li>Stone and Brick Veneer</li>
                </ul>
                <p>Our siding installation process includes a thorough inspection of your existing exterior, removal of old siding if necessary, preparation of the surface, and expert installation of your new siding. We pay close attention to details like proper insulation, ventilation, and trim work to ensure a beautiful and long-lasting result.</p>
            `,
    },
    storm: {
      title: "Storm Damage Repair",
      content: `
                <p>When severe weather strikes, ELK Roofing is here to help with prompt, professional storm damage repair services. We understand the stress and urgency that comes with storm damage, and we're committed to restoring your property quickly and effectively.</p>
                <h4>Our Storm Damage Services Include:</h4>
                <ul>
                    <li>24/7 emergency response</li>
                    <li>Comprehensive damage assessment</li>
                    <li>Temporary protective measures (tarping, board-up)</li>
                    <li>Full roof repairs or replacement</li>
                    <li>Siding, gutter, and window repairs</li>
                    <li>Insurance claim assistance</li>
                </ul>
                <h4>Types of Storm Damage We Address:</h4>
                <ul>
                    <li>Wind damage (missing or lifted shingles, damaged flashing)</li>
                    <li>Hail damage (dents, cracks, granule loss)</li>
                    <li>Water damage (leaks, interior damage)</li>
                    <li>Debris impact damage</li>
                    <li>Lightning strikes</li>
                    <li>Snow and ice damage</li>
                </ul>
                <p>Our experienced team works directly with insurance companies to streamline the claims process, ensuring you receive the coverage you're entitled to. We document all damage thoroughly and provide detailed estimates for repairs.</p>
            `,
    },
    gutter: {
      title: "Gutter Installation",
      content: `
                <p>Properly functioning gutters are essential for protecting your home's foundation, preventing water damage, and preserving your landscaping. ELK Roofing offers professional gutter installation services to ensure effective water management for your property.</p>
                <h4>Our Gutter Services Include:</h4>
                <ul>
                    <li>Seamless gutter installation</li>
                    <li>Gutter replacement</li>
                    <li>Gutter repairs</li>
                    <li>Downspout installation and repairs</li>
                    <li>Gutter guard installation</li>
                    <li>Regular gutter cleaning and maintenance</li>
                </ul>
                <h4>Gutter Options We Offer:</h4>
                <ul>
                    <li>Aluminum gutters (seamless)</li>
                    <li>Copper gutters</li>
                    <li>Steel gutters</li>
                    <li>Vinyl gutters</li>
                    <li>Various sizes (5-inch, 6-inch, etc.)</li>
                    <li>Custom colors to match your home's exterior</li>
                </ul>
                <p>Our seamless gutters are custom-formed on-site to fit your home perfectly, eliminating leaky seams and providing a clean, attractive appearance. We also offer a variety of gutter guards to prevent clogging and reduce maintenance.</p>
            `,
    },
    solar: {
      title: "Solar Panel Installation",
      content: `
                <p>Harness the power of the sun and reduce your energy costs with ELK Roofing's professional solar panel installation services. We provide complete solar solutions for residential and commercial properties.</p>
                <h4>Benefits of Solar Panel Installation:</h4>
                <ul>
                    <li>Significant reduction in electricity bills</li>
                    <li>Increased property value</li>
                    <li>Reduced carbon footprint</li>
                    <li>Tax incentives and rebates</li>
                    <li>Energy independence</li>
                    <li>Low maintenance requirements</li>
                </ul>
                <h4>Our Solar Services Include:</h4>
                <ul>
                    <li>Comprehensive site assessment and system design</li>
                    <li>High-efficiency solar panel installation</li>
                    <li>Battery storage solutions</li>
                    <li>Inverter installation and setup</li>
                    <li>System monitoring and maintenance</li>
                    <li>Assistance with permits and incentive applications</li>
                </ul>
                <p>Our team of certified solar installers works closely with you to design a system that meets your energy needs and budget. We handle all aspects of the installation process, from initial assessment to final inspection and activation.</p>
                <p>We partner with leading solar equipment manufacturers to provide reliable, high-performance systems backed by strong warranties.</p>
            `,
    },
    window: {
      title: "Window Installation",
      content: `
                <p>Enhance your home's beauty, energy efficiency, and comfort with ELK Roofing's professional window installation services. We offer a wide selection of high-quality windows to suit any architectural style and budget.</p>
                <h4>Benefits of New Windows:</h4>
                <ul>
                    <li>Improved energy efficiency and lower utility bills</li>
                    <li>Enhanced curb appeal and home value</li>
                    <li>Better noise reduction</li>
                    <li>Increased natural light</li>
                    <li>Improved home security</li>
                    <li>Reduced maintenance requirements</li>
                </ul>
                <h4>Window Styles We Offer:</h4>
                <ul>
                    <li>Double-hung windows</li>
                    <li>Casement windows</li>
                    <li>Sliding windows</li>
                    <li>Bay and bow windows</li>
                    <li>Picture windows</li>
                    <li>Awning windows</li>
                    <li>Garden windows</li>
                    <li>Custom shapes and sizes</li>
                </ul>
                <h4>Window Materials:</h4>
                <ul>
                    <li>Vinyl</li>
                    <li>Wood</li>
                    <li>Fiberglass</li>
                    <li>Aluminum</li>
                    <li>Composite</li>
                </ul>
                <p>Our window installation process includes precise measurements, professional removal of old windows, expert installation with proper insulation and sealing, and thorough cleanup. All our window installations are backed by manufacturer warranties and our own workmanship guarantee.</p>
            `,
    },
  };

  // Function to open modal with animation
  function openModal(service) {
    if (serviceDetails[service]) {
      // Prepare modal content first
      modalTitle.textContent = serviceDetails[service].title;
      modalBody.innerHTML = serviceDetails[service].content;

      // Reset any previous animations
      modal.classList.remove("show");
      
      // Make sure modal content is scrolled to top
      const modalContent = modal.querySelector(".modal-content");
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
      
      // Pre-style list items for entrance animation
      const listItems = modalBody.querySelectorAll("li");
      listItems.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateX(20px)";
        item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      });

      // Force a reflow to ensure animations restart
      void modal.offsetWidth;

      // Store current scroll position to restore later
      const scrollY = window.scrollY;
      
      // Record body scroll position and lock scrolling
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.dataset.modalScrollY = scrollY;
      
      // Show modal with animation
      modal.style.display = "block";
      setTimeout(() => {
        modal.classList.add("show");
        
        // Animate list items sequentially
        listItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateX(0)";
          }, 300 + index * 50);
        });
      }, 10);
    }
  }

  // Function to close modal with animation
  function closeModalWithAnimation() {
    modal.classList.remove("show");

    // Wait for fade out animation to complete before hiding
    setTimeout(() => {
      modal.style.display = "none";
      
      // Restore body scroll position
      const scrollY = parseInt(document.body.dataset.modalScrollY || '0', 10);
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
    }, 300);
  }

  // Make entire service card clickable
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    // Get the service type from the read-more link inside this card
    const serviceLink = card.querySelector(".read-more");
    if (!serviceLink) return;

    const serviceType = serviceLink.getAttribute("data-service");

    // Make the entire card clickable
    card.addEventListener("click", (e) => {
      // Only open modal if we didn't click on the link itself (to avoid double triggering)
      if (!e.target.closest(".read-more")) {
        e.preventDefault();
        openModal(serviceType);
      }
    });

    // Keep the original link functionality
    serviceLink.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent the card click from also firing
      openModal(serviceType);
    });
  });

  // Handle service links in footer or elsewhere
  document.querySelectorAll("[data-service]").forEach((link) => {
    if (!link.closest(".service-card")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const serviceType = link.getAttribute("data-service");
        openModal(serviceType);
      });
    }
  });

  // Close modal buttons
  if (closeModal) {
    closeModal.addEventListener("click", closeModalWithAnimation);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener("click", closeModalWithAnimation);
  }

  // Close when clicking outside modal (improved event handling)
  modal.addEventListener("click", (e) => {
    // Only close if clicking directly on the modal background, not on modal content
    if (e.target === modal) {
      closeModalWithAnimation();
    }
  });

  // Close modal when pressing Escape key (more targeted approach)
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModalWithAnimation();
    }
  });
  
  // Ensure modal is accessible via keyboard
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  closeModal.setAttribute("aria-label", "Close modal");
}

/**
 * Contact Form Handling
 * Form validation and submission
 */
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Simple form validation
    let isValid = true;
    const formElements = contactForm.elements;

    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];

      if (element.hasAttribute("required") && !element.value.trim()) {
        isValid = false;
        element.classList.add("error");

        // Add error styling
        element.style.borderColor = "#dc3545";

        // Remove error styling on input
        element.addEventListener("input", function () {
          if (this.value.trim()) {
            this.style.borderColor = "";
            this.classList.remove("error");
          }
        });
      }
    }

    if (isValid) {
      // In a real implementation, you would send the form data to a server
      // For this example, we'll just show a success message

      // Create success message
      const successMessage = document.createElement("div");
      successMessage.className = "alert-success";
      successMessage.style.cssText =
        "background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center;";
      successMessage.innerHTML =
        "<strong>Thank you!</strong> Your message has been sent. Our team will contact you shortly.";

      // Hide the form
      const formContainer = contactForm.parentElement;
      formContainer.prepend(successMessage);
      contactForm.style.display = "none";

      // Reset the form for future use
      contactForm.reset();

      // Optional: Scroll to success message
      successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

      // Remove message after some time if desired
      setTimeout(() => {
        successMessage.style.opacity = "0";
        successMessage.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
          successMessage.remove();
          contactForm.style.display = "block";
          contactForm.style.opacity = "0";

          setTimeout(() => {
            contactForm.style.opacity = "1";
            contactForm.style.transition = "opacity 0.5s ease";
          }, 50);
        }, 500);
      }, 5000);
    }
  });
}

/**
 * Animation and scroll effects
 * Manages various animations triggered by scrolling
 */
function initAnimations() {
  // About section image border animation
  const aboutImg = document.querySelector(".about-img");

  function checkScroll() {
    if (!aboutImg) return;

    const aboutImgRect = aboutImg.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Start animation when the image is 30% visible
    const startPoint = windowHeight * 0.7;
    const endPoint = windowHeight * 0.3;

    if (aboutImgRect.top < startPoint && aboutImgRect.bottom > endPoint) {
      // Calculate progress based on scroll position
      const total = startPoint - endPoint;
      const current = startPoint - aboutImgRect.top;
      const progress = Math.min(Math.max(current / total, 0), 1);

      // Apply progress as a custom property
      aboutImg.style.setProperty("--scroll-progress", progress);

      // Add animation class
      if (progress > 0) {
        aboutImg.classList.add("animate-border");
      }
    } else if (
      aboutImgRect.bottom <= endPoint ||
      aboutImgRect.top >= startPoint
    ) {
      // Remove animation class when out of view
      aboutImg.classList.remove("animate-border");
    }
  }

  // Service image parallax/zoom effect
  const serviceCards = document.querySelectorAll(".service-card");

  function applyZoomEffectToServices() {
    serviceCards.forEach((card) => {
      const img = card.querySelector(".service-img img");
      if (!img) return;

      const cardRect = card.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if card is visible in viewport
      if (cardRect.top < windowHeight && cardRect.bottom > 0) {
        // Calculate visibility percentage
        const viewportPosition = 1 - cardRect.top / windowHeight;

        // Apply zoom based on scroll position (1.1 to 1.15)
        const zoomAmount =
          1.1 + Math.min(Math.max(viewportPosition, 0), 1) * 0.05;

        // Only apply if not being hovered
        if (!card.matches(":hover")) {
          img.style.transform = `scale(${zoomAmount})`;
        }
      }
    });
  }

  // Handle service card hover states
  serviceCards.forEach((card) => {
    const img = card.querySelector(".service-img img");
    if (!img) return;

    card.addEventListener("mouseenter", () => {
      img.style.transform = "scale(1.2)";
    });

    card.addEventListener("mouseleave", () => {
      // Reapply scroll-based zoom when leaving
      applyZoomEffectToServices();
    });
  });

  // Scroll event listener for animations
  window.addEventListener("scroll", () => {
    checkScroll();
    applyZoomEffectToServices();

    // Add more scroll-based animations here
  });

  // Initialize animations on page load
  checkScroll();
  applyZoomEffectToServices();
}

/**
 * Floating Button Functionality
 * Shows/hides the floating button based on scroll position
 */
function initFloatingButton() {
  const floatingBtn = document.querySelector(".floating-btn");
  if (!floatingBtn) return;

  const heroSection = document.querySelector(".hero");
  const contactSection = document.getElementById("contact");

  // Initially hide the button
  floatingBtn.style.display = "none";

  function updateButtonVisibility() {
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;
    const contactTop = contactSection
      ? contactSection.getBoundingClientRect().top + window.scrollY
      : 0;
    const windowBottom = window.scrollY + window.innerHeight;

    // Show button after scrolling past hero, hide when contact section is visible
    if (window.scrollY > heroHeight && windowBottom < contactTop) {
      if (floatingBtn.style.display === "none") {
        floatingBtn.style.display = "block";
        // Add entrance animation
        floatingBtn.style.opacity = "0";
        floatingBtn.style.transform = "translateY(20px)";

        setTimeout(() => {
          floatingBtn.style.transition =
            "opacity 0.3s ease, transform 0.3s ease";
          floatingBtn.style.opacity = "1";
          floatingBtn.style.transform = "translateY(0)";
        }, 10);
      }
    } else {
      if (floatingBtn.style.display === "block") {
        // Add exit animation
        floatingBtn.style.opacity = "0";
        floatingBtn.style.transform = "translateY(20px)";

        setTimeout(() => {
          floatingBtn.style.display = "none";
        }, 300);
      }
    }
  }

  // Add scroll event listener
  window.addEventListener("scroll", updateButtonVisibility);

  // Initial check
  updateButtonVisibility();
}

/**
 * Detect when elements enter viewport
 * Helper function to trigger animations when elements become visible
 * @param {HTMLElement} el - The element to observe
 * @param {Function} callback - Function to call when element enters viewport
 * @param {Number} threshold - Visibility threshold (0-1)
 */
function onElementVisible(el, callback, threshold = 0.2) {
  if (!el) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(el);
          observer.unobserve(el);
        }
      });
    },
    { threshold }
  );

  observer.observe(el);
}

/**
 * Gallery Functionality
 * Handles gallery filtering, lightbox, and load more functionality
 */
function initGallery() {
  const gallerySection = document.querySelector('.gallery');
  if (!gallerySection) return;

  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxCategory = document.querySelector('.lightbox-category');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentFilter = 'all';
  let currentLightboxIndex = 0;
  let visibleImages = [];

  // Gallery filtering
  function filterGallery(filter) {
    currentFilter = filter;
    
    // Update filter buttons
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-filter') === filter) {
        btn.classList.add('active');
      }
    });

    // Filter gallery items with animation
    galleryItems.forEach((item, index) => {
      const category = item.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        // Show item with staggered animation
        item.classList.remove('hidden');
        setTimeout(() => {
          item.style.display = 'block';
          item.classList.add('show');
        }, index * 50);
      } else {
        // Hide item immediately
        item.classList.add('hidden');
        setTimeout(() => {
          if (item.classList.contains('hidden')) {
            item.style.display = 'none';
          }
        }, 300);
      }
    });

    // Update visible images array for lightbox after a delay to ensure DOM is updated
    setTimeout(() => {
      updateVisibleImages();
    }, 100);
  }

  // Update visible images based on current filter
  function updateVisibleImages() {
    visibleImages = [];
    galleryItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const shouldInclude = currentFilter === 'all' || category === currentFilter;
      
      // Check both the filter logic and that the item is actually visible
      if (shouldInclude && !item.classList.contains('hidden')) {
        const img = item.querySelector('img');
        const titleElement = item.querySelector('.gallery-info h3');
        const categoryElement = item.querySelector('.gallery-info p');
        
        // Safety checks to ensure elements exist
        if (img && titleElement && categoryElement) {
          visibleImages.push({
            src: img.src,
            alt: img.alt,
            title: titleElement.textContent,
            category: categoryElement.textContent,
            element: item // Store reference to the DOM element
          });
        }
      }
    });
    
    console.log('Updated visible images for filter:', currentFilter, 'Count:', visibleImages.length);
  }

  // Lightbox functionality
  function openLightbox(index) {
    if (!visibleImages[index]) return;
    
    currentLightboxIndex = index;
    const image = visibleImages[index];
    
    // Set image and info
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = image.title;
    lightboxCategory.textContent = image.category;
    
    // Show lightbox
    lightboxModal.classList.add('show');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Update navigation buttons
    updateLightboxNavigation();
  }

  function closeLightbox() {
    lightboxModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  function updateLightboxNavigation() {
    // Show/hide navigation based on available images
    if (lightboxPrev) {
      lightboxPrev.style.display = visibleImages.length > 1 ? 'block' : 'none';
    }
    if (lightboxNext) {
      lightboxNext.style.display = visibleImages.length > 1 ? 'block' : 'none';
    }
  }

  function showPreviousImage() {
    currentLightboxIndex = currentLightboxIndex > 0 ? 
      currentLightboxIndex - 1 : 
      visibleImages.length - 1;
    openLightbox(currentLightboxIndex);
  }

  function showNextImage() {
    currentLightboxIndex = currentLightboxIndex < visibleImages.length - 1 ? 
      currentLightboxIndex + 1 : 
      0;
    openLightbox(currentLightboxIndex);
  }

  // Event listeners for filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterGallery(filter);
    });
  });

  // Event listeners for gallery items
  galleryItems.forEach((item, index) => {
    const viewBtn = item.querySelector('.gallery-view-btn');
    const galleryImage = item.querySelector('.gallery-image');
    
    // Click handlers for both the view button and image
    const openHandler = (e) => {
      e.preventDefault();
      
      // Find the index of this item in the visible images array by matching the element
      const lightboxIndex = visibleImages.findIndex(visibleImage => visibleImage.element === item);
      
      console.log('Click handler - Item category:', item.getAttribute('data-category'), 'Current filter:', currentFilter, 'Found index:', lightboxIndex);
      
      if (lightboxIndex !== -1) {
        openLightbox(lightboxIndex);
      } else {
        // Fallback: update visible images and try again
        updateVisibleImages();
        const retryIndex = visibleImages.findIndex(visibleImage => visibleImage.element === item);
        if (retryIndex !== -1) {
          openLightbox(retryIndex);
        }
      }
    };
    
    if (viewBtn) {
      viewBtn.addEventListener('click', openHandler);
    }
    if (galleryImage) {
      galleryImage.addEventListener('click', openHandler);
    }
  });

  // Lightbox event listeners
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPreviousImage);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', showNextImage);
  }

  // Close lightbox when clicking outside image
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('show')) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPreviousImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });

  // Touch gestures for lightbox (mobile)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isSwipeGesture = false;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      if (!lightboxModal.classList.contains('show')) return;
      
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      isSwipeGesture = false;
    }, { passive: true });

    lightboxModal.addEventListener('touchmove', (e) => {
      if (!lightboxModal.classList.contains('show')) return;
      
      // Prevent default scrolling during swipe
      if (Math.abs(touchStartX - e.changedTouches[0].screenX) > 10) {
        e.preventDefault();
        isSwipeGesture = true;
      }
    }, { passive: false });

    lightboxModal.addEventListener('touchend', (e) => {
      if (!lightboxModal.classList.contains('show') || !isSwipeGesture) return;
      
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Only handle horizontal swipes (ignore vertical)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe right - previous image
          showPreviousImage();
        } else {
          // Swipe left - next image
          showNextImage();
        }
      }
    }, { passive: true });
  }

  // Initialize gallery
  updateVisibleImages();
  
  // Add entrance animations for gallery items
  galleryItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    // Use intersection observer for scroll-triggered animations
    onElementVisible(item, () => {
      setTimeout(() => {
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    }, 0.1);
  });
}
