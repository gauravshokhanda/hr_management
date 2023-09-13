// actions.js
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";

export const loginSuccess = (user, token) => {
  console.log("User object:", user);
  return {
    type: LOGIN_SUCCESS,
    payload: { user, token },
  };
};
export const logout = () => ({ type: LOGOUT });
