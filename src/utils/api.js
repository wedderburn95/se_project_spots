// utils/Api.js

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    // constructor body
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()])
      .then(([userInfo, cards]) => {
        // console.log("Cards:", cards); // Debugging
        if (!Array.isArray(cards)) {
          console.error("Expected an array but received:", cards);
          return;
        }

        return [userInfo, cards];
      })
      .catch(console.error);
  }

  getInitialCards() {
    console.log("Fetching initial cards...");
    return (
      fetch(`${this._baseUrl}/cards`, {
        headers: this._headers,
      })
        .then((res) => {
          // console.log("Raw response:", res);
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(`Error: ${res.status}`);
        })
        // .then((data) => {
        //   // console.log("Cards received:", data);
        //   console.log("Cards received (should be array):", Array.isArray(data));
        //   return data;
        // })
        .catch((err) => console.error("API error:", err))
    );
  }

  getUserInfo() {
    console.log("Fetching user info...");
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
      return Promise.reject(`Error: ${res.status}`);
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
      return Promise.reject(`Error: ${res.status}`);
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
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  // add a method to like or unlike a card
  handleLike(id, isLiked) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: !isLiked ? "PUT" : "DELETE",
      headers: this._headers,
    }).then((res) => {
      // handle the response
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  // add a method to remove a like from a card
}

// other methods for working with the API

// export the class
export default Api;
