import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  Icon,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import useStyles from "../../assets/css/common_styles";
import ComponentLoader from "../common/component-loader";
import headerStyles from "../header/header_styles";
import PeoplePreview from "./people-preview";
export default function Peoples() {
  const classes = useStyles();
  const sharedClasses = headerStyles();

  const [open, setOpen] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [userFullName, setUserFullName] = React.useState("");
  const [peopleData, setPeopleData] = useState([]);
  const [componentLoader, setComponentLoader] = useState(false);
  const [maxCount, setMaxCount] = useState(16);
  const [recordLength, setRecordLength] = useState(0);
  const [searchTextValue, setSearchTextValue] = useState("");

  const timeoutRef = useRef(null);
  let timeoutVal = 1000; // time it takes to wait for user to stop typing in ms
  const searchPeople = (searchText) => {
    if (timeoutRef.current !== null) {
      // IF THERE'S A RUNNING TIMEOUT
      clearTimeout(timeoutRef.current); // THEN, CANCEL IT
    }
    if (searchText != "") {
    }

    timeoutRef.current = setTimeout(() => {
      // SET A TIMEOUT
      timeoutRef.current = null; // RESET REF TO NULL WHEN IT RUNS
      if (searchText) {
        setPeopleData([]);
        setRecordLength(0);
        setSearchTextValue(searchText);
        getPeople(0, false, searchText, false, true);
      } else {
        setSearchTextValue("");
        setPeopleData([]);
        setRecordLength(0);
        getPeople(0, false, "", true);
      }
    }, timeoutVal);
  };

  const getPeople = async (
    skipCount = 0,
    isPrev = false,
    searchText = "",
    isReset = false,
    isSearch = false
  ) => {
    setComponentLoader(true);
    var jsonData = {
      maxCount: maxCount,
      skipCount: skipCount,
      searchText: searchText,
    };
    var config = {
      method: "post",
      url: "/cases/getPeople",
      data: jsonData,
    };

    let recordLengthValue = maxCount;
    if (!isReset && !isSearch) {
      if (isPrev) {
        recordLengthValue = recordLength - maxCount;
      } else {
        recordLengthValue = recordLength + maxCount;
      }
    }

    await axios(config)
      .then(function (response) {
        setComponentLoader(false);
        setPeopleData(response.data);
        setRecordLength(recordLengthValue);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getPeople();
  }, []);

  const addDefaultSrc = (event) => {
    let userDefaultImage = require("../../assets/images/default-userimage.png");
    if (userDefaultImage) {
      event.target.src = userDefaultImage;
    }
  };

  const renderUserImage = (userName, fullName) => {
    if (userName) {
      return (
        <Avatar
          onClick={() => handleClickOpen(userName, fullName)}
          onError={(event) => addDefaultSrc(event)}
          src={process.env.REACT_APP_USER_ICON.concat(userName)}
          className={classes.avt_large}
        />
      );
    } else {
      return (
        <Avatar
          src="../../assets/images/default-userimage.png"
          className={classes.avt_large}
        />
      );
    }
  };

  const handleNextClick = () => {
    setComponentLoader(true);
    setPeopleData([]);
    getPeople(recordLength, false, searchTextValue);
  };

  const handlePrevClick = () => {
    setComponentLoader(true);
    setPeopleData([]);

    getPeople(recordLength - maxCount * 2, true, searchTextValue);
  };

  const handleClickOpen = (userName, fullName) => {
    setUserName(userName);
    setUserFullName(fullName);
    setOpen(true);
  };

  const handleClose = (value) => {
    setUserName("");
    setUserFullName("");
    setOpen(value);
  };

  return (
    <>
      <PeoplePreview
        open={open}
        userName={userName}
        userFullName={userFullName}
        handleClose={handleClose}
      ></PeoplePreview>
      <Box boxShadow={0} className="card bg-secondary" borderRadius={35}>
        <Grid item xs={12} container spacing={2}>
          <Grid item lg={3} md={3} xs={6} sm={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                People
              </InputLabel>
              <Select
                className="input-dropdown"
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                label="People"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={6} md={6} xs={6} sm={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <div
                className={
                  sharedClasses.search + " " + sharedClasses.searchFocused
                }
              >
                <div className={sharedClasses.searchIconOpened}>
                  <IconButton className={sharedClasses.headerMenuButton}>
                    <SearchIcon className={sharedClasses.headerIcon} />
                  </IconButton>
                </div>
                <InputBase
                  onInput={(event) => searchPeople(event.target.value)}
                  placeholder="Search…"
                />
              </div>
            </FormControl>
          </Grid>
          <Grid
            item
            lg={3}
            md={3}
            xs={6}
            sm={6}
            style={{ "text-align": "right" }}
          >
            <Button
              variant="contained"
              size="large"
              className="btn btn-create-button btn-primary rounded-pill"
              variant="contained"
              color="primary"
            >
              + Add
            </Button>
          </Grid>
        </Grid>
        {/* <Slider {...SilderSetting}> */}
        {componentLoader ? (
          <div className={classes.mt_one}>
            <ComponentLoader type="rect" />
          </div>
        ) : (
          <div className={classes.mt_one}>
            <Grid container spacing={3}>
              {peopleData.length ? (
                peopleData.map((people) => (
                  <Grid
                    item
                    lg={3}
                    md={3}
                    xs={3}
                    sm={3}
                    style={{ textAlign: "center" }}
                  >
                    <Box>
                      <Icon className="s-option-auto-image">
                        {renderUserImage(people.ShortUserName, people.FullName)}
                      </Icon>
                      <Typography
                        className={classes.fontWeight}
                        variant="subtitle2"
                        display="block"
                        gutterBottom
                      >
                        {people.FullName
                          ? people.FullName
                          : people.ShortUserName}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        TASK COUNT
                      </Typography>
                      <Typography
                        className={classes.fontWeight}
                        variant="subtitle2"
                        display="block"
                        gutterBottom
                      >
                        {people.TotalCount}
                      </Typography>
                    </Box>
                  </Grid>
                ))
              ) : (
                <div style={{ height: "2rem" }}>No Data Found</div>
              )}
            </Grid>
          </div>
        )}

        {peopleData.length ? (
          <Grid container spacing={3}>
            {recordLength !== maxCount ? (
              <Grid
                item
                lg={6}
                md={6}
                xs={6}
                sm={6}
                style={{
                  textAlign: peopleData.length >= maxCount ? "right" : "",
                }}
              >
                <Button variant="contained" onClick={handlePrevClick}>
                  Prev
                </Button>
              </Grid>
            ) : (
              ""
            )}
            {peopleData.length >= maxCount ? (
              <Grid
                item
                lg={6}
                md={6}
                xs={6}
                sm={6}
                style={{ textAlign: "left" }}
              >
                <Button variant="contained" onClick={handleNextClick}>
                  Next
                </Button>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        ) : (
          ""
        )}
        {/* </Slider> */}
      </Box>
    </>
  );
}
