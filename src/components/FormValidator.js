export class FormValidator {
  constructor(elementList, formElement, inputErrors) {
    this._formSelector = elementList.formSelector;
    this._inputSelector = elementList.inputSelector;
    this._submitButtonSelector = elementList.submitButtonSelector;
    this._inputErrorClass = elementList.inputErrorClass;
    this._errorClass = elementList.errorClass;
    this._formElement = formElement;
    this._inputList = Array.from(this._formElement.querySelectorAll(this._inputSelector));
    this._inputErrors = inputErrors;
  }

  _showError(input, errorType) {
    const closestErrorElement = input.closest('.user__input-container').querySelector('.user__input-error');
    const errorText = this._inputErrors.find(i => i.input === input.name && i.errorType === errorType).errorText;

    input.classList.add(this._inputErrorClass);
    closestErrorElement.classList.add(this._errorClass);
    closestErrorElement.textContent = errorText;
  }

  _hideError(input) {
    const closestErrorElement = input.closest('.user__input-container').querySelector('.user__input-error');

    input.classList.remove(this._inputErrorClass);
    closestErrorElement.classList.remove(this._errorClass);
    //closestErrorElement.textContent = '';
  }

  _checkEmailValidation(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  _checkPhoneValidation(phoneNumber) {
    const sanitizedPhoneNumber = phoneNumber.replace(/\s/g, '');
    const phoneMaskPattern = /^\+9\d{3}\d{3}\d{2}\d{2}$/;

    return phoneMaskPattern.test(sanitizedPhoneNumber);
  }

  _checkInnValidation(inn) {
    return inn.length === 14;
  }

  //validate specfic input
  _validateInput(inputName, data) {
    if (inputName === 'email') {
      return this._checkEmailValidation(data);
    } else if (inputName === 'phone') {
      return this._checkPhoneValidation(data);
    } else if (inputName === 'inn') {
      return this._checkInnValidation(data);
    } else {
      return true;
    }
  }

  //form phone number while typing
  _formatPhoneNumber(value) {
    const regex = /[^\d+()\-]/g;
    const numericValue = value.replace(regex, '').slice(0, 30);

    let formattedValue = '';

    for (let i = 0; i < numericValue.length; i++) {
      if (i === 2 || i === 5 || i === 8 || i === 10) {
        formattedValue = formattedValue + ' ' + numericValue[i];

      } else {
        formattedValue = formattedValue + numericValue[i];
      }
    }

    return formattedValue;
  }

  //form inn while typing
  _formanInn(value) {
    const digitsOnly = value.replace(/\D/g, '');
    const limitedValue = digitsOnly.slice(0, 14);

    value = limitedValue;

    return value;
  }

  _checkInputValidity(input, submit) {
    const inputIsValid = this._validateInput(input.name, input.value);

    if (input.value !== '') {
      input.labels[0].classList.add('user__label_filled');
    } else {
      input.labels[0].classList.remove('user__label_filled');
    }

    //if input is not filled and and user tries to submit form
    if ((input.value === '' && submit)) {
      this._showError(input, 'filling');
      return false;
    } else if (!inputIsValid && input.value !== '') {
      this._showError(input, 'validity');
      return false;
    } else {
      this._hideError(input);
      return true;
    }
  }

  //set listeners to all inputs
  _setInputListeners() {
    this._inputList.forEach((input) => {
      const eventType = input.classList.contains('user__input_error') ? 'input' : 'change';
      input.addEventListener(eventType, () => {
        this._checkInputValidity(input, false);
      });
    });
  }

  //set listeners from all inputs
  _removeInputListeners() {
    this._inputList.forEach((input) => {
      const eventType = input.classList.contains('user__input_error') ? 'input' : 'change';
      input.removeEventListener(eventType, () => {
        this._checkInputValidity(input, false);
      });
    });
  }

  //additional listeners: limit input while typing for phone and inn input
  _setAdditionalListeners() {

    const phoneInput = this._inputList.filter(input => input.name === 'phone')[0];
    const innInput = this._inputList.filter(input => input.name === 'inn')[0];

    //add +9 when phone input is focused
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) {
        phoneInput.value = '+9 ';
      }
    });

    //validate phone number while typing
    phoneInput.addEventListener('input', (event) => {
      const value = event.target.value;
      const formattedValue = this._formatPhoneNumber(value);
      event.target.value = formattedValue;
    });

    //remove '+9 ' when phone out of focus
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value === '+9 ') {
        phoneInput.value = '';
      }
    });

    //validate inn while typing
    innInput.addEventListener('input', () => {
      innInput.value = this._formanInn(innInput.value);
    });

  }

  //check all inputs in for are valid
  _checkFormValidity() {
    const validityData = [];
    this._inputList.forEach((input) => {
      const inputValidity = this._checkInputValidity(input, true);
      validityData.push({ input: input.name, validity: inputValidity });
    });
    return !validityData.some(i => !i.validity);
  }

  enableValidation() {
    this._formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      const formIsValid = this._checkFormValidity();

      if (!formIsValid) {
       this._removeInputListeners();
       this._setInputListeners();
      } else {
        console.log('Data saved')
      }
    });

    this._setAdditionalListeners();
    this._setInputListeners();
  };

}
