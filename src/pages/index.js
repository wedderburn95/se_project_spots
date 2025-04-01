import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableBtn,
} from "../scripts/validation.js";
import "../pages/index.css";
import Api from "../utils/api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "d12f4ca0-7155-425d-8a55-a0bff7fa72d3",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    //Handle the user's information
    // - set the src of the avatar image
    document.querySelector(".profile__avatar").src = userInfo.avatar;
    // - set the text content of both the name and description
    document.querySelector(".profile__name").textContent = userInfo.name;
    document.querySelector(".profile__description").textContent =
      userInfo.about;
    // - set the user id
    api._userId = userInfo._id;
    console.log("Cards received from API:", cards); // Debugging

    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      console.log("Appending Card:", cardEl); // Debugging
      cardsList.append(cardEl);
    });
    // - return the user data and the cards data
    return { userInfo, cards };
  })
  .catch(console.error);

//Profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
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

//Select the avatar button
// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarAddButton = document.querySelector(".profile__avatar-edit-button");

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

  //if the card is liked, we want to make it look liked, by adding the correct class to the like button
  if (data.likes.some((user) => user._id === api._userId)) {
    cardLikedBtn.classList.add("card__like-button_liked");
  }

  function handleLikeCard(evt, id) {
    const likeButton = evt.target;
    const isLiked = likeButton.classList.contains("card__like-button_liked");

    api
      .handleLike(id, isLiked)
      .then((updatedCard) => {
        likeButton.classList.toggle("card__like-button_liked");
      })
      .catch((err) => {
        console.error("Error updating like:", err);
      });
  }

  //assign  value to the name
  cardNameEL.textContent = data.name;

  //assign  values to the image src and alt
  cardImage.src = data.link;
  cardImage.alt = data.name;

  //add the event listener
  cardLikedBtn.addEventListener("click", (evt) =>
    handleLikeCard(evt, data._id)
  );

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

// function handleCardSubmit(evt) {
//   evt.preventDefault();

//   const inputValues = {
//     name: cardNameInput.value,
//     link: cardLinkInput.value,
//   };
//   const cardElement = getCardElement(inputValues);
//   cardsList.prepend(cardElement);

//   cardForm.reset();
//   disableBtn(cardSubmitBtn, validationConfig);
//   closeModal(cardModal);
// }

// ToDo: add the api call to create a new card
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api
    .editAvatar({ avatar: avatarForm.querySelector("#avatar-link").value })
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      closeModal(avatarModal);
    });
  api
    .editAvatar({ avatar: avatarForm.querySelector("#avatar-link").value })
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      closeModal(avatarModal);
    });
}

//ToDo: call the addCard method from the api class
function handleAddCardSubmit(evt) {
  evt.preventDefault(); // Prevent the default form submission behavior
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
    });
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
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
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove(); // Remove the card element from the DOM
      closeModal(deleteModalBtn); // Close the delete confirmation modal
    })
    .catch(console.error);
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

editProfileModalCloseButton.addEventListener("click", () => {
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

editFormElement.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(validationConfig);
