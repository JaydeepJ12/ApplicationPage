import * as actions from "../actionType";

const initialSate = {
  caseTypes: [],
  isCaseTypesAvailable: false,
  appId: 0,
  isPageNotFound: false,
  applicationList: [],
  applicationName: "",
  isErrorPage: false,
  errorPageMessage: ""
};
export default function (state = initialSate, action) {
  switch (action.type) {
    case "CASE_TYPE": {
      const { content } = action.payload;
      return {
        ...state,
        caseTypes: content,
      };
    }
    case "APP_ID": {
      const { content } = action.payload;
      return {
        ...state,
        appId: content,
      };
    }
    case "PAGE_NOT_FOUND": {
      const { content } = action.payload;
      return {
        ...state,
        isPageNotFound: content,
      };
    }
    case "ERROR_PAGE": {
      const { content } = action.payload;
      return {
        ...state,
        isErrorPage: content,
      };
    }
    case "ERROR_PAGE_MESSAGE": {
      const { content } = action.payload;
      return {
        ...state,
        errorPageMessage: content,
      };
    }
    case actions.APPLICATION_LIST: {
      const { content } = action.payload;
      return {
        ...state,
        applicationList: content,
      };
    }
    case actions.APPLICATION_NAME: {
      const { content } = action.payload;
      return {
        ...state,
        applicationName: content,
      };
    }
    default:
      return state;
  }
}
