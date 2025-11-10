const SHEETS_URL1 =
  "https://script.google.com/macros/s/AKfycbzD_GeRPgEcpMDmPaeGJZ7iTbBcwX3vyOsqmK6IKgyTA4co4q3z7R05uYyMg_gjDsLk-g/exec"

const formAriza = document.getElementById("applicationFormAriza")
const nameInputAriza = document.getElementById("nameAriza")
const phoneInputAriza = document.getElementById("telAriza")
const messageInputAriza = document.getElementById("messageAriza")
const checkboxInputAriza = document.getElementById("checkboxAriza")
const submitBtnAriza = document.getElementById("submitBtnAriza")
const btnTextAriza = document.getElementById("btnTextAriza")
const successMessageAriza = document.getElementById("successMessageAriza")

// Telefon input uchun format
phoneInputAriza.addEventListener("focus", function () {
  if (!this.value) {
    this.value = "+998 "
  }
})

phoneInputAriza.addEventListener("input", (e) => {
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
formAriza.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Validatsiya
  if (!nameInputAriza.value.trim()) {
    alert("Iltimos, ismingizni kiriting")
    return
  }
  if (!phoneInputAriza.value.trim() || phoneInputAriza.value.length < 17) {
    alert("Iltimos, to'liq telefon raqamingizni kiriting")
    return
  }
  if (!messageInputAriza.value.trim()) {
    alert("Iltimos, izohingizni kiriting")
    return
  }
  if (!checkboxInputAriza.checked) {
    alert("Iltimos, qabul qilish shartlarini tasdiqlang")
    return
  }

  // Loading holatini yoqish
  submitBtnAriza.disabled = true
  btnTextAriza.textContent = "Yuborilmoqda..."
  successMessageAriza.style.display = "none"

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
    formData.append("Ism", nameInputAriza.value.trim())
    formData.append("Telefon raqam", phoneInputAriza.value.trim())
    formData.append("Izoh", messageInputAriza.value.trim())
    formData.append("Royhatdan o'tgan vaqti", currentTime)

    const response = await fetch(SHEETS_URL1, {
      method: "POST",
      body: formData,
      redirect: "follow",
      mode: "no-cors"
    })

    // No-cors rejimida response.ok ni tekshirib bo'lmaydi, shuning uchun javob kelganligini tasdiqlaymiz
    showThankYouModal()
    formAriza.reset()
    btnTextAriza.textContent = "Yuborish"

    // 3 soniyadan keyin tugmani qayta tiklash
    setTimeout(() => {
      submitBtnAriza.disabled = false
      btnTextAriza.textContent = "Yuborish"
    }, 1000)
  } catch (error) {
    console.error("Xatolik:", error)
    alert("Yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    submitBtnAriza.disabled = false
    btnTextAriza.textContent = "Yuborish"
  }
})