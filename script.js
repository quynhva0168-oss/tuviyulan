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

birthForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(birthForm);
  const name = String(formData.get("name") || "").trim();
  const date = String(formData.get("birthdate") || "");
  const time = String(formData.get("birthtime") || "");
  const gender = String(formData.get("gender") || "");

  if (!date || !time || !gender) {
    formResult.textContent = "Vui lòng hoàn tất ngày sinh, giờ sinh và giới tính.";
    return;
  }

  const dateParts = date.split("-");
  const readableDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  formResult.textContent = `Đã nhận thông tin thử nghiệm${name ? ` của ${name}` : ""}: ${readableDate} · ${time} · ${gender}. Bộ máy lập lá số chính thức đang được phát triển và kiểm chứng.`;
});
