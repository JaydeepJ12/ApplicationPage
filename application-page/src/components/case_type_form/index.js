import React, { useState, useEffect } from "react";
import axios from "axios";
import { Settings, Cancel, AddBox } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
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
import { Close } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";
import CaseTypeFieldForm from "./calculated";
import useCommonStyles from "../../assets/css/common_styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import CancelIcon from "@material-ui/icons/Cancel";
import AddBoxIcon from "@material-ui/icons/AddBox";
import Popover from "@material-ui/core/Popover";

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
    position: "absolute",
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
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function CaseTypeForm(props) {
  const Commonclasses = useCommonStyles();
  const classes = useStyles();
  const [inputFields, setInputFields] = useState([
    { index: 0, name: "", fieldtype: "" },
  ]);
  const [fieldType, setFieldType] = useState("");
  const [events, setEvents] = useState("");
  const [fieldIndex, setFieldIndex] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [casetype, setCaseType] = React.useState(null);
  const [casetypename, setCaseTypeName] = React.useState([]);

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const handleAddFields = () => {
    const fields = [...inputFields];
    const index = fields.length;
    setInputFields([...inputFields, { index: index, name: "" }]);
    console.log("inputFields", inputFields);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleChange = (event) => {
    setFieldType(event.target.value);
  };

  const handleClickOpen = (value, index, event) => {
    setAnchorEl(event.target);
    setEvents(value);
    setFieldIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const sendCaseType = () => {
    console.log("case type insert called");
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
    const data = {
      name: inputFields,
      created_by: "testu",
      is_active: "N",
      modified_by: "testu",
    };
    console.log("inputFields success===>", inputFields);
    axios
      .post("cases/case_type_insert", data, {
        headers: headers,
      })
      .then((response) => {
        // swal("Good job!", response.data.message, "success");
        // setTimeout(() => {
        //   swal.close();
        // }, 2000);
        console.log("data send==>", response);
        setInputFields([{ name: "", fieldtype: "" }]);
      })
      .catch((error) => {
        // swal("Warning", error, "error");
        // setTimeout(() => {
        //   swal.close();
        // }, 3000);
        console.log("catch", error);
      });
  };
  const final_datset = [];
  useEffect(() => {
    console.log("use effect==>");
    setTimeout(() => {
      axios
        .get("cases/case_type_data")
        .then((response) => {
          console.log("---->", response);
          // swal("Good job!", response.data.message, "success");
          // setTimeout(() => {
          //   swal.close();
          // }, 2000);
          setCaseType(response.data.values);

          for (var i = 0; i < casetype.length; i++) {
            final_datset.push(casetype[i].name);
          }
          setCaseTypeName(final_datset);
        })
        .catch((error) => {
          // swal("Warning", error, "error");
          // setTimeout(() => {
          //   swal.close();
          // }, 3000);
          console.log("catch", error);
        });
    }, 500);
  });
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleChangeInput = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };

  const handleCaseTypeFieldForm = (inputFieldsData) => {
    setInputFields(inputFieldsData);
  };

  return (
    <div>
      <div>
        <Drawer
          style={{ marginLeft: "240px" }}
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor=""
        >
          <div className={classes.toolbar} />

          <List
            style={{
              width: "262px",
              marginTop: "100px",
            }}
          >
            <Typography
              style={{
                textAlign: "center",
                backgroundColor: "orange",
                padding: "10px",
                color: "white",
              }}
              variant="h5"
              component="h2"
              gutterBottom
              position="static"
            >
              Case Types
            </Typography>

            {casetypename.map((text, index) => (
              <ListItem
                style={{
                  textAlign: "center",
                  backgroundColor: "moccasin",
                  borderBottom: "1px solid grey",
                }}
                button
                key={text}
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </div>
      <div style={{ float: "right", marginRight: "100px", marginTop: "50px" }}>
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
                  <MenuItem disabled>
                    <em>Field Type</em>
                  </MenuItem>
                  <MenuItem
                    value="calculated"
                    aria-describedby={id}
                    onClick={(event) =>
                      handleClickOpen("calculated", index, event)
                    }
                    value="calculated"
                  >
                    Calculated
                  </MenuItem>
                  <MenuItem
                    aria-describedby={id}
                    onClick={(event) =>
                      handleClickOpen("datefield", index, event)
                    }
                    value="datefield"
                  >
                    Date Field
                  </MenuItem>
                  <MenuItem
                    aria-describedby={id}
                    onClick={(event) =>
                      handleClickOpen("textfield", index, event)
                    }
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
              {/* <Button
              style={{ width: "100px", backgroundColor: "orange" }}
              variant="contained"
              color="primary"
            >
              Add
            </Button> */}
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
          <Button
            style={{ width: "150px", backgroundColor: "orange" }}
            variant="contained"
            color="primary"
            onClick={() => sendCaseType()}
          >
            Add
          </Button>
        </form>
      </div>
      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <CaseTypeFieldForm
          props={events}
          fieldIndex={fieldIndex}
          caseTypeField={
            inputFields
              ? inputFields.find((x) => x.index === fieldIndex)?.caseTypeField
              : []
          }
          inputFields={inputFields}
          handleCaseTypeFieldForm={handleCaseTypeFieldForm}
        ></CaseTypeFieldForm>
      </Popover>
    </div>
  );
}
