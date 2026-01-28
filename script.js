const salaryTrack = document.getElementById("salaryTrack");
const centerTrack = document.getElementById("centerTrack");
const systemTrack = document.getElementById("systemTrack");
const centerTabs = document.querySelectorAll(".center-tab");
const form = document.getElementById("applyForm");
const formMessage = document.getElementById("formMessage");

const centerData = {
  mangwon: {
    name: "셀프메이드짐 - 망원점",
    note: "",
    address: "서울 마포구 망원로 00",
    email: "mangwon@selfmadegym.com",
    phone: "02-000-0000",
    manager: "담당자 정승원",
    images: ["IMAGE_URL_HERE", "IMAGE_URL_HERE", "IMAGE_URL_HERE"],
  },
  yeonhui: {
    name: "셀프메이드짐 - 연희점",
    note: "",
    address: "서울 서대문구 연희로 185 지층",
    email: "yeonhui@selfmadegym.com",
    phone: "010-8470-5190",
    manager: "담당자 유승민",
    images: ["IMAGE_URL_HERE", "IMAGE_URL_HERE", "IMAGE_URL_HERE"],
  },
  seongsan: {
    name: "다움 - 여성전용헬스장",
    note: "",
    address: "서울 마포구 성산로 00",
    email: "seongsan@selfmadegym.com",
    phone: "02-000-0000",
    manager: "담당자 정준석",
    images: ["IMAGE_URL_HERE", "IMAGE_URL_HERE", "IMAGE_URL_HERE"],
  },
};

let salaryIndex = 0;
let salaryAnimationId = null;
let centerIndex = 0;
let centerIntervalId = null;
let activeCenterKey = "mangwon";
let salaryStep = 0;
let salaryMaxIndex = 0;
let salaryOffset = 0;
const salarySpeed = 90;
let systemIndex = 0;
let systemIntervalId = null;

function updateSalaryStep() {
  if (!salaryTrack) return;
  const firstSlide = salaryTrack.children[0];
  if (!firstSlide) return;
  const gapValue =
    parseFloat(getComputedStyle(salaryTrack).columnGap) ||
    parseFloat(getComputedStyle(salaryTrack).gap) ||
    0;
  salaryStep = firstSlide.offsetWidth + gapValue;
  const sliderWidth = salaryTrack.parentElement
    ? salaryTrack.parentElement.clientWidth
    : 0;
  const visibleCount = salaryStep ? Math.floor(sliderWidth / salaryStep) : 1;
  salaryMaxIndex = Math.max(0, salaryTrack.children.length - visibleCount);
}

function startSalarySlider() {
  if (!salaryTrack) return;
  if (!salaryTrack.dataset.cloned) {
    const originalSlides = Array.from(salaryTrack.children);
    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      salaryTrack.appendChild(clone);
    });
    salaryTrack.dataset.cloned = "true";
  }

  updateSalaryStep();
  salaryTrack.style.transition = "none";

  let lastTimestamp = null;
  const originalWidth = salaryStep * (salaryTrack.children.length / 2);

  const animate = (timestamp) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaSeconds = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    salaryOffset += salarySpeed * deltaSeconds;
    if (salaryOffset >= originalWidth) {
      salaryOffset = 0;
    }

    salaryTrack.style.transform = `translateX(-${salaryOffset}px)`;
    salaryAnimationId = requestAnimationFrame(animate);
  };

  if (salaryAnimationId) cancelAnimationFrame(salaryAnimationId);
  salaryAnimationId = requestAnimationFrame(animate);
}

function updateCenterInfo(key) {
  const data = centerData[key];
  if (!data) return;

  document.getElementById("centerName").textContent = data.name;
  document.getElementById("centerNote").textContent = data.note;
  document.getElementById("centerAddress").textContent = data.address;
  document.getElementById("centerEmail").textContent = data.email;
  document.getElementById("centerPhone").textContent = data.phone;
  document.getElementById("centerManager").textContent = data.manager;

  if (!centerTrack) return;
  const images = centerTrack.querySelectorAll("img");
  images.forEach((img, idx) => {
    img.src = data.images[idx] || "IMAGE_URL_HERE";
  });
  centerIndex = 0;
  centerTrack.style.transform = "translateX(0)";
}

function startCenterSlider() {
  if (!centerTrack) return;
  const slides = centerTrack.children.length;
  if (centerIntervalId) clearInterval(centerIntervalId);
  centerIntervalId = setInterval(() => {
    centerIndex = (centerIndex + 1) % slides;
    centerTrack.style.transform = `translateX(-${centerIndex * 100}%)`;
  }, 4000);
}

function updateSystemSlides() {
  if (!systemTrack) return;
  const slides = Array.from(systemTrack.children);
  slides.forEach((slide) => {
    slide.classList.remove("is-active", "is-next", "is-prev", "is-far");
  });

  const total = slides.length;
  const active = systemIndex % total;
  const next = (systemIndex + 1) % total;
  const prev = (systemIndex - 1 + total) % total;
  const far = (systemIndex + 2) % total;

  slides[active].classList.add("is-active");
  slides[next].classList.add("is-next");
  slides[prev].classList.add("is-prev");
  slides[far].classList.add("is-far");
}

function startSystemSlider() {
  if (!systemTrack) return;
  updateSystemSlides();
  if (systemIntervalId) clearInterval(systemIntervalId);
  systemIntervalId = setInterval(() => {
    systemIndex = (systemIndex + 1) % systemTrack.children.length;
    updateSystemSlides();
  }, 2800);
}

centerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    centerTabs.forEach((btn) => btn.classList.remove("is-active"));
    tab.classList.add("is-active");
    activeCenterKey = tab.dataset.center;
    updateCenterInfo(activeCenterKey);
    startCenterSlider();
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const requiredFields = ["name", "gender", "phone", "email", "branch"];
    const hasAllFields = requiredFields.every((field) => formData.get(field));
    const hasFile = formData.get("resume") && formData.get("resume").name;

    if (!hasAllFields || !hasFile) {
      formMessage.textContent = "모든 항목을 입력해 주세요.";
      return;
    }

    formMessage.textContent =
      "제출이 완료되었습니다. 이력서 확인 후 면접을 위해 연락은 별도로 드립니다.";
    form.reset();
  });
}

updateCenterInfo(activeCenterKey);
startSalarySlider();
startCenterSlider();
startSystemSlider();

window.addEventListener("resize", () => {
  if (!salaryTrack) return;
  updateSalaryStep();
  salaryTrack.style.transition = "none";
  salaryTrack.style.transform = `translateX(-${salaryOffset}px)`;
});
