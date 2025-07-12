const topBar = document.querySelector('#top-bar');
const exteriorColorSection = document.querySelector('#exterior-buttons');
const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');
const interiorImage = document.querySelector('#interior-image');
const wheelButtonsSection = document.querySelector('#wheel-buttons');
const performanceBtn = document.querySelector('#performance-btn');
const totalPriceElement = document.querySelector('#total-price');
const fullSelfDrivingCheckbox = document.querySelector(
  '#full-self-driving-checkbox'
);
const accessoryCheckboxes = document.querySelectorAll(
  '.accessory-form-checkbox'
);
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = 'Stealth Grey';
const selectedOptions = {
  'Performance Wheels': false,
  'Performance Package': false,
  'Full Self-Drving': false,
};

const pricing = {
  'Performance Wheels': 2500,
  'Performance Package': 5000,
  'Full Self-Driving': 8500,
  Accessories: {
    'Center Console Trays': 35,
    Sunshade: 105,
    'All-Weather Interior Liners': 225,
  },
};

// Update total price in the UI
const updateTotalPrice = () => {
  // Reset the current price to base price
  currentPrice = basePrice;

  // Performance Wheel Option
  if (selectedOptions['Performance Wheels']) {
    currentPrice += pricing['Performance Wheels'];
  }

  // Performance Package Option
  if (selectedOptions['Performance Package']) {
    currentPrice += pricing['Performance Package'];
  }

  // Full Self Driving Option
  if (selectedOptions['Full Self-Driving']) {
    currentPrice += pricing['Full Self-Driving'];
  }

  // Accessory Checkboxes
  accessoryCheckboxes.forEach((checkbox) => {
    // Extract the accessory label
    const accessoryLabel = checkbox
      .closest('label')
      .querySelector('span')
      .textContent.trim();

    const accessoryPrice = pricing['Accessories'][accessoryLabel];

    // Add to current price if accessory is selected
    if (checkbox.checked) {
      currentPrice += accessoryPrice;
    }
  });

  // Update the total price in UI
  totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;

  updatePaymentBreakdown();
};

// Update payment breakdown based on current price
const updatePaymentBreakdown = () => {
  // Calculate down payment
  const downPayment = currentPrice * 0.1;
  downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

  // Calculate loan details (assuming 60-month loan and 3% interest rate)
  const loanTermMonths = 60;
  const interestRate = 0.03;

  const loanAmount = currentPrice - downPayment;

  // Monthly payment formula: P * (r(1+r)^n) / ((1+r)^n - 1)
  const monthlyInterestRate = interestRate / 12;

  const monthlyPayment =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  monthlyPaymentElement.textContent = `$${monthlyPayment
    .toFixed(2)
    .toLocaleString()}`;
};

// Handle Top Bar On Scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle('visible-bar', atTop);
  topBar.classList.toggle('hidden-bar', !atTop);
};

// Image Mapping
const exteriorImages = {
  'Stealth Grey': './images/model-y-stealth-grey.jpg',
  'Pearl White': './images/model-y-pearl-white.jpg',
  'Deep Blue': './images/model-y-deep-blue-metallic.jpg',
  'Solid Black': './images/model-y-solid-black.jpg',
  'Ultra Red': './images/model-y-ultra-red.jpg',
  Quicksilver: './images/model-y-quicksilver.jpg',
};

const interiorImages = {
  Dark: './images/model-y-interior-dark.jpg',
  Light: './images/model-y-interior-light.jpg',
};

// Handle Color Selection
const handleColorButtonClick = (event) => {
  let button;

  if (event.target.tagName === 'IMG') {
    button = event.target.closest('button');
  } else if (event.target.tagName === 'BUTTON') {
    button = event.target;
  }

  if (button) {
    const buttons = event.currentTarget.querySelectorAll('button');
    buttons.forEach((btn) => btn.classList.remove('btn-selected'));
    button.classList.add('btn-selected');

    // Change exterior image
    if (event.currentTarget === exteriorColorSection) {
      selectedColor = button.querySelector('img').alt;
      updateExteriorImage();
    }

    // Change interior image
    if (event.currentTarget === interiorColorSection) {
      const color = button.querySelector('img').alt;
      interiorImage.src = interiorImages[color];
    }
  }
};

// Update exterior image based on color and wheels
const updateExteriorImage = () => {
  const performanceSuffix = selectedOptions['Performance Wheels']
    ? '-performance'
    : '';
  const colorKey =
    selectedColor in exteriorImages ? selectedColor : 'Stealth Grey';
  exteriorImage.src = exteriorImages[colorKey].replace(
    '.jpg',
    `${performanceSuffix}.jpg`
  );
};

