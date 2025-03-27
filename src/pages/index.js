import { enableValidation, validationConfig } from "../scripts/validation.js";
import "../pages/index.css";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "cd8e53f5-8bcb-4168-b603-8951dec3b757",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    console.log("User Info:", userInfo);
    console.log("Cards:", cards);
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-button");

const editProfileModal = document.querySelector("#modal-edit-profile");

const editProfileModalCloseButton =
  editProfileModal.querySelector(".modal__close-btn");

//find the form element
const editFormElement = editProfileModal.querySelector(".modal__form");
// find the name element
const nameElement = document.querySelector(".profile__name");
// find the title element
const descriptionElement = document.querySelector(".profile__description");
//find the form inoput

// find the name input element
const nameInputElement = editProfileModal.querySelector("#profile-name-input");

// find the title input element
const descriptionInputElement = editProfileModal.querySelector(
  "#profile-description-input"
);

//Edit button
const cardModal = document.querySelector("#add-card-modal");
// Setup another form element
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const profileAddButton = document.querySelector(".profile__add-button");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardNameInput = cardModal.querySelector("#add-card-name-input");

//Select the modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

//To set the template element
const cardTemplate = document.querySelector("#card-template");
// console.log(cardTemplate)

//Create a function to call the card list
const cardsList = document.querySelector(".cards__list");

//Functions
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEL = cardElement.querySelector(".card__title");

  //Select the image class and it's elements
  const cardImage = cardElement.querySelector(".card__image");

  //select the card like button element
  const cardLikedBtn = cardElement.querySelector(".card__like-button");
  const deleteCardBtn = cardElement.querySelector(".card__delete-button");

  //assign  value to the name
  cardNameEL.textContent = data.name;

  //assign  values to the image src and alt
  cardImage.src = data.link;
  cardImage.alt = data.name;

  //add the event listener
  cardLikedBtn.addEventListener("click", () => {
    cardLikedBtn.classList.toggle("card__like-button_liked");
  });
  deleteCardBtn.addEventListener("click", handleDeleteCard);

  //add event listener for the card image
  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaption.textContent = data.name;
  });
  return cardElement;
}

previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function openModal(modal) {
  modal.classList.add("modal_opened");
  // Add event listener to close modal on Escape key
  document.addEventListener("keydown", closeOnEscape);
  modal.addEventListener("mousedown", closeOnOverlay);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  // Remove event listener when modal is closed
  document.removeEventListener("keydown", closeOnEscape);
  modal.removeEventListener("mousedown", closeOnOverlay);
}

function closeOnEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function closeOnOverlay(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function handleCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);

  cardForm.reset();
  disableBtn(cardSubmitBtn, settings);
  closeModal(cardModal);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  nameElement.textContent = nameInputElement.value;
  descriptionElement.textContent = descriptionInputElement.value;

  closeModal(editProfileModal);
}
function handleDeleteCard(evt) {
  evt.target.closest(".card").remove();
}

profileEditButton.addEventListener("click", () => {
  nameInputElement.value = nameElement.textContent;
  descriptionInputElement.value = descriptionElement.textContent;
  resetValidation(
    editFormElement,
    [nameInputElement, descriptionInputElement],
    settings
  );
  openModal(editProfileModal);
});

editProfileModalCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

profileAddButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

editFormElement.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardSubmit);

enableValidation(validationConfig);
