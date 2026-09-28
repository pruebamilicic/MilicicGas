/* =====================================================
   DESPLEGABLES PERSONALIZADOS
   CENTRO DE COSTO + CARGO
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

const cargoList = [
  "ALANDAVIDEA",
  "ALVAREZ",
  "BARTOLOMEO",
  "CAPPE",
  "CCARRIL",
  "CRISTIAN",
  "DARIO FLORES",
  "DAVID M",
  "FABRICIO FUNES",
  "FDEICAS",
  "JAVIER",
  "JAVIER.DICEV.",
  "JBARTOLOMEO",
  "JDICEVICUIS",
  "JMORENO",
  "JOEL BARTOLOMEO",
  "JUAN MORENO",
  "LBARTON",
  "LEZCANO",
  "LMANSILLA",
  "LNASUTI",
  "MPANIAGUA",
  "PANIAGUA M",
  "RENTAL",
  "ROBLEDO",
  "TECNICO",
  "TOMAS"
];


/* =====================================================
   ELEMENTOS
===================================================== */

const costCenterInput = document.getElementById("costCenter");
const costCenterDropdown = document.getElementById("costCenterDropdown");
const costCenterWrapper = document.getElementById("costCenterWrapper");
const toggleCostCenterBtn = document.getElementById("toggleCostCenterList");

const positionInput = document.getElementById("position");
const cargoDropdown = document.getElementById("cargoDropdown");
const cargoWrapper = document.getElementById("cargoWrapper");
const toggleCargoBtn = document.getElementById("toggleCargoList");


/* =====================================================
   CERRAR TODOS LOS DROPDOWNS
===================================================== */

function closeAllDropdowns() {

  if (costCenterDropdown) {
    costCenterDropdown.classList.remove("show");
  }

  if (costCenterWrapper) {
    costCenterWrapper.classList.remove("open");
  }

  if (cargoDropdown) {
    cargoDropdown.classList.remove("show");
  }

  if (cargoWrapper) {
    cargoWrapper.classList.remove("open");
  }
}


/* =====================================================
   CENTRO DE COSTO
===================================================== */

function populateCostCenterDropdown(filter = "") {

  if (!costCenterDropdown) return;

  costCenterDropdown.innerHTML = "";

  const filterLower = filter.toLowerCase().trim();

  const filtered = costCenterList.filter(name =>
    name.toLowerCase().includes(filterLower)
  );

  if (filtered.length === 0) {

    const emptyLi = document.createElement("li");

    emptyLi.className = "dropdown-empty";
    emptyLi.textContent =
      "Sin coincidencias (se guardará lo escrito)";

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


function openCostCenterDropdown() {

  if (!costCenterWrapper || !costCenterDropdown) return;

  // IMPORTANTE:
  // cerrar Cargo antes de abrir Centro de Costo
  closeCargoDropdown();

  costCenterWrapper.classList.add("open");
  costCenterDropdown.classList.add("show");

  populateCostCenterDropdown(
    costCenterInput ? costCenterInput.value : ""
  );
}


function closeCostCenterDropdown() {

  if (costCenterWrapper) {
    costCenterWrapper.classList.remove("open");
  }

  if (costCenterDropdown) {
    costCenterDropdown.classList.remove("show");
  }
}


/* =====================================================
   EVENTOS CENTRO DE COSTO
===================================================== */

if (costCenterInput) {

  populateCostCenterDropdown();

  costCenterInput.addEventListener(
    "focus",
    openCostCenterDropdown
  );

  costCenterInput.addEventListener(
    "input",
    function() {

      openCostCenterDropdown();

      populateCostCenterDropdown(this.value);
    }
  );
}


if (toggleCostCenterBtn) {

  toggleCostCenterBtn.addEventListener(
    "click",
    function(e) {

      e.stopPropagation();

      if (
        costCenterDropdown &&
        costCenterDropdown.classList.contains("show")
      ) {

        closeCostCenterDropdown();

      } else {

        openCostCenterDropdown();
      }
    }
  );
}


/* =====================================================
   CARGO
===================================================== */

function populateCargoDropdown(filter = "") {

  if (!cargoDropdown) return;

  cargoDropdown.innerHTML = "";

  const filterLower = filter.toLowerCase().trim();

  const filtered = cargoList.filter(name =>
    name.toLowerCase().includes(filterLower)
  );

  if (filtered.length === 0) {

    const emptyLi = document.createElement("li");

    emptyLi.className = "dropdown-empty";
    emptyLi.textContent =
      "Sin coincidencias (se guardará lo escrito)";

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


function openCargoDropdown() {

  if (!cargoWrapper || !cargoDropdown) return;

  // IMPORTANTE:
  // cerrar Centro de Costo antes de abrir Cargo
  closeCostCenterDropdown();

  cargoWrapper.classList.add("open");
  cargoDropdown.classList.add("show");

  populateCargoDropdown(
    positionInput ? positionInput.value : ""
  );
}


function closeCargoDropdown() {

  if (cargoWrapper) {
    cargoWrapper.classList.remove("open");
  }

  if (cargoDropdown) {
    cargoDropdown.classList.remove("show");
  }
}


/* =====================================================
   EVENTOS CARGO
===================================================== */

if (positionInput) {

  populateCargoDropdown();

  positionInput.addEventListener(
    "focus",
    openCargoDropdown
  );

  positionInput.addEventListener(
    "input",
    function() {

      openCargoDropdown();

      populateCargoDropdown(this.value);
    }
  );
}


if (toggleCargoBtn) {

  toggleCargoBtn.addEventListener(
    "click",
    function(e) {

      e.stopPropagation();

      if (
        cargoDropdown &&
        cargoDropdown.classList.contains("show")
      ) {

        closeCargoDropdown();

      } else {

        openCargoDropdown();
      }
    }
  );
}


/* =====================================================
   CERRAR AL HACER CLICK AFUERA
===================================================== */

document.addEventListener("click", function(e) {

  if (
    costCenterWrapper &&
    !costCenterWrapper.contains(e.target)
  ) {
    closeCostCenterDropdown();
  }

  if (
    cargoWrapper &&
    !cargoWrapper.contains(e.target)
  ) {
    closeCargoDropdown();
  }

});