// Wheel Selection
const handleWheelButtonClick = (event) => {
  if (event.target.tagName === 'BUTTON') {
    const buttons = document.querySelectorAll('#wheel-buttons button');
    buttons.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));

    // Add selected styles to clicked button
    event.target.classList.add('bg-gray-700', 'text-white');

    selectedOptions['Performance Wheels'] =
      event.target.textContent.includes('Performance');

    updateExteriorImage();

    updateTotalPrice();
  }
};

// Performance Package Selection
const handlePerformanceButtonClick = () => {
  const isSelected = performanceBtn.classList.toggle('bg-gray-700');
  performanceBtn.classList.toggle('text-white');

  // Update selected options
  selectedOptions['Performance Package'] = isSelected;

  updateTotalPrice();
};

// Full Self Driving Selection
const fullSelfDrivingChange = () => {
  selectedOptions['Full Self-Driving'] = fullSelfDrivingCheckbox.checked;
  updateTotalPrice();
};

// Handle Accessory Checkbox Listeners
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => updateTotalPrice());
});

// Initial Update Total Price
updateTotalPrice();

// Event Listeners
window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener('click', handleColorButtonClick);
interiorColorSection.addEventListener('click', handleColorButtonClick);
wheelButtonsSection.addEventListener('click', handleWheelButtonClick);
performanceBtn.addEventListener('click', handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener('change', fullSelfDrivingChange);


// ...existing code...

// --- Compare Modal Logic and Configuration Comparison ---

const compareBtn = document.getElementById('compare-btn');
const compareModal = document.getElementById('compare-modal');
const closeCompare = document.getElementById('close-compare');
const saveConfig = document.getElementById('save-config');
const currentConfigList = document.getElementById('current-config');
const savedConfigList = document.getElementById('saved-config');

if (
  compareBtn &&
  compareModal &&
  closeCompare &&
  saveConfig &&
  currentConfigList &&
  savedConfigList
) {
  compareBtn.onclick = function () {
    compareModal.classList.remove('hidden');
    updateComparison();
  };

  closeCompare.onclick = function () {
    compareModal.classList.add('hidden');
  };

  saveConfig.onclick = function () {
    localStorage.setItem('teslaSavedConfig', JSON.stringify(getCurrentConfig()));
    updateComparison();
  };

  function getCurrentConfig() {
    // Exterior
    const exteriorBtn = document.querySelector('#exterior-buttons .btn-selected img');
    const exterior = exteriorBtn ? exteriorBtn.alt : 'Not selected';

    // Interior
    const interiorBtn = document.querySelector('#interior-buttons .btn-selected img');
    const interior = interiorBtn ? interiorBtn.alt : 'Not selected';

    // Wheels
    let wheels = 'Standard Wheels';
    const wheelSelected = document.querySelector('#wheel-buttons .bg-gray-700, #wheel-buttons .bg-gray-600');
    if (wheelSelected) {
      wheels = wheelSelected.innerText.trim();
    }

    // Full Self-Driving
    const fsd = fullSelfDrivingCheckbox && fullSelfDrivingCheckbox.checked ? 'Yes' : 'No';

    // Performance
    const performance = performanceBtn && performanceBtn.classList.contains('bg-gray-700') ? 'Yes' : 'No';

    // Accessories
    const accessories = Array.from(document.querySelectorAll('.accessory-form-checkbox'))
      .map(cb => cb.checked ? cb.closest('label').querySelector('span').innerText.trim() : null)
      .filter(Boolean);

    // Price
    const price = totalPriceElement ? totalPriceElement.textContent : '';

    return {
      exterior,
      interior,
      wheels,
      fsd,
      performance,
      accessories,
      price
    };
  }

  function updateComparison() {
    const current = getCurrentConfig();
    const saved = JSON.parse(localStorage.getItem('teslaSavedConfig') || '{}');
    currentConfigList.innerHTML = `
      <li>Exterior: ${current.exterior}</li>
      <li>Interior: ${current.interior}</li>
      <li>Wheels: ${current.wheels}</li>
      <li>Full Self-Driving: ${current.fsd}</li>
      <li>Performance: ${current.performance}</li>
      <li>Accessories: ${current.accessories.length ? current.accessories.join(', ') : 'None'}</li>
      <li>Total Price: ${current.price}</li>
    `;
    savedConfigList.innerHTML = saved.exterior
      ? `
        <li>Exterior: ${saved.exterior}</li>
        <li>Interior: ${saved.interior}</li>
        <li>Wheels: ${saved.wheels}</li>
        <li>Full Self-Driving: ${saved.fsd}</li>
        <li>Performance: ${saved.performance}</li>
        <li>Accessories: ${saved.accessories && saved.accessories.length ? saved.accessories.join(', ') : 'None'}</li>
        <li>Total Price: ${saved.price}</li>
      `
      : '<li class="text-gray-400">No saved configuration yet.</li>';
  }
}
