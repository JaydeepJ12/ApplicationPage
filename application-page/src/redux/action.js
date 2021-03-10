import * as actions from "./actionType";

export const actionData = (content, type) => ({
  type: type,
  payload: {
    content,
  },
});

export const applicationList = (content) => ({
  type: actions.APPLICATION_LIST,
  payload: {
    content,
  },
});

export const applicationElements = (content) => ({
  type: actions.APPLICATION_ELEMENTS,
  payload: {
    content,
  },
});

export const themeColor = (content) => ({
  type: actions.THEME_COLOR,
  payload: {
    content,
  },
});

export const isLoginPage = (content) => ({
  type: actions.IS_LOGIN_PAGE,
  payload: {
    content,
  },
});
