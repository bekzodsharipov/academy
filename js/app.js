// =========================
// 1. HAMBURGER MENU
// =========================

class HamburgerMenu {
  constructor () {
    this.overlay = document.getElementById('hamburgerOverlay')
    this.menu = document.getElementById('hamburgerMenu')
    this.openBtn = document.getElementById('hamburgerOpen')
    this.closeBtn = document.getElementById('hamburgerClose')
    this.isOpen = false

    this.init()
  }

  init () {
    // Agar htmlda elementlari bo‘lmasa – umuman ishga tushmaydi, xato ham bermaydi
    if (!this.overlay || !this.menu || !this.openBtn || !this.closeBtn) {
      return
    }

    this.openBtn.addEventListener('click', () => this.open())
    this.closeBtn.addEventListener('click', () => this.close())

    // Overlayga bosilganda yopish
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) {
        this.close()
      }
    })

    // Menyudagi link bosilganda yopish
    const navLinks = this.menu.querySelectorAll('.hamburger__nav-link')
    navLinks.forEach(link => {
      link.addEventListener('click', () => this.close())
    })

    // Agar "join" tugma bo‘lsa
    const joinBtn = this.menu.querySelector('.hamburger__join-btn')
    if (joinBtn) {
      joinBtn.addEventListener('click', () => this.close())
    }

    // ESC bilan yopish
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close()
      }
    })
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
}

// =========================
// 2. LANGUAGE SWITCHER
// =========================

// 2. LANGUAGE SWITCHER (always default UZ except /ru/)
class LanguageSwitcher {
  constructor () {
    this.languages = [
      { code: 'uz', label: "O'zbekcha" },
      { code: 'ru', label: 'Русский' }
    ]

    this.currentLang = this.detectCurrentLang()
    this.dropdowns = []

    this.init()
  }

  // ❗ Faqat URL bo‘yicha aniqlaymiz – localStorage yo‘q
  detectCurrentLang () {
    const path = window.location.pathname

    // /ru/ bo‘lsa – ruscha
    if (path.includes('/ru/')) return 'ru'

    // Aks holda har doim uzbekcha
    return 'uz'
  }

  getLabel (code) {
    const lang = this.languages.find(l => l.code === code)
    return lang ? lang.label : code
  }

  getPageId () {
    const page = document.body.dataset.page
    return page && page.trim() ? page.trim() : 'index'
  }

  buildUrl (lang) {
    const page = this.getPageId()
    const search = window.location.search || ''
    const hash = window.location.hash || ''

    if (lang === 'ru') {
      // Ruscha: /ru/page.html
      return `/ru/${page}.html${search}${hash}`
    } else {
      // O‘zbekcha: /page.html
      return `/${page}.html${search}${hash}`
    }
  }

  init () {
    const desktopBtn = document.querySelector('.header__lang-btn')
    const desktopText = document.querySelector('.header__lang-text')
    const desktopMenu = document.querySelector('.header__lang-menu')

    const mobileBtn = document.querySelector('.hamburger__lang-btn')
    const mobileText = mobileBtn ? mobileBtn.querySelector('span') : null
    const mobileMenu = document.querySelector('.hamburger__lang-menu')

    this.dropdowns = [
      { btn: desktopBtn, text: desktopText, menu: desktopMenu },
      { btn: mobileBtn, text: mobileText, menu: mobileMenu }
    ].filter(d => d.btn && d.menu && d.text)

    if (!this.dropdowns.length) return

    this.dropdowns.forEach(d => {
      d.text.textContent = this.getLabel(this.currentLang)
      this.renderMenu(d.menu)
      this.attachEvents(d)
    })

    document.addEventListener('click', () => {
      this.dropdowns.forEach(d => d.menu.classList.remove('active'))
    })
  }

  renderMenu (menu) {
    if (!menu) return
    menu.innerHTML = ''

    this.languages.forEach(lang => {
      if (lang.code === this.currentLang) return

      const li = document.createElement('li')
      li.dataset.lang = lang.code
      li.textContent = lang.label

      li.className = menu.classList.contains('header__lang-menu')
        ? 'header__lang-item'
        : 'hamburger__lang-item'

      menu.appendChild(li)
    })
  }

