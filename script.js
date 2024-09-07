let selectedPlan = '';
let selectedBillingCycle = 'monthly';
let selectedAddons = [];
const planPrices = {
  'Arcade': { monthly: 9, yearly: 90 },
  'Advanced': { monthly: 12, yearly: 120 },
  'Pro': { monthly: 15, yearly: 150 }
};

// Handle plan selection and update the summary
document.querySelectorAll('.plan-option').forEach(option => {
  option.addEventListener('click', function () {
    document.querySelectorAll('.plan-option').forEach(plan => plan.classList.remove('selected'));
    this.classList.add('selected');
    
    selectedPlan = this.querySelector('h3').textContent;
    updateSummary();
  });
});

// Handle billing cycle toggle and update the price display
function toggleBilling() {
  selectedBillingCycle = document.getElementById('billing-switch').checked ? 'yearly' : 'monthly';
  updateSummary();
  
  const isYearly = selectedBillingCycle === 'yearly';
  updatePriceDisplay(isYearly);
  updateAddonPrices(isYearly);
}

// Update the price display for plan options
function updatePriceDisplay(isYearly) {
  document.querySelectorAll('.plan-option').forEach(plan => {
    const monthly = plan.querySelector('.monthly');
    const yearly = plan.querySelector('.yearly');
    const freeMonths = plan.querySelector('.free-months');
    
    if (isYearly) {
      monthly.style.display = 'none';
      yearly.style.display = 'block';
      freeMonths.style.display = 'block';
    } else {
      monthly.style.display = 'block';
      yearly.style.display = 'none';
      freeMonths.style.display = 'none';
    }
  });
}

// Collect selected add-ons and update the summary
document.querySelectorAll('.addon-option input').forEach(addon => {
  addon.addEventListener('change', function () {
    const addonName = this.value;
    const addonPrice = parseFloat(this.getAttribute(`data-${selectedBillingCycle}`));
    
    if (this.checked) {
      selectedAddons.push({ name: addonName, price: addonPrice });
    } else {
      selectedAddons = selectedAddons.filter(add => add.name !== addonName);
    }
    updateSummary();
  });
});

// Update add-on prices based on the billing cycle
function updateAddonPrices(isYearly) {
  document.querySelectorAll('.addon-option').forEach(addon => {
    const monthlyPrice = addon.querySelector('input').getAttribute('data-monthly');
    const yearlyPrice = addon.querySelector('input').getAttribute('data-yearly');
    const priceDisplay = addon.querySelector('.price');
    
    priceDisplay.textContent = isYearly ? `+$${yearlyPrice}/yr` : `+$${monthlyPrice}/mo`;
  });
}

// Update the summary section in Step 4
function updateSummary() {
  const planPrice = planPrices[selectedPlan]?.[selectedBillingCycle] || 0;
  let addonsTotal = 0;
  let addonsSummaryHTML = '';

  selectedAddons.forEach(addon => {
    addonsTotal += addon.price;
    addonsSummaryHTML += `<p>${addon.name} : +$${addon.price}/${selectedBillingCycle === 'monthly' ? 'mo' : 'yr'}</p>`;
  });

  const totalAmount = planPrice + addonsTotal;

  document.getElementById('plan-summary').innerHTML = `
    <p>${selectedPlan} (${selectedBillingCycle === 'monthly' ? 'Monthly' : 'Yearly'}) : 
    $${planPrice}/${selectedBillingCycle === 'monthly' ? 'mo' : 'yr'}</p>
  `;

  document.getElementById('addons-summary').innerHTML = addonsSummaryHTML;

  document.getElementById('total-amount').textContent = `$${totalAmount}`;
  document.getElementById('billing-period').textContent = selectedBillingCycle === 'monthly' ? 'month' : 'year';
}

// Validate Step 1 form
function validateStep1() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  
  if (!name || !email || !phone) {
    alert("Please fill in all fields");
    return false;
  }
  return true;
}

// Validate Step 2 form
function validateStep2() {
  if (!selectedPlan) {
    alert("Please select a plan");
    return false;
  }
  return true;
}

// Handle form submission and move to the thank you message (Step 5)
function submitForm() {
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  document.querySelectorAll('.form-step')[4].classList.add('active'); // Step 5 (Thank You)
}

// Show a specific step
function showStep(stepIndex) {
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  document.querySelectorAll('.form-step')[stepIndex].classList.add('active');
  
  // Update sidebar steps
  document.querySelectorAll('.sidebar .step').forEach((stepEl, index) => {
    if (index <= stepIndex) {
      stepEl.classList.add('active');
    } else {
      stepEl.classList.remove('active');
    }
  });

  document.querySelectorAll('.sidebar2 .step').forEach((stepEl, index) => {
    if (index <= stepIndex) {
      stepEl.classList.add('active');
    } else {
      stepEl.classList.remove('active');
    }
  });
}

// Move to the next step
function nextStep() {
  let currentStepIndex = Array.from(document.querySelectorAll('.form-step')).findIndex(step => step.classList.contains('active'));
  
  // Validate current step before proceeding
  if (currentStepIndex === 0 && !validateStep1()) return; // Validate Step 1
  if (currentStepIndex === 1 && !validateStep2()) return; // Validate Step 2
  
  showStep(currentStepIndex + 1);
}

// Move to the previous step
function prevStep() {
  let currentStepIndex = Array.from(document.querySelectorAll('.form-step')).findIndex(step => step.classList.contains('active'));
  showStep(currentStepIndex - 1);
}

// Redirect to the plan selection step (Step 2) when the "Change" button is clicked
function goToPlan() {
  showStep(1); // Redirect to Step 2 (Plan Selection)
}

// Allow the user to change the billing cycle in the summary
function changeBilling() {
  toggleBilling(); // Reuse the toggleBilling function to handle the change
}

// Initialize prices on load (for Step 3)
window.onload = function() {
  const isYearly = document.getElementById('billing-switch').checked;
  updateAddonPrices(isYearly);
  document.querySelectorAll('.step')[0].classList.add('active');
  showStep(0); // Show the first step by default
};
