import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import axios from "axios";

const useStyles = makeStyles(
  (theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "50ch",
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 90,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },
    },
  }),
  { index: 1 }
);

export default function CaseTypeFieldForm(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [checkedactive, setCheckedActive] = React.useState(false);
  const [checkedlist, setCheckedList] = React.useState(false);
  const [checkedlistExpen, setCheckedListExpandable] = React.useState(false);
  const [cvalue, calculateValue] = React.useState("");
  const [dvalue, descriptValue] = React.useState("");
  const [age, setAge] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [system_code, setSystemCode] = React.useState("");
  const [fieldType, setFieldType] = React.useState([]);
  const [inputFields, setInputFields] = React.useState([]);
  const [caseTypeFields, setCaseTypeFields] = React.useState([]);
  const [fieldIndex, setFieldIndex] = React.useState(0);
  const [caseTypeField, setCaseTypeField] = React.useState(props.caseTypeField);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleChangeActive = (event) => {
    setCheckedActive(event.target.checked);
  };

  const handleChangeList = (event) => {
    setCheckedList(event.target.checked);
  };

  const handleExpandable = (event) => {
    setCheckedListExpandable(event.target.checked);
  };

  const handleChange1 = (event) => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    getSystemCOde();
    setOpen(true);
  };

  const getSystemCOde = async () => {
    await axios
      .get(`cases/system_code`)
      .then(function (response) {
        let data_cat = response.data.values;
        if (data_cat.length) {
          setSystemCode(data_cat);
        }
        console.log("75", system_code);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCaseTypeFieldForm = (event) => {
    event.preventDefault();
    inputFields[fieldIndex].caseTypeField = caseTypeFields;
    let fields = {};
    var submitted = true;
    Object.entries(event.target.elements).forEach(([name, input]) => {
      if (input.type != "submit") {
        if (input.name != "" && input.value != "") {
          submitted = true;
          fields[input.name] = input.value;
        }
      }
    });
    fields["active"] = checked;
    fields["required"] = checkedactive;
    fields["showOnList"] = checkedlist;
    fields["expandable"] = checkedlistExpen;

    inputFields[fieldIndex].caseTypeField = fields;
    console.log(fields);
    props.handleCaseTypeFieldForm(inputFields);
  };

  const handle_data = (data) => {};

  useEffect(() => {
    setFieldType(props.props);
    setInputFields(props.inputFields);
    setFieldIndex(props.fieldIndex);
    setCaseTypeField(props.caseTypeField);
    setChecked(props.caseTypeField?.active);
    setCheckedActive(props.caseTypeField?.required);
    setCheckedList(props.caseTypeField?.showOnList);
    setCheckedListExpandable(props.caseTypeField?.expandable);
  }, [props.props, props.inputFields, props.fieldIndex, props.caseTypeField]);

  // useEffect(() => {
  //   console.log("use effect==>");
  //   // setTimeout(() => {
  //   // }, 500);
  // });

  const getFullName = (item) => {
    console.log("item satish==>", item);
    var fullname = item.system_code;
    return fullname;
  };

  return (
    <div style={{ height: "480px", marginLeft: "20px", width: "350px" }}>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={handleCaseTypeFieldForm}
      >
        {fieldType == "calculated" ? (
          <div>
            <Typography variant="h5" gutterBottom>
              Calculated
            </Typography>
            <br></br>
            <TextField
              style={{ width: "300px" }}
              name="calculated_formula"
              defaultValue={caseTypeField?.calculated_formula}
              id="outlined-basic"
              label="Calculated Formula"
              variant="outlined"
              // onChange={(e) => calculateValue(e.target.value)}
            />
            <br></br>
            <label>User to control output</label>
          </div>
        ) : fieldType == "datefield" ? (
          <div>
            <Typography variant="h5" gutterBottom>
              Date Field
            </Typography>
          </div>
        ) : fieldType == "textfield" ? (
          <div>
            <Typography variant="h5" gutterBottom>
              Text Field
            </Typography>
          </div>
        ) : (
          "test"
        )}
        <br></br>
        <TextField
          style={{ width: "300px" }}
          name="description"
          defaultValue={caseTypeField?.description}
          id="outlined-basic-description"
          label="Description"
          variant="outlined"
          // onChange={(e) => descriptValue(e.target.value)}
        />
        <label>User to control output</label>
        <div>
          <FormControl
            variant="outlined"
            style={{ float: "right", marginRight: "100px", marginTop: "-14px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              System Code
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              open={open}
              defaultValue={caseTypeField?.systemCode}
              name="systemCode"
              onClose={handleClose}
              onOpen={handleOpen}
              value={age}
              onChange={handleChange1}
              style={{ width: "150px" }}
            >
              {system_code.length
                ? system_code.map((option) => (
                    <MenuItem key={option.id} value={option.system_code}>
                      {option.system_code}
                    </MenuItem>
                  ))
                : []}
            </Select>
          </FormControl>
          <Checkbox
            style={{ float: "left" }}
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "primary checkbox" }}
            style={{ color: "orange" }}
          />
          <label>Active</label>
        </div>
        <div>
          <Checkbox
            checked={checkedactive}
            onChange={handleChangeActive}
            inputProps={{ "aria-label": "primary checkbox" }}
            style={{ color: "orange" }}
          />
          <label>Required</label>
        </div>
        <div>
          <Checkbox
            checked={checkedlist}
            onChange={handleChangeList}
            inputProps={{ "aria-label": "primary checkbox" }}
            style={{ color: "orange" }}
          />
          <label>Show on List</label>
        </div>
        {fieldType == "textfield" ? (
          <div>
            <Checkbox
              checked={checkedlistExpen}
              onChange={handleExpandable}
              inputProps={{ "aria-label": "primary checkbox" }}
              style={{ color: "orange" }}
            />
            <label>Expandable</label>
          </div>
        ) : (
          ""
        )}
        <br></br>
        <Button
          type="submit"
          style={{ width: "150px", backgroundColor: "orange" }}
          variant="contained"
          color="primary"
        >
          Add
        </Button>
      </form>
    </div>
  );
}
