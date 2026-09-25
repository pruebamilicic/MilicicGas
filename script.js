/* =====================================================
   FECHA Y HORA
===================================================== */
function updateDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  document.getElementById("currentDate").textContent = `${day}/${month}/${year}`;
  document.getElementById("currentTime").textContent = `${hours}:${minutes}:${seconds}`;
}
updateDateTime();
setInterval(updateDateTime, 1000);

/* =====================================================
   NÚMERO DE COMPROBANTE
===================================================== */
function loadReceiptNumber() {
  let lastNumber = localStorage.getItem("milicicReceiptNumber");
  if (!lastNumber) {
    lastNumber = 36895;
    localStorage.setItem("milicicReceiptNumber", lastNumber);
  }
  document.getElementById("receiptNumber").textContent = lastNumber;
}

function incrementReceiptNumber() {
  let lastNumber = localStorage.getItem("milicicReceiptNumber");
  if (!lastNumber) {
    lastNumber = 36895;
  } else {
    lastNumber = Number(lastNumber) + 1;
  }
  localStorage.setItem("milicicReceiptNumber", lastNumber);
  document.getElementById("receiptNumber").textContent = lastNumber;
}
loadReceiptNumber();

/* =====================================================
   FIRMA DIGITAL
===================================================== */
const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const placeholder = document.getElementById("signaturePlaceholder");
let drawing = false;
let hasSignature = false;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#333";
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function getPosition(event) {
  const rect = canvas.getBoundingClientRect();
  let clientX, clientY;
  if (event.touches) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function startDrawing(event) {
  event.preventDefault();
  drawing = true;
  hasSignature = true;
  placeholder.style.display = "none";
  const pos = getPosition(event);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(event) {
  if (!drawing) return;
  event.preventDefault();
  const pos = getPosition(event);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDrawing() {
  drawing = false;
  ctx.closePath();
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing);

document.getElementById("clearSignature").addEventListener("click", function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasSignature = false;
  placeholder.style.display = "block";
});

function getOptimizedSignature() {
  if (!hasSignature) return "";
  const tempCanvas = document.createElement("canvas");
  const maxW = 380;
  const scale = Math.min(1, maxW / canvas.width);
  tempCanvas.width = Math.round(canvas.width * scale);
  tempCanvas.height = Math.round(canvas.height * scale);
  const tCtx = tempCanvas.getContext("2d");
  tCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
  return tempCanvas.toDataURL("image/png");
}

/* =====================================================
   RESTRICCIONES EN TIEMPO REAL
===================================================== */
const vehicleInput = document.getElementById("vehicle");
vehicleInput.addEventListener("input", function() {
  const hasAlpha = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(this.value);
  if (!hasAlpha && this.value.length > 5) {
    this.value = this.value.slice(0, 5);
  }
});

const kmInput = document.getElementById("kilometers");
kmInput.addEventListener("keydown", function(e) {
  if (e.key === "-" || e.key === "e") {
    e.preventDefault();
  }
});
kmInput.addEventListener("input", function() {
  if (this.value !== "" && Number(this.value) < 0) {
    this.value = 0;
  }
});

/* =====================================================
   DESPLEGABLE PERSONALIZADO - CENTRO DE COSTO
===================================================== */
const costCenterList = [
    "01 - General Rosario",
    "04 - Legales Rosario",
    "05 - Serv técnico Rosario",
    "06 - Departamento Técnico",
    "06 - Gerencia Operaciones",
    "07 - Comercial Rosario",
    "08 - Abast Rosario",
    "09 - Obras Varias Milicic",
    "10 - Logística Rosario",
    "11 - Gerencia Rosario",
    "13 - SSGG Rosario",
    "14 - Sistemas Rosario",
    "15 - RRHH Rosario",
    "16 - SIG Rosario",
    "17 - Agasa",
    "18 - Gerencia Eqp Ros",
    "19 - Gerencia HU",
    "20 - Comercial Rental Ros",
    "22 - Campamento",
    "25 - Devol",
    "26 - Cantera Soldini",
    "27 - Sede ex-acindar",
    "28 - Gerencia Perú",
    "40 - Compras EQP Rosario",
    "41 - Com y Sust Rosario",
    "42 - Admin Rosario",
    "45 - Desarrollo Rosario",

    "29004 - Nuevo edicifio administrativo",
    "29007 - Gomeria y deposito cubiertas",
    "29802 - General Añelo",
    "29805 - Serv técnico Añelo",
    "29808 - Abast Añelo",
    "29813 - SSGG Añelo",
    "29815 - RRHH Añelo",
    "29816 - SIG Añelo",
    "29818 - Gerencia Eqp Añelo",
    "29820 - Comercial Rental Añelo",
    "29842 - Admin Añelo"
];

const costCenterInput = document.getElementById("costCenter");
const costCenterDropdown = document.getElementById("costCenterDropdown");
const costCenterWrapper = document.getElementById("costCenterWrapper");
const toggleCostCenterBtn = document.getElementById("toggleCostCenterList");

function populateCostCenterDropdown(filter = "") {
  costCenterDropdown.innerHTML = "";
  const filterLower = filter.toLowerCase().trim();
  const filtered = costCenterList.filter(name =>
    name.toLowerCase().includes(filterLower)
  );

  if (filtered.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "dropdown-empty";
    emptyLi.textContent = "Sin coincidencias (se guardará lo escrito)";
    costCenterDropdown.appendChild(emptyLi);
  } else {
    filtered.forEach(name => {
      const li = document.createElement("li");
      li.className = "dropdown-item";
      li.textContent = name;
      li.addEventListener("mousedown", function(e) {
        e.preventDefault();
        costCenterInput.value = name;
        closeCostCenterDropdown();
      });
      costCenterDropdown.appendChild(li);
    });
  }
}
populateCostCenterDropdown();

function openCostCenterDropdown() {
  costCenterWrapper.classList.add("open");
  costCenterDropdown.classList.add("show");
  populateCostCenterDropdown(costCenterInput.value);
}

function closeCostCenterDropdown() {
  costCenterWrapper.classList.remove("open");
  costCenterDropdown.classList.remove("show");
}

costCenterInput.addEventListener("focus", openCostCenterDropdown);
costCenterInput.addEventListener("input", function() {
  openCostCenterDropdown();
  populateCostCenterDropdown(this.value);
});

toggleCostCenterBtn.addEventListener("click", function(e) {
  e.stopPropagation();
  if (costCenterDropdown.classList.contains("show")) {
    closeCostCenterDropdown();
  } else {
    costCenterInput.focus();
    openCostCenterDropdown();
  }
});

/* =====================================================
   DESPLEGABLE PERSONALIZADO - CARGO
===================================================== */
const cargoList = [
  "ALANDAVIDEA", "ALVAREZ", "BARTOLOMEO", "CAPPE", "CCARRIL", "CRISTIAN",
  "DARIO FLORES", "DAVID M", "FABRICIO FUNES", "FDEICAS", "JAVIER",
  "JAVIER.DICEV.", "JBARTOLOMEO", "JDICEVICUIS", "JMORENO",
  "JOEL BARTOLOMEO", "JUAN MORENO", "LBARTON", "LEZCANO", "LMANSILLA",
  "LNASUTI", "MPANIAGUA", "PANIAGUA M", "RENTAL", "ROBLEDO", "TECNICO", "TOMAS"
];

const positionInput = document.getElementById("position");
const cargoDropdown = document.getElementById("cargoDropdown");
const cargoWrapper = document.getElementById("cargoWrapper");
const toggleBtn = document.getElementById("toggleCargoList");

function populateCargoDropdown(filter = "") {
  cargoDropdown.innerHTML = "";
  const filterLower = filter.toLowerCase().trim();
  const filtered = cargoList.filter(name =>
    name.toLowerCase().includes(filterLower)
  );

  if (filtered.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "dropdown-empty";
    emptyLi.textContent = "Sin coincidencias (se guardará lo escrito)";
    cargoDropdown.appendChild(emptyLi);
  } else {
    filtered.forEach(name => {
      const li = document.createElement("li");
      li.className = "dropdown-item";
      li.textContent = name;
      li.addEventListener("mousedown", function(e) {
        e.preventDefault();
        positionInput.value = name;
        closeCargoDropdown();
      });
      cargoDropdown.appendChild(li);
    });
  }
}
populateCargoDropdown();

function openCargoDropdown() {
  cargoWrapper.classList.add("open");
  cargoDropdown.classList.add("show");
  populateCargoDropdown(positionInput.value);
}

function closeCargoDropdown() {
  cargoWrapper.classList.remove("open");
  cargoDropdown.classList.remove("show");
}

positionInput.addEventListener("focus", openCargoDropdown);
positionInput.addEventListener("input", function() {
  openCargoDropdown();
  populateCargoDropdown(this.value);
});

toggleBtn.addEventListener("click", function(e) {
  e.stopPropagation();
  if (cargoDropdown.classList.contains("show")) {
    closeCargoDropdown();
  } else {
    positionInput.focus();
    openCargoDropdown();
  }
});

document.addEventListener("click", function(e) {
  if (costCenterWrapper && !costCenterWrapper.contains(e.target)) {
    closeCostCenterDropdown();
  }
  if (cargoWrapper && !cargoWrapper.contains(e.target)) {
    closeCargoDropdown();
  }
});

/* =====================================================
   VALIDACIÓN
===================================================== */
function validateForm() {
  const vehicle = document.getElementById("vehicle").value.trim();
  const costCenter = document.getElementById("costCenter").value.trim();
  const kilometers = document.getElementById("kilometers").value.trim();
  const liters = document.getElementById("liters").value.trim();
  const name = document.getElementById("name").value.trim();
  const position = document.getElementById("position").value.trim();

  if (!vehicle) {
    alert("Por favor, ingresá el N° interno del vehículo.");
    return false;
  }
  const hasAlpha = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(vehicle);
  if (!hasAlpha && vehicle.length > 5) {
    alert("El N° interno del vehículo no puede superar los 5 caracteres si solo contiene números.");
    return false;
  }
  if (!costCenter) {
    alert("Por favor, ingresá o seleccioná el centro de costo.");
    return false;
  }
  if (!kilometers) {
    alert("Por favor, ingresá la cantidad de kilómetros / horas.");
    return false;
  }
  if (Number(kilometers) < 0) {
    alert("La cantidad de kilómetros / horas no puede ser un número negativo (el mínimo es 0).");
    return false;
  }
  if (!liters) {
    alert("Por favor, ingresá los litros entregados.");
    return false;
  }
  if (Number(liters) <= 0) {
    alert("La cantidad de litros debe ser mayor a 0.");
    return false;
  }
  if (!name) {
    alert("Por favor, ingresá nombre y apellido.");
    return false;
  }
  if (!position) {
    alert("Por favor, ingresá el cargo.");
    return false;
  }
  if (!hasSignature) {
    alert("Por favor, realizá la firma del responsable.");
    return false;
  }
  return true;
}

/* =====================================================
   URL DE GOOGLE APPS SCRIPT
===================================================== */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxPOD1uBWv9ucQhH_exv1vQTZWkVjekWJ7J-y3KUjKNjMGtN3EEaArTh2InOeqCVdT/exec";

/* =====================================================
   FUEGOS ARTIFICIALES
===================================================== */
let fireworksActive = false;
let fireworksCanvas = null;
let fireworksCtx = null;
let fireworksAnimId = null;
let fireworkRockets = [];
let fireworkSparks = [];
let fireworkInterval = null;

const FW_COLORS = [
  "#ff7100", "#ff9500", "#ffd000", "#ff3366",
  "#00e5ff", "#00e676", "#7c4dff", "#ffffff"
];

function initFireworksCanvas() {
  if (!fireworksCanvas) {
    fireworksCanvas = document.createElement("canvas");
    fireworksCanvas.id = "fireworksCanvas";
    fireworksCanvas.style.position = "fixed";
    fireworksCanvas.style.inset = "0";
    fireworksCanvas.style.width = "100%";
    fireworksCanvas.style.height = "100%";
    fireworksCanvas.style.pointerEvents = "none";
    fireworksCanvas.style.zIndex = "10000";
    document.body.appendChild(fireworksCanvas);
    fireworksCtx = fireworksCanvas.getContext("2d");
  }
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}

function createFireworkRocket(fromCorner) {
  const w = fireworksCanvas.width;
  const h = fireworksCanvas.height;
  let startX, startY, targetX, targetY;

  if (fromCorner === "bottom-left") {
    startX = 0; startY = h;
    targetX = w * (0.2 + Math.random() * 0.25);
    targetY = h * (0.15 + Math.random() * 0.35);
  } else if (fromCorner === "bottom-right") {
    startX = w; startY = h;
    targetX = w * (0.55 + Math.random() * 0.25);
    targetY = h * (0.15 + Math.random() * 0.35);
  } else if (fromCorner === "top-left") {
    startX = 0; startY = 0;
    targetX = w * (0.2 + Math.random() * 0.3);
    targetY = h * (0.3 + Math.random() * 0.3);
  } else {
    startX = w; startY = 0;
    targetX = w * (0.5 + Math.random() * 0.3);
    targetY = h * (0.3 + Math.random() * 0.3);
  }

  const color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
  const angle = Math.atan2(targetY - startY, targetX - startX);
  const dist = Math.hypot(targetX - startX, targetY - startY);
  const speed = dist / 28;

  fireworkRockets.push({
    x: startX,
    y: startY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    targetX: targetX,
    targetY: targetY,
    color: color,
    trail: []
  });
}

function explodeRocket(x, y, color) {
  const count = 45;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2;
    const speed = Math.random() * 6 + 2;
    fireworkSparks.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: Math.random() > 0.3 ? color : FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
      radius: Math.random() * 2.5 + 1.5,
      alpha: 1,
      decay: Math.random() * 0.018 + 0.015,
      gravity: 0.12,
      friction: 0.97
    });
  }
}

