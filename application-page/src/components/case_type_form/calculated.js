import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
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
}));

export default function CaseTypeFieldForm(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [checkedactive, setCheckedActive] = React.useState(false);
  const [checkedlist, setCheckedList] = React.useState(false);
  const [cvalue, calculateValue] = React.useState("");
  const [dvalue, descriptValue] = React.useState("");

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleChangeActive = (event) => {
    setCheckedActive(event.target.checked);
  };

  const handleChangeList = (event) => {
    setCheckedList(event.target.checked);
  };

  return (
    <div style={{ height: "500px", marginLeft: "150px" }}>
      <form className={classes.root} noValidate autoComplete="off">
        {props.props == "calculated" ? (
          <div>
            <Typography
              variant="h4"
              style={{ marginLeft: "60px" }}
              gutterBottom
            >
              Calculated
            </Typography>
            <br></br>
            <TextField
              style={{ width: "300px" }}
              id="outlined-basic"
              label="Calculated Formula"
              variant="outlined"
              onChange={(e) => calculateValue(e.target.value)}
            />
            <br></br>
            <label>User to control output</label>
          </div>
        ) : (
          <Typography
            variant="h4"
            style={{ marginLeft: "40px", marginBottom: "60px" }}
            gutterBottom
          >
            Date Field
          </Typography>
        )}
        <br></br>
        <TextField
          style={{ width: "300px" }}
          id="outlined-basic"
          label="Description"
          variant="outlined"
          onChange={(e) => descriptValue(e.target.value)}
        />
        <br></br>
        <label>User to control output</label>
        <div>
          <Checkbox
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
      </form>
    </div>
  );
}
