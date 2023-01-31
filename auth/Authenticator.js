import React from "react";

class Authenticator {
  static loggedIn() {
    if (sessionStorage) {
      return !!sessionStorage?.jwt;
    } else {
      return false;
    }
  }

  static logout() {
    sessionStorage?.clear();
  }
}

export default Authenticator;