function shootCornerConfetti() {
  const w = fireworksCanvas.width;
  const h = fireworksCanvas.height;
  const corners = [
    { x: 0, y: h, angleMin: -65, angleMax: -25 },
    { x: w, y: h, angleMin: -155, angleMax: -115 },
    { x: 0, y: 0, angleMin: 25, angleMax: 65 },
    { x: w, y: 0, angleMin: 115, angleMax: 155 }
  ];

  corners.forEach(c => {
    for (let i = 0; i < 18; i++) {
      const rad = ((c.angleMin + Math.random() * (c.angleMax - c.angleMin)) * Math.PI) / 180;
      const speed = Math.random() * 12 + 8;
      fireworkSparks.push({
        x: c.x,
        y: c.y,
        vx: Math.cos(rad) * speed,
        vy: Math.sin(rad) * speed,
        color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
        radius: Math.random() * 3 + 2,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.012,
        gravity: 0.18,
        friction: 0.96
      });
    }
  });
}

function animateFireworks() {
  if (!fireworksActive) return;
  fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  for (let i = fireworkRockets.length - 1; i >= 0; i--) {
    const r = fireworkRockets[i];
    r.trail.push({ x: r.x, y: r.y });
    if (r.trail.length > 5) r.trail.shift();

    r.x += r.vx;
    r.y += r.vy;

    fireworksCtx.strokeStyle = r.color;
    fireworksCtx.lineWidth = 2.5;
    fireworksCtx.beginPath();
    for (let j = 0; j < r.trail.length; j++) {
      const pt = r.trail[j];
      if (j === 0) fireworksCtx.moveTo(pt.x, pt.y);
      else fireworksCtx.lineTo(pt.x, pt.y);
    }
    fireworksCtx.stroke();

    fireworksCtx.fillStyle = "#ffffff";
    fireworksCtx.beginPath();
    fireworksCtx.arc(r.x, r.y, 3, 0, Math.PI * 2);
    fireworksCtx.fill();

    const dist = Math.hypot(r.targetX - r.x, r.targetY - r.y);
    if (dist < 15 || (r.vy >= 0 && r.y > r.targetY)) {
      explodeRocket(r.x, r.y, r.color);
      fireworkRockets.splice(i, 1);
    }
  }

  for (let i = fireworkSparks.length - 1; i >= 0; i--) {
    const s = fireworkSparks[i];
    s.vx *= s.friction;
    s.vy *= s.friction;
    s.vy += s.gravity;
    s.x += s.vx;
    s.y += s.vy;
    s.alpha -= s.decay;

    if (s.alpha <= 0) {
      fireworkSparks.splice(i, 1);
      continue;
    }

    fireworksCtx.save();
    fireworksCtx.globalAlpha = s.alpha;
    fireworksCtx.fillStyle = s.color;
    fireworksCtx.beginPath();
    fireworksCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    fireworksCtx.fill();
    fireworksCtx.restore();
  }

  fireworksAnimId = requestAnimationFrame(animateFireworks);
}

