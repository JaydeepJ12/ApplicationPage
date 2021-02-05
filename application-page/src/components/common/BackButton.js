
import { Button } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { navigate } from "@reach/router";
import React from "react";
import useStyles from "../../assets/css/common_styles";
export default function GotoBackButton(props) {
  var classes = useStyles();
  const [navigateCount, setNavigateCount] = React.useState(
    props.navigateCount ? props.navigateCount : -1
  );

  const handleRedirect = () => {
    navigate(navigateCount);
  };

  return (
    <div className={classes.mb_one}>
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
