import React from "react";
import { navigate } from "@reach/router";
import { Button } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
export default function GotoBackButton(props) {
  const handleRedirect = () => {
    navigate(-1)
  };
  return (
    <div className="btn-back">
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
