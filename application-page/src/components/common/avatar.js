import React from 'react';
import { default as useStyles } from "../../assets/css/common_styles";
import { Avatar } from "@material-ui/core";
export default function CommonAvatar(props){
    var classes = useStyles();

    const addDefaultSrc = (event) => {
        let userDefaultImage = require("../../assets/images/default-userimage.png");
        if (userDefaultImage) {
          event.target.src = userDefaultImage;
        }
      };

      if (props.name) {
        return (
          <Avatar
          onError={(event) => addDefaultSrc(event)}
            boxShadow={1}
            className={props.sizeClass}
            alt={props.name}
            src={process.env.REACT_APP_USER_ICON + props.name}
          />
        );
      } else {
        return (
          <Avatar
          onError={(event) => addDefaultSrc(event)}
            className={props.sizeClass}
            alt="Test"
            src={process.env.DEFAULT_IMAGE_PATH}
          />
        );
      }
   
}