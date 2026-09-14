const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const confirmationDialog = document.querySelector('#confirmation-dialog');
const confirmationClose = document.querySelector('#confirmation-close');

if (form && status && confirmationDialog && confirmationClose) {
  let lastFocusedElement = null;

  const requiredFields = [
    { input: form.elements.name, error: document.querySelector('#name-error'), message: 'Please tell us your name.' },
    { input: form.elements.email, error: document.querySelector('#email-error'), message: 'Please enter a valid email address.' },
    { input: form.elements.brief, error: document.querySelector('#brief-error'), message: 'Please share a little about the project.' },
  ];

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstInvalidField = null;

    requiredFields.forEach(({ input, error, message }) => {
      const isEmail = input.type === 'email';
      const isValid = input.value.trim() && (!isEmail || input.validity.valid);
      input.setAttribute('aria-invalid', String(!isValid));
      error.textContent = isValid ? '' : message;

      if (!isValid && !firstInvalidField) {
        firstInvalidField = input;
      }
    });

    if (firstInvalidField) {
      firstInvalidField.focus();
      status.textContent = 'Please check the highlighted fields.';
      status.className = 'form-status form-status-error';
      return;
    }

    form.reset();
    requiredFields.forEach(({ input }) => input.removeAttribute('aria-invalid'));
    status.textContent = '';
    status.className = 'form-status';
    lastFocusedElement = document.activeElement;
    confirmationDialog.showModal();
    confirmationClose.focus();
  });

  const closeConfirmation = () => {
    confirmationDialog.close();
  };

  confirmationClose.addEventListener('click', closeConfirmation);
  confirmationDialog.addEventListener('close', () => {
    lastFocusedElement?.focus();
  });
  confirmationDialog.addEventListener('click', (event) => {
    if (event.target === confirmationDialog) {
      closeConfirmation();
    }
  });
}