function startFireworks() {
  initFireworksCanvas();
  fireworksActive = true;
  fireworkRockets = [];
  fireworkSparks = [];
  shootCornerConfetti();

  const corners = ["bottom-left", "bottom-right", "top-left", "top-right"];
  corners.forEach(c => createFireworkRocket(c));

  fireworkInterval = setInterval(() => {
    if (!fireworksActive) return;
    const corner = corners[Math.floor(Math.random() * corners.length)];
    createFireworkRocket(corner);
    if (Math.random() > 0.4) {
      const corner2 = corners[Math.floor(Math.random() * corners.length)];
      createFireworkRocket(corner2);
    }
  }, 450);

  animateFireworks();
}

function stopFireworks() {
  fireworksActive = false;
  if (fireworkInterval) clearInterval(fireworkInterval);
  if (fireworksAnimId) cancelAnimationFrame(fireworksAnimId);
  if (fireworksCtx && fireworksCanvas) {
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  }
  fireworkRockets = [];
  fireworkSparks = [];
}

/* =====================================================
   ENVIAR FORMULARIO
===================================================== */
let pendingPayload = null;

document.getElementById("fuelForm").addEventListener("submit", function(event) {
  event.preventDefault();
  if (!validateForm()) return;

  pendingPayload = {
    fecha: document.getElementById("currentDate").textContent,
    hora: document.getElementById("currentTime").textContent,
    comprobante: document.getElementById("receiptNumber").textContent,
    vehiculo: document.getElementById("vehicle").value.trim(),
    centroCosto: document.getElementById("costCenter").value.trim(),
    kilometros: document.getElementById("kilometers").value.trim(),
    litros: document.getElementById("liters").value.trim(),
    nombre: document.getElementById("name").value.trim(),
    cargo: document.getElementById("position").value.trim(),
    firma: getOptimizedSignature()
  };

  showConfirm(pendingPayload);
});

