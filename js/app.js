// Hamburger Menu Functionality
class HamburgerMenu {
  constructor () {
    this.overlay = document.getElementById('hamburgerOverlay')
    this.menu = document.getElementById('hamburgerMenu')
    this.openBtn = document.getElementById('hamburgerOpen')
    this.closeBtn = document.getElementById('hamburgerClose')
    this.isOpen = false
    this.defaultLang = "O'zbekcha"
    this.languages = ["O'zbekcha", 'Русский', 'English']
    this.currentLang = this.defaultLang

    this.init()
  }

  init () {
    // Event listeners for menu open/close
    this.openBtn.addEventListener('click', () => this.open())
    this.closeBtn.addEventListener('click', () => this.close())
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) {
        this.close()
      }
    })

    const navLinks = document.querySelectorAll('.hamburger__nav-link')
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.close()
      })
    })

    const joinBtn = document.querySelector('.hamburger__join-btn')
    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        this.close()
      })
    }

    // Keyboard support
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close()
      }
    })

    // Initialize language dropdowns
    this.initLanguageDropdown()
  }

  open () {
    this.isOpen = true
    this.overlay.classList.add('active')
    this.menu.classList.add('active')
    document.body.style.overflow = 'hidden'
    this.closeBtn.focus()
  }

  close () {
    this.isOpen = false
    this.overlay.classList.remove('active')
    this.menu.classList.remove('active')
    document.body.style.overflow = ''
    this.openBtn.focus()
  }

  initLanguageDropdown () {
    const dropdowns = [
      {
        btn: document.querySelector('.header__lang-btn'),
        menu: document.querySelector('.header__lang-menu'),
        text: document.querySelector('.header__lang-text')
      },
      {
        btn: document.querySelector('.hamburger__lang-btn'),
        menu: document.querySelector('.hamburger__lang-menu'),
        text: document.querySelector('.hamburger__lang-btn span')
      }
    ]

    // Set initial language text
    dropdowns.forEach(({ text }) => {
      if (text) {
        text.textContent = this.currentLang
      }
    })

    dropdowns.forEach(({ btn, menu, text }) => {
      if (btn && menu && text) {
        // Toggle dropdown on button click
        btn.addEventListener('click', e => {
          e.stopPropagation()
          // Close other dropdowns
          dropdowns.forEach(({ menu: otherMenu }) => {
            if (otherMenu && otherMenu !== menu) {
              otherMenu.classList.remove('active')
            }
          })
          menu.classList.toggle('active')
        })

        // Close dropdown when clicking outside
        document.addEventListener('click', e => {
          if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active')
          }
        })

        // Update dropdown menu items based on current language
        this.updateDropdownMenu(menu)
      }
    })

    // Handle language selection
    dropdowns.forEach(({ menu, text }) => {
      if (menu && text) {
        menu.addEventListener('click', e => {
          const item = e.target.closest(
            '.header__lang-item, .hamburger__lang-item'
          )
          if (item) {
            this.currentLang = item.textContent
            // Update text in both dropdowns
            dropdowns.forEach(({ text: otherText }) => {
              if (otherText) {
                otherText.textContent = this.currentLang
              }
            })
            // Update both menus
            dropdowns.forEach(({ menu: otherMenu }) => {
              if (otherMenu) {
                this.updateDropdownMenu(otherMenu)
              }
            })
            menu.classList.remove('active')
          }
        })
      }
    })
  }

  updateDropdownMenu (menu) {
    if (!menu) return
    // Clear current menu items
    menu.innerHTML = ''
    // Add all languages except the current one
    this.languages.forEach(lang => {
      if (lang !== this.currentLang) {
        const li = document.createElement('li')
        li.classList.add(
          menu.classList.contains('header__lang-menu')
            ? 'header__lang-item'
            : 'hamburger__lang-item'
        )
        li.textContent = lang
        menu.appendChild(li)
      }
    })
  }
}

// Initialize hamburger menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HamburgerMenu()
})

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
})
document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".faq__question-toggle")

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const question = toggle.closest(".faq__question")
      const isActive = question.classList.contains("faq__question--active")

      // Boshqa ochilganlarni yopamiz
      document.querySelectorAll(".faq__question").forEach((item) => {
        item.classList.remove("faq__question--active")
      })

      // Bosilgan elementni toggleshlaymiz (agar ochilmagan bo‘lsa ochiladi)
      if (!isActive) {
        question.classList.add("faq__question--active")
      }
    })
  })
})


var swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  loop: true,
  effect: "fade",
  autoplay: {
    delay: 1800,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
const accordions = document.querySelectorAll(".list__box");

accordions.forEach(box => {
  const header = box.querySelector(".accordion-header");
  const content = box.querySelector(".accordion-content");
  const arrow = box.querySelector(".arrow-icon");

  header.addEventListener("click", () => {
    const isOpen = box.classList.contains("open");

    accordions.forEach(b => {
      b.classList.remove("open");
      b.querySelector(".accordion-content").style.display = "none";
      b.querySelector(".arrow-icon").classList.remove("rotate");
      b.querySelector(".accordion-header").classList.remove("active");
    });

    if (!isOpen) {
      box.classList.add("open");
      content.style.display = "block";
      arrow.classList.add("rotate");
      header.classList.add("active");
    }
  });
});
