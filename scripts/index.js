const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-button");

const editProfileModal = document.querySelector("#modal-edit-profile");

const modalCloseButton = editProfileModal.querySelector(".modal__close-btn");

//find the form element
const editFormElement = editProfileModal.querySelector(".modal__form");
// find the name element
const nameElement = document.querySelector(".profile__name");
// find the title element
const titleElement = document.querySelector(".profile__description");
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
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardModalBtn = document.querySelector(".profile__add-button");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardNameInput = cardModal.querySelector("#add-card-name-input");

//Select the modal
const previewModal = document.querySelector("#preview-modal");
const previewModalEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

//To set the template element
const cardTemplate = document.querySelector("#card-template");
// console.log(cardTemplate)

//Create a function to call the card list
const cardsList = document.querySelector(".cards__list");

//Declare a getCardElement() function that accepts one parameter named data.
//Functions
function getCardelement(data) {
  //This function is to get the data from the Object initial Cards
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
    //write code that handles the event
    cardLikedBtn.classList.toggle("card__like-button_liked");
  });
  deleteCardBtn.addEventListener("click", handleDeleteCard);

  //add event listener for the card image
  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalEl.src = data.link;
    previewModalEl.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  //return the ready HTML element with the filled-in data
  return cardElement;
}

previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function openModal(modal) {
  // setvalue of name input to name element text content
  // nameInputElement.value = nameElement.textContent;

  // setvalue of title input to title element text content
  // descriptionInputElement.value = titleElement.textContent;

  //Add the Modal class(form popup)
  modal.classList.add("modal_opened");
}

//Remove the Modal class function(form popup)
function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleCardSubmit(evt) {
  evt.preventDefault();
  // console.log(cardLinkInput);
  // console.log(cardNameInput);
  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  const cardElement = getCardelement(inputValues);
  cardsList.prepend(cardElement);

  // closeModal(cardForm);

  closeModal(cardModal);
  cardForm.reset();
}

function handleFormSubmit(evt) {
  // Prevent default browser behavior
  evt.preventDefault();

  nameElement.textContent = nameInputElement.value;
  titleElement.textContent = descriptionInputElement.value;
  //Calling the remove the Modal class function(form popup)
  closeModal(editProfileModal);
}
function handleDeleteCard(evt) {
  evt.target.closest(".card").remove();
}

profileEditButton.addEventListener("click", () => {
  nameInputElement.value = nameElement.textContent;
  descriptionInputElement.value = titleElement.textContent;
  openModal(editProfileModal);
});

modalCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

editFormElement.addEventListener("submit", handleFormSubmit);
cardForm.addEventListener("submit", handleCardSubmit);

// for (i = 0; i < initialCards.length; i++) {
//   const cardElement = getCardelement(initialCards[i]);
//   //add to the DOM
//   cardsList.prepend(cardElement);
// }

initialCards.forEach((item) => {
  const cardElement = getCardelement(item);
  cardsList.append(cardElement);
});
