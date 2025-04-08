export const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  // errorClass: "modal__error_visible",
};

//The showInputError will display any errors under the input because the span ID's all have the name of the input plus "-error"
const showInputError = (formEl, inputEl, errorMsg, config) => {
  console.log(errorMsg);
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add(config.inputErrorClass);
  //config.inputErrorClass
  // errorMsgEl.classList.add("");
};

const hideInputError = (formEl, inputEl, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  console.log(config);
  inputEl.classList.remove(config.inputErrorClass);
  //config.inputErrorClass
};

function checkInputValidity(formEl, inputEl, config) {
  // console.log(inputEl.validationMessage);
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    // console.log(input);
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, config) => {
  // console.log(hasInvalidInput(inputList));
  if (hasInvalidInput(inputList)) {
    disableBtn(buttonElement, config);
  } else {
    buttonElement.disabled = false;
    //remove the disabled class

    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

export const disableBtn = (buttonElement, config) => {
  // console.log("is this firing");
  buttonElement.disabled = true;
  //Add a modifier class to the buttnEl to make it grey
  //Don't forget the CSS
  buttonElement.classList.add(config.inactiveButtonClass);
};

export const resetValidation = (formEl, inputList, config) => {
  // console.log("resetValidation config:", config);
  inputList.forEach((input) => {
    hideInputError(formEl, input, config);
  });
};

//TODO - use the settings object in all functions instead of hard-coded strings

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  // TODO - handle initial states
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", function () {
      // console.log(formEl, inputEl, config);
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

//The enableValidation code  block grabs all of the forms in HTML
export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(validationConfig);
