const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
});

mainNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const birthForm = document.getElementById("birthForm");
const formResult = document.getElementById("formResult");
const solarFields = document.getElementById("solarFields");
const lunarFields = document.getElementById("lunarFields");
const calendarChoices = document.querySelectorAll('input[name="calendarType"]');
const solarDate = birthForm?.elements.namedItem("solarDate");
const lunarDay = birthForm?.elements.namedItem("lunarDay");
const lunarMonth = birthForm?.elements.namedItem("lunarMonth");
const lunarYear = birthForm?.elements.namedItem("lunarYear");

function selectedCalendar() {
  return birthForm?.querySelector('input[name="calendarType"]:checked')?.value || "solar";
}

function updateCalendarFields() {
  const isSolar = selectedCalendar() === "solar";
  solarFields.hidden = !isSolar;
  lunarFields.hidden = isSolar;
  solarDate.required = isSolar;
  lunarDay.required = !isSolar;
  lunarMonth.required = !isSolar;
  lunarYear.required = !isSolar;
  formResult.textContent = "";
}

calendarChoices.forEach(choice => choice.addEventListener("change", updateCalendarFields));
updateCalendarFields();

birthForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(birthForm);
  const name = String(formData.get("name") || "").trim();
  const calendar = String(formData.get("calendarType") || "solar");
  const time = String(formData.get("birthtime") || "");
  const gender = String(formData.get("gender") || "");
  const birthplace = String(formData.get("birthplace") || "").trim();

  if (!time || !gender || !birthplace || !formData.get("consent")) {
    formResult.textContent = "Vui lòng hoàn tất giờ sinh, giới tính, nơi sinh và xác nhận đồng ý.";
    return;
  }

  let dateDescription = "";
  if (calendar === "solar") {
    const date = String(formData.get("solarDate") || "");
    if (!date) {
      formResult.textContent = "Vui lòng nhập ngày sinh dương lịch.";
      return;
    }
    const [year, month, day] = date.split("-");
    dateDescription = `Dương lịch ${day}/${month}/${year}`;
  } else {
    const day = Number(formData.get("lunarDay"));
    const month = Number(formData.get("lunarMonth"));
    const year = Number(formData.get("lunarYear"));
    const leap = formData.get("isLeapMonth") ? " (tháng nhuận)" : "";
    if (!day || !month || !year || year < 1800 || year > 2200) {
      formResult.textContent = "Vui lòng nhập đầy đủ ngày, tháng, năm âm lịch hợp lệ (năm 1800–2200).";
      return;
    }
    dateDescription = `Âm lịch ${day}/${month}/${year}${leap}`;
  }

  const displayName = name ? ` của ${name}` : "";
  formResult.textContent =
    `Đã nhận thông tin thử nghiệm${displayName}: ${dateDescription} · Giờ ${time} · ${gender} · Nơi sinh: ${birthplace}. ` +
    "Đây mới là bước xác nhận dữ liệu; website chưa chuyển đổi lịch hoặc tính toán lá số chính thức.";
});
