const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  // errorClass: "modal__error_visible",
};

//The showInputError will display any errors under the input because the span ID's all have the name of the input plus "-error"
const showInputError = (formEl, inputEl, errorMsg) => {
  console.log(errorMsg);
  const errorMsgEl = document.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add(settings.inputErrorClass);
  //config.inputErrorClass
  // errorMsgEl.classList.add("");
};

const hideInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.remove(settings.inputErrorClass);
  //config.inputErrorClass
};

function checkInputValidity(formEl, inputEl) {
  // console.log(inputEl.validationMessage);
  if (!inputEl.validity.valid) {
    //The error message was not showing because enableValidationMessage is not a built-in property
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  console.log(hasInvalidInput(inputList));
  if (hasInvalidInput(inputList)) {
    disableBtn(buttonElement);
    // buttonElement.classList.add("button_disabled");
  } else {
    buttonElement.disabled = false;
    //remove the disabled class
    buttonElement.classList.remove("button_disabled");
  }
};

const disableBtn = (buttonElement) => {
  buttonElement.disabled = true;
  //Add a modifier class to the buttnEl to make it grey
  //Don't forget the CSS
};

const resetValidation = (formEl, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input);
  });
};

//TODO - use the settings object in all functions instead of hard-coded strings

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  // TODO - handle initial states
  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", function () {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

//The enableValidation code  block grabs all of the forms in HTML
const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
