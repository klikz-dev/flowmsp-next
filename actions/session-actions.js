import * as types from "./types";

export function loginSuccess(authData) {
  return { type: types.LOG_IN_SUCCESS };
}

export function logoutUser() {
  sessionStorage.clear();
  return { type: types.LOG_OUT };
}

export function loginError(errMsg) {
  return { type: types.INVALID_CREDENTIAL, errMsg: errMsg };
}
