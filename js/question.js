const SHEETS_URL3 =
  "https://script.google.com/macros/s/AKfycbz0DJNWggaBv-0kvyBiVgbhkJiW8yNoAXQPlZO636HLG1GawjVaEGZXBepbKta7UyjBug/exec"

const formQues = document.getElementById("questionForm")
const nameInputQues = document.getElementById("nameQues")
const phoneInputQues = document.getElementById("telQues")
const messageInputQues = document.getElementById("messageQues")
const checkboxInputQues = document.getElementById("checkQues")
const submitBtnQues = document.getElementById("submitBtnQues")
const btnTextQues = document.getElementById("btnTextQues")
const successMessageQues = document.getElementById("successMessageQues")

// Telefon input uchun format
phoneInputQues.addEventListener("focus", function () {
  if (!this.value) {
    this.value = "+998 "
  }
})

phoneInputQues.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "")
  if (!value.startsWith("998")) {
    value = "998" + value.substring(3)
  }
  let formatted = "+998 "
  if (value.length > 3) formatted += value.substring(3, 5)
  if (value.length > 5) formatted += "-" + value.substring(5, 8)
  if (value.length > 8) formatted += "-" + value.substring(8, 10)
  if (value.length > 10) formatted += "-" + value.substring(10, 12)
  e.target.value = formatted
})

function showThankYouModal() {
  const modal = document.getElementById("thankYouModal")
  if (modal) {
    modal.style.display = "flex"
  }
}

function closeThankYouModal() {
  const modal = document.getElementById("thankYouModal")
  if (modal) {
    modal.style.display = "none"
  }
}

// Form yuborish
formQues.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Validatsiya
  if (!nameInputQues.value.trim()) {
    alert("Iltimos, ismingizni kiriting")
    return
  }
  if (!phoneInputQues.value.trim() || phoneInputQues.value.length < 17) {
    alert("Iltimos, to'liq telefon raqamingizni kiriting")
    return
  }
  if (!messageInputQues.value.trim()) {
    alert("Iltimos, izohingizni kiriting")
    return
  }
  if (!checkboxInputQues.checked) {
    alert("Iltimos, qabul qilish shartlarini tasdiqlang")
    return
  }

  // Loading holatini yoqish
  submitBtnQues.disabled = true
  btnTextQues.textContent = "Yuborilmoqda..."
  successMessageQues.style.display = "none"

  try {
    const currentTime = new Date().toLocaleString("uz-UZ", {
      timeZone: "Asia/Tashkent",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).replace(/,/, "") // Remove comma for cleaner format (e.g., "09.09.2025 18:39:00")

    const formData = new FormData()
    formData.append("Ism", nameInputQues.value.trim())
    formData.append("Telefon raqam", phoneInputQues.value.trim())
    formData.append("Izoh", messageInputQues.value.trim())
    formData.append("Royhatdan o'tgan vaqti", currentTime)

    const response = await fetch(SHEETS_URL3, {
      method: "POST",
      body: formData,
      redirect: "follow",
      mode: "no-cors"
    })

    // No-cors rejimida response.ok ni tekshirib bo'lmaydi, shuning uchun javob kelganligini tasdiqlaymiz
    showThankYouModal()
    formQues.reset()
    btnTextQues.textContent = "Yuborish"

    // 3 soniyadan keyin tugmani qayta tiklash
    setTimeout(() => {
      submitBtnQues.disabled = false
      btnTextQues.textContent = "Yuborish"
    }, 1000)
  } catch (error) {
    console.error("Xatolik:", error)
    alert("Yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    submitBtnQues.disabled = false
    btnTextQues.textContent = "Yuborish"
  }
})