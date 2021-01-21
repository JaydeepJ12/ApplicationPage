import React, { useState, useEffect } from "react";
import axios from "axios";
import { Settings, Cancel, AddBox } from "@material-ui/icons";
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  IconButton,
  
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogTitle";
import { Close} from '@material-ui/icons';
import { makeStyles } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";
import CaseTypeFieldForm from "./calculated";
import useCommonStyles from "../../assets/css/common_styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(
  (theme) => ({
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
  }),
  { index: 1 }
);
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

export default function CaseTypeForm(props) {
  const Commonclasses = useCommonStyles();
  const classes = useStyles();
  const [inputFields, setInputFields] = useState([{ name: "", fieldtype: "" }]);
  const [fieldType, setFieldType] = useState("");
  const [events, setEvents] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const handleAddFields = () => {
    setInputFields([...inputFields, { name: "" }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleClickOpen = (value, event) => {
    setAnchorEl(event.target);
    setEvents(value);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleChangeInput = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };
  return (
    <div className="page" className="page-case-type">
      <form noValidate autoComplete="off">
        {inputFields.map((inputField, index) => (
          <div className={Commonclasses.mb_one}>
            <TextField
              style={{ width: "400px" }}
              id="outlined-basic"
              label="Name"
              name="name"
              variant="outlined"
              value={inputField.name}
              onChange={(event) => handleChangeInput(index, event)}
            />
            <FormControl
              variant="outlined"
              className={classes.formControl}
              style={{ width: "170px", marginLeft: "10px" }}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Field Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={inputField.fieldtype}
                name="fieldtype"
                onChange={(event) => handleChangeInput(index, event)}
              >
                <MenuItem disabled>
                  <em>Field Type</em>
                </MenuItem>
                <MenuItem
                  value="calculated"
                  aria-describedby={id}
                  onClick={(event) => handleClickOpen("calculated", event)}
                  value="calculated"
                >
                  Calculated
                </MenuItem>
                <MenuItem
                  aria-describedby={id}
                  onClick={(event) => handleClickOpen("datefield", event)}
                  value="datefield"
                >
                  Date Field
                </MenuItem>
                <MenuItem
                  aria-describedby={id}
                  onClick={(event) => handleClickOpen("textfield", event)}
                  value="textfield"
                >
                  Text Field
                </MenuItem>
                <MenuItem value="dropdown">Drop Down</MenuItem>
                <MenuItem value="externalsource">External Source</MenuItem>
                <MenuItem value="hyperlink">Hyper Link</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="lockup">Lock Up</MenuItem>

                <MenuItem value="expendabletext">Expandable Text</MenuItem>
              </Select>
            </FormControl>
            <Settings
              style={{
                cursor: "pointer",
                color: orange[500],
                marginLeft: "10px",
                marginTop: "16px",
                height: "30px",
                fontSize: 40,
              }}
            />

            <Cancel
              style={{
                cursor: "pointer",
                color: orange[500],
                marginLeft: "10px",
                marginTop: "16px",
                height: "30px",
                fontSize: 40,
              }}
              onClick={() => handleRemoveFields(index)}
            />
          </div>
        ))}
        <AddBox
          style={{
            cursor: "pointer",
            color: orange[500],
            height: "30px",
            fontSize: 40,
          }}
          onClick={() => handleAddFields()}
        />
      </form>


      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogContent dividers>
          <CaseTypeFieldForm props={events} />
        </DialogContent>
      </Dialog>

      
    </div>
  );
}
