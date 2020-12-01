import React, { useState, useEffect } from "react";
import axios from "axios";
import SettingsIcon from "@material-ui/icons/Settings";
import CancelIcon from "@material-ui/icons/Cancel";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { TextField, MenuItem, FormControl } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import CaseTypeFieldForm from "./calculated";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "65ch",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

export default function CaseTypeForm(props) {
  const classes = useStyles();
  const [inputFields, setInputFields] = useState([{ name: "", fieldtype: "" }]);
  const [fieldType, setFieldType] = useState("");
  const [open, setOpen] = React.useState(false);
  const [events, setEvents] = useState("");

  const handleAddFields = () => {
    setInputFields([...inputFields, { name: "" }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleChange = (event) => {
    setFieldType(event.target.value);
  };

  const handleClickOpen = (event) => {
    setOpen(true);
    setEvents(event);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeInput = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };

  return (
    <div style={{ marginLeft: "300px" }}>
      <form className={classes.root} noValidate autoComplete="off">
        {inputFields.map((inputField, index) => (
          <div>
            <TextField
              style={{ width: "300px" }}
              id="outlined-basic"
              label="Name"
              name="name"
              variant="outlined"
              value={inputField.name}
              onChange={(event) => handleChangeInput(index, event)}
            />
            <FormControl
              variant="filled"
              className={classes.formControl}
              style={{ width: "170px", marginLeft: "10px" }}
            >
              <InputLabel id="demo-simple-select-filled-label">
                Field Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={inputField.fieldtype}
                name="fieldtype"
                onChange={(event) => handleChangeInput(index, event)}
              >
                <MenuItem>
                  <em>Field Type</em>
                </MenuItem>
                <MenuItem
                  value="calculated"
                  onClick={(event) => handleClickOpen("calculated")}
                  value="calculated"
                >
                  Calculated
                </MenuItem>
                <MenuItem
                  onClick={(event) => handleClickOpen("datefield")}
                  value="datefield"
                >
                  Date Field
                </MenuItem>
                <MenuItem value="dropdown">Drop Down</MenuItem>
                <MenuItem value="externalsource">External Source</MenuItem>
                <MenuItem value="hyperlink">Hyper Link</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="lockup">Lock Up</MenuItem>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="expendabletext">Expandable Text</MenuItem>
              </Select>
            </FormControl>
            <SettingsIcon
              style={{
                color: orange[500],
                marginLeft: "10px",
                marginTop: "16px",
                height: "30px",
              }}
            />
            <CancelIcon
              style={{
                color: orange[500],
                marginLeft: "10px",
                marginTop: "16px",
                height: "30px",
              }}
              onClick={() => handleRemoveFields(index)}
            />
          </div>
        ))}
        <AddBoxIcon
          style={{
            color: orange[500],
            marginLeft: "-400px",
            marginTop: "20px",
            height: "30px",
          }}
          onClick={() => handleAddFields()}
        />
      </form>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <CaseTypeFieldForm props={events} />
      </Dialog>
    </div>
  );
}