  attachEvents ({ btn, menu }) {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      this.dropdowns.forEach(d => {
        if (d.menu !== menu) d.menu.classList.remove('active')
      })
      menu.classList.toggle('active')
    })

    menu.addEventListener('click', e => {
      const item = e.target.closest('li[data-lang]')
      if (!item) return
      const lang = item.dataset.lang
      this.switchLanguage(lang)
    })
  }

  switchLanguage (lang) {
    if (lang === this.currentLang) return

    this.currentLang = lang

    this.dropdowns.forEach(d => {
      d.text.textContent = this.getLabel(this.currentLang)
      this.renderMenu(d.menu)
    })

    const url = this.buildUrl(lang)
    window.location.href = url
  }
}


// =========================
// 3. SMOOTH SCROLL
// =========================

function initSmoothScroll () {
  const links = document.querySelectorAll('a[href^="#"]')
  if (!links.length) return

  links.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href')
      if (!href || href === '#') return

      const target = document.querySelector(href)
      if (!target) return

      e.preventDefault()
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  })
}

// =========================
// 4. FAQ ACCORDION
// =========================

function initFaqAccordion () {
  const toggles = document.querySelectorAll('.faq__question-toggle')
  if (!toggles.length) return

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const question = toggle.closest('.faq__question')
      if (!question) return

      const isActive = question.classList.contains('faq__question--active')

      document.querySelectorAll('.faq__question').forEach(item => {
        item.classList.remove('faq__question--active')
      })

      if (!isActive) {
        question.classList.add('faq__question--active')
      }
    })
  })
}

// =========================
// 5. .list__box ACCORDION
// =========================

function initListAccordions () {
  const accordions = document.querySelectorAll('.list__box')
  if (!accordions.length) return

  accordions.forEach(box => {
    const header = box.querySelector('.accordion-header')
    const content = box.querySelector('.accordion-content')
    const arrow = box.querySelector('.arrow-icon')

    if (!header || !content || !arrow) return

    content.style.display = 'none'

    header.addEventListener('click', () => {
      const isOpen = box.classList.contains('open')

      accordions.forEach(b => {
        b.classList.remove('open')
        const c = b.querySelector('.accordion-content')
        const a = b.querySelector('.arrow-icon')
        const h = b.querySelector('.accordion-header')
        if (c) c.style.display = 'none'
        if (a) a.classList.remove('rotate')
        if (h) h.classList.remove('active')
      })

      if (!isOpen) {
        box.classList.add('open')
        content.style.display = 'block'
        arrow.classList.add('rotate')
        header.classList.add('active')
      }
    })
  })
}

// =========================
// 6. NEWS FILTER
// =========================
function initNewsFilter () {
  const filter = document.querySelector('.news-filter')
  if (!filter) return

  const head = filter.querySelector('.news-filter__head')
  const body = filter.querySelector('.news-filter__body')
  const items = filter.querySelectorAll('.news-filter__item')
  if (!head || !body || !items.length) return

  filter.style.position = 'relative'
  filter.style.overflow = 'visible' 

  body.style.position = 'absolute'
  body.style.top = '100%'
  body.style.left = '0'
  body.style.right = '0'

  filter.classList.remove('is-open')
  head.classList.remove('open')

  head.addEventListener('click', () => {
    const isOpen = filter.classList.toggle('is-open')
    head.classList.toggle('open', isOpen)
  })

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('news-filter__item--active'))
      item.classList.add('news-filter__item--active')

      const span = head.querySelector('span')
      if (span) {
        span.textContent = item.textContent.trim()
      }

      filter.classList.remove('is-open')
      head.classList.remove('open')
    })
  })
}


// =========================
// 7. SWIPER INIT
// =========================

function initSwiper () {
  if (typeof Swiper === 'undefined') return

  const swiperEl = document.querySelector('.mySwiper')
  if (!swiperEl) return

  new Swiper('.mySwiper', {
    spaceBetween: 30,
    loop: true,
    effect: 'fade',
    autoplay: {
      delay: 1800,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  })
}

// =========================
// 8. GLOBAL INIT
// =========================

document.addEventListener('DOMContentLoaded', () => {
  new HamburgerMenu()
  new LanguageSwitcher()
  initSmoothScroll()
  initFaqAccordion()
  initListAccordions()
  initNewsFilter()
  initSwiper()
})
