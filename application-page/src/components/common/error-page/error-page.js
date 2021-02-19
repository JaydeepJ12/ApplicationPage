import { Button } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { navigate } from "@reach/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionData } from "../../../redux/action";
import "./error-page.css";

export default function ErrorPage(props) {
  const dispatch = useDispatch();
  const [errorPageMessage, setErrorPageMessage] = React.useState("");
  const reducerState = useSelector((state) => state);

  React.useEffect(() => {
    let errorPageMessage = reducerState.applicationData.errorPageMessage;
    if (errorPageMessage) {
      setErrorPageMessage(errorPageMessage);
    }
    dispatch(actionData(true, "ERROR_PAGE"));
    if (props.location?.state?.errorMessage) {
      dispatch(
        actionData(props.location?.state?.errorMessage, "ERROR_PAGE_MESSAGE")
      );
    }
  }, [reducerState.applicationData.errorMessage]);

  const handleRedirect = () => {
    dispatch(actionData(false, "ERROR_PAGE"));
    navigate(process.env.REACT_APP_HOME_PAGE, {});
  };

  let errorPageImage = require("../../../assets/images/error-page-image.png");

  return (
    <>
      <div className="error-page-container">
        <img src={errorPageImage} />

        <h1>
          <span>500</span> <br />
          Internal server error
        </h1>
        <p>We are currently trying to fix the problem.</p>
        <p className="">
          Error - {errorPageMessage ? errorPageMessage : "Unknown"}
        </p>
        <div className="">
          <Button
            onClick={() => {
              handleRedirect();
            }}
            variant="contained"
            color="danger"
            startIcon={<KeyboardBackspaceIcon />}
          >
            Home Page
          </Button>
        </div>
      </div>
    </>
  );
}
