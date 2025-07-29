// Weight Converter JavaScript
// Get DOM elements
const weightInput = document.getElementById("weight");
const fromUnitSelect = document.getElementById("from-unit");
const toUnitSelect = document.getElementById("to-unit");
const convertBtn = document.getElementById("convert-btn");
const clearBtn = document.getElementById("clear-btn");
const toggleModeBtn = document.getElementById("toggle-mode");
const swapUnitsBtn = document.getElementById("swap-units");
const resultContainer = document.getElementById("result-container");
const resultValue = document.getElementById("result-value");
const resultFormula = document.getElementById("result-formula");

// Conversion rates to kg (base unit)
const conversionRates = {
  kg: 1,
  g: 0.001,
  lb: 0.45359237,
  oz: 0.0283495231,
};

// Unit display names
const unitNames = {
  kg: "kilograms",
  g: "grams",
  lb: "pounds",
  oz: "ounces",
};

// Conversion formulas for display
const conversionFormulas = {
  "kg-g": "1 kg = 1000 g",
  "kg-lb": "1 kg ≈ 2.20462 lb",
  "kg-oz": "1 kg ≈ 35.274 oz",
  "g-kg": "1000 g = 1 kg",
  "g-lb": "1 g ≈ 0.00220462 lb",
  "g-oz": "1 g ≈ 0.035274 oz",
  "lb-kg": "1 lb ≈ 0.453592 kg",
  "lb-g": "1 lb ≈ 453.592 g",
  "lb-oz": "1 lb = 16 oz",
  "oz-kg": "1 oz ≈ 0.0283495 kg",
  "oz-g": "1 oz ≈ 28.3495 g",
  "oz-lb": "16 oz = 1 lb",
};

// Convert weight
function convertWeight() {
  const weight = parseFloat(weightInput.value);
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;

  // Validate input
  if (isNaN(weight) || weight < 0) {
    alert("Please enter a valid positive number");
    return;
  }

  // Convert to kg first (base unit), then to target unit
  const weightInKg = weight * conversionRates[fromUnit];
  const convertedWeight = weightInKg / conversionRates[toUnit];

  // Round to 4 decimal places
  const roundedWeight = Math.round(convertedWeight * 10000) / 10000;

  // Display result
  resultValue.textContent = `${roundedWeight} ${toUnit}`;
  resultFormula.textContent = `Formula: ${
    conversionFormulas[`${fromUnit}-${toUnit}`]
  }`;

  // Show result with animation
  resultContainer.classList.add("show");
}

// Clear all fields
function clearFields() {
  weightInput.value = "";
  resultContainer.classList.remove("show");
  setTimeout(() => {
    resultValue.textContent = "0";
    resultFormula.textContent = "";
  }, 300);
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Swap units
function swapUnits() {
  const temp = fromUnitSelect.value;
  fromUnitSelect.value = toUnitSelect.value;
  toUnitSelect.value = temp;

  // If there's a value, convert immediately
  if (weightInput.value) {
    convertWeight();
  }
}

// Live conversion as user types
function liveConvert() {
  if (weightInput.value) {
    convertWeight();
  } else {
    resultContainer.classList.remove("show");
  }
}

// Event listeners
convertBtn.addEventListener("click", convertWeight);
clearBtn.addEventListener("click", clearFields);
toggleModeBtn.addEventListener("click", toggleDarkMode);
swapUnitsBtn.addEventListener("click", swapUnits);
weightInput.addEventListener("input", liveConvert);
fromUnitSelect.addEventListener("change", liveConvert);
toUnitSelect.addEventListener("change", liveConvert);

// Handle Enter key
weightInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    convertWeight();
  }
});
