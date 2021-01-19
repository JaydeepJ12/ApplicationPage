import { Button } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { navigate } from "@reach/router";
import React from "react";
export default function GotoBackButton(props) {
  const handleRedirect = () => {
    navigate(-1);
  };
  return (
    <div className="btn-back st-p-2">
      <Button
        onClick={() => {
          handleRedirect();
        }}
        variant="contained"
        color="danger"
        startIcon={<KeyboardBackspaceIcon />}
      >
        Back
      </Button>
    </div>
  );
}
