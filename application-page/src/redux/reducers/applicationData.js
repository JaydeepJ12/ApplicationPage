const initialSate = { caseTypes: [], isCaseTypesAvailable: false };
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
    default:
      return state;
  }
}
