const openModalButtons = document.querySelectorAll('.open__modal')
const modalOverlay = document.querySelector('.modal__overlay')
const modalSign = document.querySelector('.modal__sign')
const closeModalButton = document.querySelector('.modal__close')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    modalOverlay.style.display = 'block'
    modalSign.style.display = 'grid'
    document.body.style.height = '100vh'
    document.body.style.overflowX = 'hidden'
  })
})

closeModalButton.addEventListener('click', () => {
  modalOverlay.style.display = 'none'
  modalSign.style.display = 'none'
  document.body.style.height = ''
  document.body.style.overflowX = ''
})

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none'
    modalSign.style.display = 'none'
    document.body.style.height = ''
    document.body.style.overflowX = ''
  }
})
const SHEETS_URL2 =
  'https://script.google.com/macros/s/AKfycby8z1Kd3QxMedVF2vrBqZdpapSPWX8Ijjepa03davNAtETG6ANiOqSYEekdLd7c-CjxnQ/exec'

document.getElementById('modal__tel').addEventListener('focus', e => {
  if (!e.target.value) {
    e.target.value = '+998 '
  }
})

document.getElementById('modal__tel').addEventListener('input', e => {
  let value = e.target.value

  // Agar +998 yo'q bo'lsa, qo'shish
  if (!value.startsWith('+998')) {
    value = '+998 ' + value.replace(/^\+?998\s?/, '')
  }

  // Faqat raqamlarni olish (+998 dan keyin)
  const numbers = value.substring(5).replace(/\D/g, '')

  // Format: +998 (XX) XXX-XX-XX
  if (numbers.length > 0) {
    if (numbers.length <= 2) {
      value = `+998 (${numbers}`
    } else if (numbers.length <= 5) {
      value = `+998 (${numbers.substring(0, 2)}) ${numbers.substring(2)}`
    } else if (numbers.length <= 7) {
      value = `+998 (${numbers.substring(0, 2)}) ${numbers.substring(
        2,
        5
      )}-${numbers.substring(5)}`
    } else {
      value = `+998 (${numbers.substring(0, 2)}) ${numbers.substring(
        2,
        5
      )}-${numbers.substring(5, 7)}-${numbers.substring(7, 9)}`
    }
  } else {
    value = '+998 '
  }

  e.target.value = value
})

document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault()

  const submitBtn = document.getElementById('submitBtnAriza')
  const btnText = document.getElementById('btnText')
  const spinner = document.getElementById('spinner')
  const nameInput = document.getElementById('modal__name')
  const phoneInput = document.getElementById('modal__tel')
  const form = document.getElementById('contactForm')
  const successMessage = document.getElementById('successMessage')

  submitBtn.disabled = true
  spinner.classList.remove('hidden')
  btnText.textContent = 'Yuborilmoqda...'

  // Hozirgi vaqtni olish
  const currentTime = new Date().toLocaleString('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  // Ma'lumotlarni tayyorlash
  const formData = new FormData()
  formData.append('Ism', nameInput.value)
  formData.append('Telefon raqam', phoneInput.value)
  formData.append("Royhatdan o'tgan vaqti", currentTime)

  try {
    const response = await fetch(SHEETS_URL2, {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      form.classList.add('hidden')
      successMessage.classList.remove('hidden')
    } else {
      throw new Error('Yuborishda xatolik yuz berdi')
    }
  } catch (error) {
    console.error('Xatolik:', error)
    spinner.classList.add('hidden')
    btnText.textContent = 'Xatolik!'

    // 2 soniyadan keyin tugmani qaytarish
    setTimeout(() => {
      submitBtn.disabled = false
      btnText.textContent = "Ro'yxatdan o'tish"
    }, 2000)

    alert("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.")
  }
})
