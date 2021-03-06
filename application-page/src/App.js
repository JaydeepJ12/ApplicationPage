import { createMuiTheme } from "@material-ui/core";
import {
  createGenerateClassName,
  StylesProvider,
} from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { navigate } from "@reach/router";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import theme from "../src/components/theme";
import ErrorPage from "./components/common/error-page/error-page";
import PageNotFound from "./components/common/page-not-found/page-not-found";
import ReducerData from "./components/common/reducer-data.js";
import Navigation from "./components/header/navigation";
import { actionData } from "./redux/action";

const generateClassName = createGenerateClassName({
  productionPrefix: "c",
});
axios.defaults.baseURL = process.env.REACT_APP_AXIOS_PREFIX;

// This is an interceptor code. It will check response unauthorized or not on every API call.
axios.interceptors.response.use(
  function (response) {
    //Check response is unauthorized or not. If unauthorized then navigate to login.
    if (response?.status === 401) {
      localStorage.removeItem("token");
      navigate("login");
      return null;
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

{
  /* Your component tree.
      Now, you can override Material-UI's styles. */
}
const basePath = process.env.REACT_APP_BASE_PATH;

function App() {
  const reducerState = useSelector((state) => state);
  const [pageNotFound, setPageNotFound] = React.useState(false);
  const [isErrorPage, setIsErrorPage] = React.useState(false);
  const dispatch = useDispatch();

  const id_from_url = () => {
    let path = window.location.pathname;
    let split = path.split(basePath);
    let appId = 0;
    if (split && split[1]) {
      appId = split[1].split("/")[0];
    }

    //id should always be second from last rgardless of prefix
    return Number(appId);
  };

  const app_id = id_from_url();

  React.useEffect(() => {
    let isPageNotFound = reducerState.applicationData.isPageNotFound;
    let isErrorPage = reducerState.applicationData.isErrorPage;

    setIsErrorPage(isErrorPage);
    setPageNotFound(isPageNotFound);
    dispatch(actionData(app_id, "APP_ID"));
  }, [
    reducerState.applicationData.isPageNotFound,
    reducerState.applicationData.isErrorPage,
  ]);

  // for theme
  var color = reducerState.applicationData.themeColor
    ? reducerState.applicationData.themeColor
    : localStorage.getItem("themeColor");

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: color && color != "undefined" ? color : "#03DAC5",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ffffff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider generateClassName={generateClassName} injectFirst>
        <>
          {isErrorPage ? (
            <ErrorPage />
          ) : app_id && app_id > 0 && !pageNotFound ? (
            <div>
              <Navigation />
              <ReducerData></ReducerData>
            </div>
          ) : (
            <PageNotFound></PageNotFound>
          )}
        </>
      </StylesProvider>
    </ThemeProvider>
  );
}

export default App;
