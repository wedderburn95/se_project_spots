import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableBtn,
} from "../scripts/validation.js";
import "../pages/index.css";
import Api from "../utils/api.js";
import { setButtonText } from "../utils/helper.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "0461a93f-e4a4-4710-9671-530f1a6885c6",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    //Handle the user's information
    // - set the src of the avatar image
    profileAvatar.src = userInfo.avatar;
    // - set the text content of both the name and description
    nameElement.textContent = userInfo.name;
    descriptionElement.textContent = userInfo.about;
    // - set the user id
    api._userId = userInfo._id;

    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });
    // - return the user data and the cards data
    return { userInfo, cards };
  })
  .catch((err) => {
    console.error("Error fetching app info:", err);
    // Show an error popup or alert (if applicable)
  });

//Profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editProfileModal = document.querySelector("#modal-edit-profile");
const editProfileModalCloseButton =
  editProfileModal.querySelector(".modal__close-btn");
const profileAvatar = document.querySelector(".profile__avatar");
// console.log(profileAvatar);

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

// Store card element and uniique card  id
let selectedCard;
let selectedCardId;

//Edit button
const cardModal = document.querySelector("#add-card-modal");

// Setup another form element
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const profileAddButton = document.querySelector(".profile__add-button");

//Select the modal delete button
const deleteModalBtn = document.querySelector("#delete-modal");
const deleteForm = deleteModalBtn.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModalBtn.querySelector(".modal__close-btn");

//Select the avatar button
// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarAddButton = document.querySelector(".profile__avatar-edit-button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

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
  console.log(data);
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
  //check if the card is liked or not

  //assign  values to the image src and alt
  cardImage.src = data.link;
  cardImage.alt = data.name;

  // Safely retrieve and parse liked cards from localStorage
  let likedCards = {};

  // try {
  //   likedCards = JSON.parse(localStorage.getItem("likedCards")) || {};
  // } catch (error) {
  //   console.error("Error parsing likedCards from localStorage:", error);
  //   localStorage.setItem("likedCards", JSON.stringify({})); // Reset storage
  // }

  // Apply liked state
  if (data.isLiked) {
    cardLikedBtn.classList.add("card__like-button_liked");
  }

  //add the event listener
  cardLikedBtn.addEventListener("click", (evt) => handleLikeCard(evt, data));
  deleteCardBtn.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
  });

  //add event listener for the card image
  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaption.textContent = data.name;
  });
  // console.log("Generated Card:", cardElement); // Debugging
  return cardElement;
}

function handleLikeCard(evt, data) {
  const isLiked = evt.target.classList.contains("card__like-button_liked");

  api
    .handleLike(data._id, isLiked)
    .then((newCard) => {
      evt.target.classList.toggle("card__like-button_liked");
    })
    .catch((err) => {
      console.error("Error updating like:", err);
    });
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

// ToDo: add the api call to create a new card
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Saving...", "Save");
  api

    .editAvatar({
      avatar: avatarInput.value,
    })
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      closeModal(avatarModal);
    })

    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Saving...", "Save");
    });
}

//ToDo: call the addCard method from the api class
function handleAddCardSubmit(evt) {
  evt.preventDefault(); // Prevent the default form submission behavior
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Saving...", "Save");
  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  api
    .addCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      cardForm.reset(); // Reset the form fields
      disableBtn(cardSubmitBtn, validationConfig); // Disable the submit button
      closeModal(cardModal); // Close the modal
    })
    .catch((err) => {
      console.error(err); // Handle any errors that occur during the API call
    })
    .finally(() => {
      setButtonText(submitBtn, false, "Saving...", "Save");
    });
}

// ToDo: implement loading text for all other form submissions

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  // change text content to "Saving..." using setButtonText
  const submitBtn = evt.submitter; // Get the submit button
  setButtonText(submitBtn, true, "Saving...", "Save");

  api
    .editUserInfo({
      name: nameInputElement.value,
      about: descriptionInputElement.value,
    })
    .then((data) => {
      //ToDo use dtd argument instead of the input values
      nameElement.textContent = data.name;
      descriptionElement.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
      // Show an error popup or alert (if applicable)
    })
    .finally(() => {
      // use setButtonText to reset the button text
      setButtonText(submitBtn, false, "Saving...", "Save");
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Deleting...", "Delete");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove(); // Remove the card element from the DOM
      closeModal(deleteModalBtn); // Close the delete confirmation modal
    })
    .catch((err) => {
      console.error("Error deleting card:", err);
      // Show an error popup or alert (if applicable)
    })
    .finally(() => {
      // use setButtonText to reset the button text
      setButtonText(submitBtn, false, "Deleting...", "Delete");
    });
}

function handleDeleteCard(cardElement, cardId) {
  // Open the delete confirmation modal
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModalBtn);
}

profileEditButton.addEventListener("click", () => {
  console.log(profileEditButton);
  nameInputElement.value = nameElement.textContent;
  descriptionInputElement.value = descriptionElement.textContent;
  resetValidation(
    editFormElement,
    [nameInputElement, descriptionInputElement],
    validationConfig
  );
  openModal(editProfileModal);
});

const modalCancelBtn = document.querySelector(
  "#delete-modal .modal__cancel-btn"
);

// Select the modal and close button for the "New Post" modal
const addCardModalCloseBtn = cardModal.querySelector(".modal__close-btn");

// Add event listener to close the "New Post" modal when the close button is clicked
addCardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

modalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModalBtn);
});

editProfileModalCloseButton.addEventListener("click", () => {
  console.log("Close button clicked!");
  closeModal(editProfileModal);
});

profileAddButton.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModalBtn);
});

editFormElement.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(validationConfig);
