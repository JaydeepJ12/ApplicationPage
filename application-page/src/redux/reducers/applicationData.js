const initialSate = {
  caseTypes: [],
  isCaseTypesAvailable: false,
  appId: 0,
  isPageNotFound: false,
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
    case "CASE_TYPE_PROPERTY": {
      const { content } = action.payload;
      return {
        ...state,
        isCaseTypesAvailable: content,
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
    default:
      return state;
  }
}