/* =====================================================
   MODAL DE CONFIRMACIÓN
===================================================== */
function showConfirm(payload) {
  const list = document.getElementById("confirmList");
  const rows = [
    ["N° comprobante", payload.comprobante],
    ["Vehículo", payload.vehiculo],
    ["Centro de costo", payload.centroCosto],
    ["Kilómetros / horas", payload.kilometros],
    ["Litros entregados", payload.litros],
    ["Nombre y apellido", payload.nombre],
    ["Cargo", payload.cargo]
  ];

  list.innerHTML = rows.map(([label, value]) =>
    '<div class="confirm-row">' +
      '<span class="confirm-label">' + label + '</span>' +
      '<span class="confirm-value">' + value + '</span>' +
    '</div>'
  ).join("");

  list.innerHTML +=
    '<div class="confirm-row confirm-row-signature">' +
      '<span class="confirm-label">Firma</span>' +
      '<img src="' + payload.firma + '" alt="Firma del responsable" class="confirm-signature-img">' +
    '</div>';

  document.getElementById("confirmMessage").style.display = "flex";
}

function closeConfirm() {
  document.getElementById("confirmMessage").style.display = "none";
}

/* =====================================================
   CAPTURA COMPLETA DEL FORMULARIO Y ENVÍO A SHEETS
===================================================== */
async function procesarYEnviarCarga() {
  const confirmBtn = document.getElementById("confirmSendBtn");
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "GENERANDO COMPROBANTE...";
  }

  // 1. Obtener el número de comprobante
  const comprobanteNum = pendingPayload ? pendingPayload.comprobante : "36920";

  // 2. Ocultar botones temporalmente para la foto
  const btnRegistrar = document.querySelector(".btn-submit") || confirmBtn;
  const btnLimpiarFirma = document.getElementById("clearSignature");
  if (btnRegistrar) btnRegistrar.style.opacity = "0";
  if (btnLimpiarFirma) btnLimpiarFirma.style.opacity = "0";

  try {
    // 3. Capturar el formulario entero
    const formElement = document.querySelector(".form-container") || document.querySelector("form") || document.body;
    
    const canvas = await html2canvas(formElement, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false
    });

    // 4. Generar y forzar la descarga de la imagen
    const imageURI = canvas.toDataURL("image/png");
    
    const link = document.createElement("a");
    link.download = `carga_${comprobanteNum}.png`;
    link.href = imageURI;
    link.target = "_blank";
    
    // Disparo forzado de descarga
    document.body.appendChild(link);
    if (link.click) {
      link.click();
    } else {
      window.open(imageURI, '_blank');
    }
    document.body.removeChild(link);

  } catch (err) {
    console.error("Error al capturar comprobante:", err);
    alert("No se pudo descargar la imagen automáticamente. Verificá los permisos de tu navegador.");
  } finally {
    // Restaurar visibilidad de botones
    if (btnRegistrar) btnRegistrar.style.opacity = "1";
    if (btnLimpiarFirma) btnLimpiarFirma.style.opacity = "1";
  }

  // 5. Enviar los datos a Google Sheets
  if (typeof SCRIPT_URL !== "undefined" && pendingPayload) {
    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(pendingPayload)
    }).catch(err => console.error("Error en Sheets:", err));
  }

  // 6. Finalizar
  if (typeof incrementReceiptNumber === "function") incrementReceiptNumber();
  if (typeof closeConfirm === "function") closeConfirm();
  
  const successMsg = document.getElementById("successMessage");
  if (successMsg) successMsg.style.display = "flex";
  if (typeof startFireworks === "function") startFireworks();

  if (confirmBtn) {
    confirmBtn.disabled = false;
    confirmBtn.textContent = "CONFIRMAR Y ENVIAR";
  }
  pendingPayload = null;
}
/* =====================================================
   CERRAR MENSAJE
===================================================== */
function closeSuccess() {
  stopFireworks();
  document.getElementById("successMessage").style.display = "none";
  document.getElementById("fuelForm").reset();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasSignature = false;
  placeholder.style.display = "block";
}
