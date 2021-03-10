import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
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

function ApplicationItemFilter(props) {
  var classes = useStyles();

  const classesBase = useStylesBase();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const reducerState = useSelector((state) => state);
  const [entityTypes, setEntityTypes] = useState(0);
  const [entityDrpValue, setEntityTypeValue] = useState(0);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
    var appId = reducerState.applicationData.appId;
    if (appId) {
      getEntityTypeList(appId);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getEntityTypeList = async (appId) => {
    var config = {
      method: "get",
      url: "/entity/type_list_by_id?id=" + appId,
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

  const handleFilterChange = (value) => {
    if (value !== undefined && value === 0) {
      handleFilterResetClick();
      handleClose();
    }
    setEntityTypeValue(value);
    props.setEntityIds(value);
    props.getEntityList(0, value, false);
  };

  const handleFilterResetClick = () => {
    if (props.entityData) {
      let entityIds = props.entityData
        .map(function (x) {
          return x.EXID;
        })
        .join(",");
      if (entityIds) {
        props.setEntityIds(entityIds);
        props.getEntityList(0, entityIds, false);
      }
    }
  };
  useEffect(() => {}, [props.entityData]);
  return (
    <div className="page" id="entity-filter">
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
        className="card-filter"
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
        <Grid className={classesBase.m_one}>
          <form className="filter-form">
            <Grid item lg={12} md={12} xs={12} sm={12}>
              <FormControl
                fullWidth={true}
                variant="outlined"
                className={classes.formControl}
              >
                <InputLabel id="demo-controlled-open-select-label">
                  Entity Types
                </InputLabel>
                <Select
                  className="input-dropdown"
                  name="entityType"
                  label="entityType"
                  value={entityDrpValue}
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  <MenuItem value={0} key={0}>
                    All
                  </MenuItem>

                  {entityTypes?.length ? (
                    entityTypes.map((entityType) => (
                      <MenuItem value={entityType.EID} key={entityType.EID}>
                        {entityType.Entity_Types}
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
            <Grid item lg={12} md={12} xs={12} sm={12}></Grid>
          </form>
        </Grid>
      </Popover>
    </div>
  );
}
export default ApplicationItemFilter;
