import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  TextField,
  Toolbar,
} from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { FilterList, RotateLeft } from "@material-ui/icons";
import {
  default as useStyles,
  default as useStylesBase,
} from "../../assets/css/common_styles";
import * as notification from "../../components/common/toast";


function ApplicationItemFilter(props) {
  var classes = useStyles();

  
  const [value, setValue] = React.useState(0);
  const classesBase = useStylesBase();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // For Fill Dropdown
  const reducerState = useSelector((state) => state);
  const [entityTypes, setEntityTypes] = useState(0);
  const [entityDrpValue, setEntityTypeValue] = useState(0);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
   
    var entityData = reducerState.applicationData.applicationElements.filter(
      (x) => x.SYSTEM_CODE === "ASSET"
    );
    if (entityData) {
      let entityIds = entityData
        .map(function (x) {
          return x.EXID;
        })
        .join(",");
      if (entityIds) {
        getEntityTypeList(entityIds);
      }
    }

  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getEntityTypeList = async (Ids) => {
    var data = JSON.stringify({ entityIds: Ids });
    var config = {
      method: "post",
      url: "/entity/entity_link",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        if (response.data.length) {
          setEntityTypes(response.data);
        } 
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleFilterChange = (parentName, parentID) => {
    setEntityTypeValue(value);
  };


  const handleFilterResetClick = () => {
    setValue(0);
    props.getEntityList();

  };

  const handleFilterClear = () => {
    setValue(0);
    setEntityTypeValue(0);
  };
  const handleFilterSubmit = (event) => {
    alert("-----click filter")
    console.log("---event--",event);
    event.preventDefault();
    setValue(0);

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
   
    console.log("----fields",fields);
    if (submitted == true && fields !== undefined) {
      notification.toast.success("Filter Apply successfully..!!!");

      props.getEntityList(fields, 0);
    }
  };
  return (
    <div className="page" id="people-filter">
      <AppBar position="position" className={classes.appBar}>
        <Toolbar className="st-inline">
          <div>
            <IconButton
              className={classes.button}
              aria-label="filter"
              onClick={handleFilterClick}
            >
              <FilterList style={{ cursor: "pointer" }} />
            </IconButton>
            <div className="st-float-end">
              <IconButton
                className={classes.button}
                aria-label="reset"
                onClick={handleFilterResetClick}
              >
                <RotateLeft style={{ cursor: "pointer" }} />
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <Popover
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Grid className={"card-filter " + classesBase.m_one}>
        <form onSubmit={handleFilterSubmit} className="">
            <Grid item lg={12} md={12} xs={12} sm={12}>
            <FormControl
                fullWidth={true}
                variant="outlined"
                className={classesBase.mb_one}
              >
                <InputLabel id="demo-controlled-open-select-label">
                Entity Types
                </InputLabel>
                <Select
                  className="input-dropdown"
                  name="entityType"
                  label="entityType"
                  defaultValue={entityDrpValue}
                  onChange={(e) =>
                    handleFilterChange(e.target.value)
                  }
                >
                    <MenuItem
                          value={0}
                          key={0}
                        >
                        All
                        </MenuItem>
                  {entityTypes?.length ? (
                      entityTypes.map((entityType) => (
                        <MenuItem
                          value={entityType.ID}
                          key={entityType.ENTITY_ID}
                        >
                          {entityType.ID}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">
                        <em>No Data Available</em>
                      </MenuItem>
                    )}
                </Select>
              </FormControl>
           
            </Grid>
             <Grid item lg={12} md={12} xs={12} sm={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classesBase.mr_one}
              >
                Filter
              </Button>
              <Button
                type="reset"
                onClick={handleFilterClear}
                variant="contained"
                color="secondary"
              >
                Clear
              </Button>
            </Grid>
           </form>
        </Grid>
      </Popover>
    </div>
  );
}
export default ApplicationItemFilter;
