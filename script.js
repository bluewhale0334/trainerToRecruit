import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA7Xp0Gu0mUxOqUexJ0HBINmObz32M6HYA",
  authDomain: "trainertorecruit.firebaseapp.com",
  projectId: "trainertorecruit",
  storageBucket: "trainertorecruit.firebasestorage.app",
  messagingSenderId: "677245873737",
  appId: "1:677245873737:web:17003d8fe0f32126cf1998",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const salaryTrack = document.getElementById("salaryTrack");
const centerTrack = document.getElementById("centerTrack");
const systemTrack = document.getElementById("systemTrack");
const centerTabs = document.querySelectorAll(".center-tab");
const form = document.getElementById("applyForm");
const formMessage = document.getElementById("formMessage");
const applyToggle = document.getElementById("applyToggle");
const heroTitle = document.querySelector(".hero-title.typing");
const heroInner = document.querySelector(".hero-inner");

const centerData = {
  mangwon: {
    name: "셀프메이드짐 - 망원점",
    note: "",
    address: "서울 마포구 월드컵로 61 지층",
    email: "selfmadegym@naver.com",
    phone: "010-9610-5190",
    manager: "담당자 정승원",
    images: [
      "https://i.postimg.cc/t4QW1T7Z/mang-won-(1).jpg",
      "https://i.postimg.cc/y8m90HS0/mang-won-(10).jpg",
      "https://i.postimg.cc/FH53fR1y/mang-won-(2).jpg",
      "https://i.postimg.cc/fRnm3Lk7/mang-won-(3).jpg",
      "https://i.postimg.cc/K8SBKz4t/mang-won-(4).jpg",
      "https://i.postimg.cc/vZFf1BDW/mang-won-(5).jpg",
      "https://i.postimg.cc/T3MgywhJ/mang-won-(6).jpg",
      "https://i.postimg.cc/QdG1BtVb/mang-won-(7).jpg",
      "https://i.postimg.cc/nhbBszM2/mang-won-(8).jpg",
      "https://i.postimg.cc/L8KLqXhN/mang-won-(9).jpg",
    ],
  },
  yeonhui: {
    name: "셀프메이드짐 - 연희점",
    note: "",
    address: "서울 서대문구 연희로 185 지층",
    email: "selfmadegym2@naver.com",
    phone: "010-8470-5190",
    manager: "담당자 유승민",
    images: [
      "https://i.postimg.cc/PrzYwHD4/yeonhui-(1).jpg",
      "https://i.postimg.cc/DydLXhGB/yeonhui-(2).jpg",
      "https://i.postimg.cc/rFCxrT4g/yeonhui-(3).jpg",
      "https://i.postimg.cc/Qxk1TD74/yeonhui-(4).jpg",
      "https://i.postimg.cc/RVQKHmtg/yeonhui-(5).jpg",
      "https://i.postimg.cc/X7cdCW5z/yeonhui-(6).jpg",
      "https://i.postimg.cc/fTjm9sdq/yeonhui-(7).jpg",
      "https://i.postimg.cc/Fsg3LvS6/yeonhui-(8).jpg",
    ],
  },
  seongsan: {
    name: "다움 - 여성전용헬스장",
    note: "",
    address: "서울 마포구 월드컵북로38길 14",
    email: "daum.w.wellness@gmail.com",
    phone: "010-3564-0911",
    manager: "담당자 정준석",
    images: [
      "https://i.postimg.cc/cL079CZ6/seongsan-(1).jpg",
      "https://i.postimg.cc/52gBZJNy/seongsan-(2).jpg",
      "https://i.postimg.cc/Dw6rthyZ/seongsan-(3).jpg",
      "https://i.postimg.cc/YCR6J7qS/seongsan-(4).jpg",
      "https://i.postimg.cc/qvws9rMM/seongsan-(5).jpg",
      "https://i.postimg.cc/Dw6rthy4/seongsan-(6).jpg",
      "https://i.postimg.cc/wj2XSzTN/seongsan-(7).jpg",
      "https://i.postimg.cc/zG7C9NXW/seongsan-(8).jpg",
    ],
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
  centerTrack.innerHTML = "";
  const imagesToUse = data.images.length ? data.images : ["IMAGE_URL_HERE"];
  imagesToUse.forEach((src, idx) => {
    const slide = document.createElement("div");
    slide.className = "center-slide";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${data.name} 사진 ${idx + 1}`;
    slide.appendChild(img);
    centerTrack.appendChild(slide);
  });
  centerIndex = 0;
  centerTrack.style.transform = "translateX(0)";
}

function typeHeroTitle() {
  if (!heroTitle) return;
  const text = heroTitle.dataset.text || "";
  const lines = text.split("\n");
  const fullText = lines.join("\n");
  let index = 0;
  heroTitle.textContent = "";

  const timer = setInterval(() => {
    const currentText = fullText.slice(0, index + 1);
    heroTitle.innerHTML = currentText.replace(/\n/g, "<br>");
    index += 1;
    if (index >= fullText.length) {
      clearInterval(timer);
      heroTitle.classList.remove("typing");
    }
  }, 70);
}

function setupScrollReveal() {
  const sections = document.querySelectorAll("main section");
  sections.forEach((section) => {
    if (!section.classList.contains("hero")) {
      section.classList.add("reveal");
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const requiredFields = ["name", "gender", "phone", "email", "branch"];
    const hasAllFields = requiredFields.every((field) => formData.get(field));
    const resumeFile = formData.get("resume");
    const hasFile = resumeFile && resumeFile.name;
    const submitButton = form.querySelector(".submit-button");

    if (!hasAllFields || !hasFile) {
      formMessage.textContent = "모든 항목을 입력해 주세요.";
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "제출 중...";
    }

    try {
      const fileName = `${Date.now()}_${resumeFile.name}`;
      const resumeRef = ref(storage, `resumes/${fileName}`);
      await uploadBytes(resumeRef, resumeFile);
      const resumeUrl = await getDownloadURL(resumeRef);

      await addDoc(collection(db, "applications"), {
        name: formData.get("name"),
        gender: formData.get("gender"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        branch: formData.get("branch"),
        resumeUrl,
        createdAt: serverTimestamp(),
      });

      formMessage.textContent =
        "제출이 완료되었습니다. 이력서 확인 후 면접을 위해 연락은 별도로 드립니다.";
      form.reset();
    } catch (error) {
      formMessage.textContent =
        "제출에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "제출";
      }
    }
  });
}

if (applyToggle && form) {
  applyToggle.addEventListener("click", () => {
    form.classList.toggle("is-hidden");
  });
}

updateCenterInfo(activeCenterKey);
startSalarySlider();
startCenterSlider();
startSystemSlider();
setupScrollReveal();

if (heroInner) heroInner.classList.add("is-visible");
typeHeroTitle();

window.addEventListener("resize", () => {
  if (!salaryTrack) return;
  updateSalaryStep();
  salaryTrack.style.transition = "none";
  salaryTrack.style.transform = `translateX(-${salaryOffset}px)`;
});
