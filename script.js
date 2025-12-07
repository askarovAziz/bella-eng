// ===== ULTRA MODERN BELLACURES SCRIPTS =====

document.addEventListener("DOMContentLoaded", () => {
  // ===== Language Content =====
  const LANGUAGE_STORAGE_KEY = "bellacures_lang"
  const translatableElements = document.querySelectorAll("[data-i18n]")
  const nav = document.querySelector(".nav")
  const navBurger = document.querySelector(".nav-burger")
  const mobileMenu = document.querySelector(".mobile-menu")
  const mobileLinks = document.querySelectorAll(".mobile-link, .mobile-cta")

  function getCurrentLanguage() {
    return document.documentElement.lang || localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en"
  }

  function setLanguage(lang = "en") {
    const dict = window.translations?.[lang] || window.translations?.en || {}
    document.documentElement.lang = lang
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)

    translatableElements.forEach((el) => {
      const key = el.dataset.i18n
      if (dict[key]) {
        el.innerHTML = dict[key]
        if (el.dataset.text !== undefined) {
          el.setAttribute("data-text", dict[key])
        }
      }
    })

    updateBurgerAccessibility(navBurger?.classList.contains("active"), lang)
  }

  function updateBurgerAccessibility(isOpen = false, lang = getCurrentLanguage()) {
    if (!navBurger) return

    const dict = window.translations?.[lang] || window.translations?.en || {}
    const openLabel = dict["nav.menuOpen"] || "Open menu"
    const closeLabel = dict["nav.menuClose"] || "Close menu"
    const label = isOpen ? closeLabel : openLabel

    navBurger.setAttribute("aria-label", label)
    navBurger.setAttribute("aria-expanded", String(Boolean(isOpen)))

    const srText = navBurger.querySelector(".visually-hidden")
    if (srText) {
      srText.textContent = label
    }
  }

  setLanguage("en")

// ===== Loader =====
  const loader = document.querySelector(".loader")
  const body = document.body

  body.classList.add("loading")

  const hideLoader = () => {
    if (!loader || loader.classList.contains("hidden")) return
    loader.classList.add("hidden")
    body.classList.remove("loading")
    requestAnimationFrame(initAnimations)
  }

  if (document.readyState === "complete") {
    hideLoader()
  } else {
    window.addEventListener("load", hideLoader, { once: true })
    // Fallback so the loader never blocks first paint on slow connections
    setTimeout(hideLoader, 1500)
  }

  // ===== Custom Cursor =====
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")

  if (cursor && cursorFollower && window.innerWidth > 768) {
    let mouseX = 0,
      mouseY = 0
    let cursorX = 0,
      cursorY = 0
    let followerX = 0,
      followerY = 0

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    })

    // Smooth cursor animation
    function animateCursor() {
      // Cursor follows mouse directly
      cursorX += (mouseX - cursorX) * 0.2
      cursorY += (mouseY - cursorY) * 0.2
      cursor.style.left = cursorX - 6 + "px"
      cursor.style.top = cursorY - 6 + "px"

      // Follower has more delay
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1
      cursorFollower.style.left = followerX - 20 + "px"
      cursorFollower.style.top = followerY - 20 + "px"

      requestAnimationFrame(animateCursor)
    }
    animateCursor()

    // Hover effects for interactive elements
    const hoverElements = document.querySelectorAll("a, button, .service-card, .portfolio-item, .floating-card")
    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursorFollower.classList.add("hovering")
      })
      el.addEventListener("mouseleave", () => {
        cursorFollower.classList.remove("hovering")
      })
    })
  }

  // ===== Navigation =====
  // Scroll effect
  let lastScroll = 0
  window.addEventListener("scroll", () => {
    if (!nav) return

    const currentScroll = window.pageYOffset

    if (currentScroll > 100) {
      nav.classList.add("scrolled")
    } else {
      nav.classList.remove("scrolled")
    }

    lastScroll = currentScroll
  })

  // Mobile menu toggle
  if (navBurger) {
    navBurger.addEventListener("click", () => {
      const isOpen = navBurger.classList.toggle("active")
      mobileMenu.classList.toggle("active")
      body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : ""
      updateBurgerAccessibility(isOpen, document.documentElement.lang)
    })
  }

  // Close mobile menu on link click
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navBurger) {
        navBurger.classList.remove("active")
        updateBurgerAccessibility(false, document.documentElement.lang)
      }
      mobileMenu.classList.remove("active")
      body.style.overflow = ""
    })
  })

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const headerOffset = 100
        const elementPosition = target.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // ===== Stats Counter Animation =====
  function animateCounter(el, target) {
    let current = 0
    const increment = target / 100
    const duration = 2000
    const stepTime = duration / 100

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      el.textContent = Math.floor(current).toLocaleString() + (target > 100 ? "+" : "")
    }, stepTime)
  }

  // Observe stats section
  const stats = document.querySelectorAll(".stat")
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numberEl = entry.target.querySelector(".stat-number")
          const target = Number.parseInt(entry.target.dataset.value)
          animateCounter(numberEl, target)
          statsObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  stats.forEach((stat) => statsObserver.observe(stat))

  // ===== Portfolio Tabs =====
  const tabBtns = document.querySelectorAll(".tab-btn")
  const portfolioItems = document.querySelectorAll(".portfolio-item")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active tab
      tabBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const tab = btn.dataset.tab

      // Filter portfolio items
      portfolioItems.forEach((item) => {
        const category = item.dataset.category

        if (tab === "all" || category === tab) {
          item.style.display = "block"
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, 50)
        } else {
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // ===== Form Submission =====
  const bookingForm = document.getElementById("bookingForm")
  const timeSelect = document.getElementById("time")

  function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  }

  function populateTimeOptions(selectEl) {
    if (!selectEl) return

    const startMinutes = 12 * 60
    const endMinutes = 21 * 60

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 15) {
      const startLabel = formatTime(minutes)
      const endLabel = formatTime(Math.min(minutes + 15, endMinutes))
      const option = document.createElement("option")
      option.value = `${startLabel}-${endLabel}`
      option.textContent = `${startLabel} - ${endLabel}`
      selectEl.appendChild(option)
    }
  }

  populateTimeOptions(timeSelect)

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(bookingForm)
      const data = Object.fromEntries(formData)

      const currentLang = getCurrentLanguage()
      const dict = window.translations?.[currentLang] || window.translations?.ru || {}
      const labels = {
        header: dict["form.whatsapp.header"] || "🌸 New request from the Bellacures website!\n\n",
        name: dict["form.whatsapp.nameLabel"] || "👤 Name",
        phone: dict["form.whatsapp.phoneLabel"] || "📱 Phone",
        service: dict["form.whatsapp.serviceLabel"] || "💅 Service",
        date: dict["form.whatsapp.dateLabel"] || "📅 Date",
        time: dict["form.whatsapp.timeLabel"] || "⏰ Time",
        comment: dict["form.whatsapp.commentLabel"] || "💬 Comment",
      }
      const defaultComment = dict["form.whatsapp.defaultMessage"] || "Not provided"

      const userComment = data.message?.trim() ? data.message : defaultComment
      const userTime = data.time?.trim() ? data.time : defaultComment

      // Create WhatsApp message
      const serviceKey = data.service
      const serviceText = (serviceKey && dict[serviceKey]) || data.service

      const message =
        `${labels.header}` +
        `${labels.name}: ${data.name}\n` +
        `${labels.phone}: ${data.phone}\n` +
        `${labels.service}: ${serviceText}\n` +
        `${labels.date}: ${data.date}\n` +
        `${labels.time}: ${userTime}\n` +
        `${labels.comment}: ${userComment}`

      // Redirect to WhatsApp
      window.open(`https://wa.me/971507724752?text=${encodeURIComponent(message)}`, "_blank")

      // Reset form with animation
      bookingForm.reset()

      // Show success feedback
      const submitBtn = bookingForm.querySelector(".submit-btn")
      const originalText = submitBtn.innerHTML
      const successText = dict["form.whatsapp.success"] || "Sent!"
      submitBtn.innerHTML = `<span>${successText}</span> ✓`
      submitBtn.style.background = "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"

      setTimeout(() => {
        submitBtn.innerHTML = originalText
        submitBtn.style.background = ""
      }, 3000)
    })
  }

  // ===== Scroll Animations =====
  function initAnimations() {
    const animatedElements = document.querySelectorAll(
      ".service-card, .feature-item, .portfolio-item, .testimonial-card, " +
        ".process-step, .about-img-wrapper, .contact-item, .section-header",
    )

    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-in")
            }, index * 100)
            animationObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    animatedElements.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(40px)"
      el.style.transition = "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
      animationObserver.observe(el)
    })
  }

  // Add animate-in class styles
  const style = document.createElement("style")
  style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `
  document.head.appendChild(style)

  // ===== Parallax Effect for Hero =====
  const heroContent = document.querySelector(".hero-content")
  const hero3d = document.querySelector(".hero-3d")
  const heroSection = document.querySelector(".hero")
  const spheres = document.querySelectorAll(".gradient-sphere")

  if (window.innerWidth > 1024 && heroSection) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const heroHeight = heroSection.offsetHeight

      if (scrolled < heroHeight) {
        if (heroContent) {
          heroContent.style.transform = `translateY(${scrolled * 0.3}px)`
          heroContent.style.opacity = 1 - scrolled / heroHeight
        }

        if (hero3d) {
          hero3d.style.transform = `translateY(calc(-50% + ${scrolled * 0.2}px))`
        }

        spheres.forEach((sphere, i) => {
          const speed = 0.1 + i * 0.05
          sphere.style.transform = `translate(${scrolled * speed}px, ${scrolled * speed}px)`
        })
      }
    })
  }

  // ===== 3D Card Tilt Effect =====
  const floatingCards = document.querySelectorAll(".floating-card")

  floatingCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = ""
    })
  })

  // ===== Magnetic Button Effect =====
  const magneticBtns = document.querySelectorAll(".btn-primary, .btn-cta, .nav-cta")

  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
    })

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = ""
    })
  })

  // ===== Testimonials Auto-scroll Pause on Hover =====
  const testimonialTrack = document.querySelector(".testimonial-track")

  if (testimonialTrack) {
    testimonialTrack.addEventListener("mouseenter", () => {
      testimonialTrack.style.animationPlayState = "paused"
    })

    testimonialTrack.addEventListener("mouseleave", () => {
      testimonialTrack.style.animationPlayState = "running"
    })
  }

  // ===== Text Scramble Effect for Hero Title =====
  class TextScramble {
    constructor(el) {
      this.el = el
      this.chars = "!<>-_\\/[]{}—=+*^?#________"
      this.update = this.update.bind(this)
    }

    setText(newText) {
      const oldText = this.el.innerText
      const length = Math.max(oldText.length, newText.length)
      const promise = new Promise((resolve) => (this.resolve = resolve))
      this.queue = []

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || ""
        const to = newText[i] || ""
        const start = Math.floor(Math.random() * 40)
        const end = start + Math.floor(Math.random() * 40)
        this.queue.push({ from, to, start, end })
      }

      cancelAnimationFrame(this.frameRequest)
      this.frame = 0
      this.update()
      return promise
    }

    update() {
      let output = ""
      let complete = 0

      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i]

        if (this.frame >= end) {
          complete++
          output += to
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.chars[Math.floor(Math.random() * this.chars.length)]
            this.queue[i].char = char
          }
          output += `<span class="scramble">${char}</span>`
        } else {
          output += from
        }
      }

      this.el.innerHTML = output

      if (complete === this.queue.length) {
        this.resolve()
      } else {
        this.frameRequest = requestAnimationFrame(this.update)
        this.frame++
      }
    }
  }

  // ===== Ripple Effect for Buttons =====
  document.querySelectorAll(".btn-primary, .submit-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement("span")
      ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `

      this.style.position = "relative"
      this.style.overflow = "hidden"
      this.appendChild(ripple)

      setTimeout(() => ripple.remove(), 600)
    })
  })

  // Add ripple animation
  const rippleStyle = document.createElement("style")
  rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .scramble {
            color: var(--accent-primary);
        }
    `
  document.head.appendChild(rippleStyle)

  // ===== Lazy load Google Map on user intent =====
  const mapPlaceholder = document.querySelector(".map-placeholder")

  function loadMap() {
    if (!mapPlaceholder || mapPlaceholder.dataset.loaded) return

    const mapSrc = mapPlaceholder.dataset.mapSrc
    if (!mapSrc) return

    mapPlaceholder.classList.add("is-loading")

    const iframe = document.createElement("iframe")
    iframe.src = mapSrc
    iframe.loading = "lazy"
    iframe.title = mapPlaceholder.dataset.mapTitle || "Bellacures map"
    iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade")
    iframe.allowFullscreen = true

    iframe.addEventListener("load", () => {
      mapPlaceholder.classList.remove("is-loading")
    })

    mapPlaceholder.innerHTML = ""
    mapPlaceholder.appendChild(iframe)
    mapPlaceholder.dataset.loaded = "true"
  }

  if (mapPlaceholder) {
    const triggerButton = mapPlaceholder.querySelector(".map-load-btn")
    triggerButton?.addEventListener("click", loadMap)

    if ("IntersectionObserver" in window) {
      const mapObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMap()
            observer.disconnect()
          }
        })
      }, { rootMargin: "200px" })

      mapObserver.observe(mapPlaceholder)
    }
  }

  // ===== Lazy Loading Images =====
  const lazyImages = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  lazyImages.forEach((img) => imageObserver.observe(img))

  // ===== Set minimum date for booking =====
  const dateInput = document.getElementById("date")
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0]
    dateInput.setAttribute("min", today)
  }

  // ===== Service Cards Stagger Animation =====
  const serviceCards = document.querySelectorAll(".service-card")
  serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`
  })

  // ===== Reveal on scroll for sections =====
  const sections = document.querySelectorAll("section")

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible")
        }
      })
    },
    { threshold: 0.1 },
  )

  sections.forEach((section) => {
    section.classList.add("section-hidden")
    sectionObserver.observe(section)
  })

  // Add section animation styles
  const sectionStyle = document.createElement("style")
  sectionStyle.textContent = `
        .section-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .section-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `
  document.head.appendChild(sectionStyle)

  // ===== Mouse Trail Effect (subtle) =====
  if (window.innerWidth > 1024) {
    const trail = []
    const trailLength = 10

    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement("div")
      dot.className = "mouse-trail"
      dot.style.cssText = `
                position: fixed;
                width: ${4 - i * 0.3}px;
                height: ${4 - i * 0.3}px;
                background: var(--accent-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${0.5 - i * 0.05};
                transition: transform 0.1s ease;
            `
      document.body.appendChild(dot)
      trail.push({ el: dot, x: 0, y: 0 })
    }

    let trailX = 0,
      trailY = 0

    document.addEventListener("mousemove", (e) => {
      trailX = e.clientX
      trailY = e.clientY
    })

    function animateTrail() {
      let x = trailX
      let y = trailY

      trail.forEach((dot, index) => {
        const nextDot = trail[index + 1] || trail[0]

        dot.x = x
        dot.y = y

        dot.el.style.left = dot.x + "px"
        dot.el.style.top = dot.y + "px"

        x += (nextDot.x - dot.x) * 0.3
        y += (nextDot.y - dot.y) * 0.3
      })

      requestAnimationFrame(animateTrail)
    }

    animateTrail()
  }
})
