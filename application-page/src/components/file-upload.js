import { Box, Button } from "@material-ui/core";
// icons
import AttachFileIcon from "@material-ui/icons/AttachFile";
import React, { useState } from "react";

export default function FileUpload(props) {
  const [formDataValue, setFormDataValue] = useState([]);

  const onFileChange = (event) => {
    var file = event.target.files[0];
    const formData = new FormData();
    if (file) {
      formData.append("myFile" + props.caseType, file, file.name);
      const fileData = [...formData];
      setFormDataValue(fileData);
      props.handleOnFileChange(fileData);
    }
  };
  return (
    <div className="file-input">
      <br></br>
      <Button style={{ paddingLeft: 0 }} component="label">
        <Box className="input-file-upload">
          <AttachFileIcon></AttachFileIcon>
        </Box>
        <input type="file" hidden id="fileUpload" onChange={onFileChange} />
      </Button>
      <label>{formDataValue[0] ? formDataValue[0][1]?.name : ""}</label>
    </div>
  );
}
