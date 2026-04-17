const form = document.getElementById('intakeForm');
const reviewBtn = document.getElementById('reviewBtn');
const reviewContent = document.getElementById('reviewContent');
const salaryRange = document.getElementById('salaryRange');
const salaryOutput = document.getElementById('salaryOutput');
const userId = document.getElementById('userId');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

function formatMoney(value) {
  return '$' + Number(value).toLocaleString();
}

function updateSalary() {
  salaryOutput.textContent = formatMoney(salaryRange.value);
}

function showError(fieldId, message) {
  document.getElementById(fieldId + 'Error').textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(error => {
    error.textContent = '';
  });
}

function normalizeUserId() {
  userId.value = userId.value.toLowerCase();
}

function passwordHasUserInfo() {
  const userValue = userId.value.trim().toLowerCase();
  const firstName = document.getElementById('firstName').value.trim().toLowerCase();
  const lastName = document.getElementById('lastName').value.trim().toLowerCase();
  const passValue = password.value.toLowerCase();

  if (userValue && passValue.includes(userValue)) {
    return true;
  }
  if (firstName && passValue.includes(firstName)) {
    return true;
  }
  if (lastName && passValue.includes(lastName)) {
    return true;
  }
  return false;
}

function validateForm() {
  clearErrors();
  normalizeUserId();

  let valid = true;

  const fields = [
    'firstName', 'middleInitial', 'lastName', 'birthMonth', 'birthDay', 'birthYear',
    'memberId', 'email', 'phone', 'addr1', 'addr2', 'city', 'state', 'zip', 'userId',
    'password', 'password2'
  ];

  fields.forEach(id => {
    const field = document.getElementById(id);
    if (!field.checkValidity()) {
      valid = false;
      showError(id, field.validationMessage);
    }
  });

  if (password.value !== password2.value) {
    valid = false;
    showError('password2', 'Passwords do not match.');
  }

  if (passwordHasUserInfo()) {
    valid = false;
    showError('password', 'Password cannot contain your user ID, first name, or last name.');
  }

  const housingChecked = document.querySelector('input[name="housing"]:checked');
  if (!housingChecked) {
    valid = false;
    alert('Please choose an option for Housing.');
  }

  const vaccinatedChecked = document.querySelector('input[name="vaccinated"]:checked');
  if (!vaccinatedChecked) {
    valid = false;
    alert('Please choose an option for Vaccinated.');
  }

  const insuredChecked = document.querySelector('input[name="insured"]:checked');
  if (!insuredChecked) {
    valid = false;
    alert('Please choose an option for Insurance.');
  }

  return valid;
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(item => item.value);
}

function getRadioValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : 'Not selected';
}

function zipShortValue(zip) {
  return zip.slice(0, 5);
}

function buildReview() {
  const history = getCheckedValues('history');

  reviewContent.innerHTML = `
    <div class="review-group">
      <h3>Personal Information</h3>
      <div class="review-item"><span class="review-label">Full Name:</span> ${form.firstName.value} ${form.middleInitial.value} ${form.lastName.value}</div>
      <div class="review-item"><span class="review-label">Date of Birth:</span> ${form.birthMonth.value}/${form.birthDay.value}/${form.birthYear.value}</div>
      <div class="review-item"><span class="review-label">Patient ID:</span> Hidden for privacy</div>
    </div>

    <div class="review-group">
      <h3>Contact Information</h3>
      <div class="review-item"><span class="review-label">Email:</span> ${form.email.value}</div>
      <div class="review-item"><span class="review-label">Phone:</span> ${form.phone.value}</div>
    </div>

    <div class="review-group">
      <h3>Address</h3>
      <div class="review-item"><span class="review-label">Address Line 1:</span> ${form.addr1.value}</div>
      <div class="review-item"><span class="review-label">Address Line 2:</span> ${form.addr2.value || 'None entered'}</div>
      <div class="review-item"><span class="review-label">City:</span> ${form.city.value}</div>
      <div class="review-item"><span class="review-label">State:</span> ${form.state.value}</div>
      <div class="review-item"><span class="review-label">ZIP Code:</span> ${zipShortValue(form.zip.value)}</div>
    </div>

    <div class="review-group">
      <h3>Choices</h3>
      <div class="review-item"><span class="review-label">Medical History:</span> ${history.length ? history.join(', ') : 'None selected'}</div>
      <div class="review-item"><span class="review-label">Housing:</span> ${getRadioValue('housing')}</div>
      <div class="review-item"><span class="review-label">Vaccinated:</span> ${getRadioValue('vaccinated')}</div>
      <div class="review-item"><span class="review-label">Insurance:</span> ${getRadioValue('insured')}</div>
      <div class="review-item"><span class="review-label">Desired Salary:</span> ${formatMoney(form.salaryRange.value)}</div>
      <div class="review-item"><span class="review-label">Notes:</span> ${form.notes.value || 'No extra notes'}</div>
    </div>

    <div class="review-group">
      <h3>Account Information</h3>
      <div class="review-item"><span class="review-label">User ID:</span> ${form.userId.value}</div>
      <div class="review-item"><span class="review-label">Password:</span> Hidden for privacy</div>
    </div>
  `;
}

salaryRange.addEventListener('input', updateSalary);
userId.addEventListener('input', normalizeUserId);

reviewBtn.addEventListener('click', () => {
  if (validateForm()) {
    buildReview();
    alert('Your information is now shown in the review area.');
  } else {
    alert('Please fix the form errors before reviewing.');
  }
});

form.addEventListener('submit', event => {
  if (!validateForm()) {
    event.preventDefault();
    alert('Please correct the highlighted form problems before submitting.');
    return;
  }

  buildReview();
  alert('Form is ready to submit.');
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    clearErrors();
    reviewContent.innerHTML = '';
    updateSalary();
  }, 0);
});

updateSalary();
