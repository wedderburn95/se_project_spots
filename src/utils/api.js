// utils/Api.js

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    // constructor body
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
    // .then(([userInfo, cards]) => {
    //   // console.log("Cards:", cards); // Debugging
    //   cards.forEach((item) => {
    //     const cardEl = getCardElement(item);
    //     console.log("Generated Card:", cardEl); // Debugging
    //     cardsList.append(cardEl);
    //   });
    // })
    // .catch(console.error);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    })
      .then((res) => {
        console.log("Raw response:", res);
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
      })
      .then((data) => {
        console.log("Cards received:", data);
        return data;
      })
      .catch((err) => console.error("API error:", err));
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  // add a method to add a new card
  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      //Send the data in the body as a JSON string.
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => {
      // handle the response
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`); // return a rejected promise
    });
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      // handle the response
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`); // return a rejected promise
    });
  }

  // add a method to edit the avatar
  editAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => {
      // handle the response
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`); // return a rejected promise
    });
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => {
      // handle the response
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`); // return a rejected promise
    });
  }
}

// other methods for working with the API

// export the class
export default Api;
