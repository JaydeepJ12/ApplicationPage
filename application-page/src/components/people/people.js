import {
  Box,
  Button,
  FormControl,
  Grid,
  Icon,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ComponentLoader from "../common/component-loader";
import PeoplePreview from "./people-preview";

const useStyles = makeStyles(
  (theme) => ({
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    searchPaper: {
      padding: "5px 4px",
      display: "flex",
      alignItems: "center",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    fontWeight: {
      fontWeight: "bold",
    },
    nextButton: {
      float: "right",
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: "lightgrey",
      "&:hover": {
        backgroundColor: "lightgrey",
      },
      marginLeft: 0,
      // width: '100%'
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      // padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      // transition: theme.transitions.create('width'),
      width: "100%",
    },
    input: {
      marginLeft: theme.spacing(1),
      // flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  }),
  { index: 1 }
);

export default function Peoples() {
  const classes = useStyles();
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
        <img
          onError={(event) => addDefaultSrc(event)}
          src={process.env.REACT_APP_USER_ICON.concat(userName)}
          height={50}
          width={50}
          onClick={() => handleClickOpen(userName, fullName)}
        />
      );
    } else {
      return (
        <img
          src="../../assets/images/default-userimage.png"
          height={50}
          width={50}
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
    <div>
      <PeoplePreview
        open={open}
        userName={userName}
        userFullName={userFullName}
        handleClose={handleClose}
      ></PeoplePreview>
      <Box boxShadow={0} className="card card-task-overview" borderRadius={35}>
        <Grid item xs={12} container spacing={3}>
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
              <Paper component="form" className={classes.searchPaper}>
                <InputBase
                  className={classes.input}
                  placeholder="Search People…"
                  inputProps={{ "aria-label": "search people…" }}
                  onInput={(event) => searchPeople(event.target.value)}
                />
                <IconButton className={classes.iconButton} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>
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
          <ComponentLoader type="rect" />
        ) : (
          <div className="people-image-list">
            <Grid container spacing={3}>
              {peopleData.length ? (
                peopleData.map((people) => (
                  <Grid item lg={3} md={3} xs={3} sm={3}>
                    <Box>
                      <Icon className="s-option-auto-image">
                        {renderUserImage(people.ShortUserName, people.FullName)}
                      </Icon>
                      <Typography
                        className={classes.fontWeight}
                        variant="caption"
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
                        variant="caption"
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
        {peopleData.length >= maxCount ? (
          <div>
            {peopleData.length && recordLength !== maxCount ? (
              <Button variant="contained" onClick={handlePrevClick}>
                Prev
              </Button>
            ) : (
              ""
            )}
            {peopleData.length ? (
              <Button
                variant="contained"
                className={recordLength !== maxCount ? classes.nextButton : ""}
                onClick={handleNextClick}
              >
                Next
              </Button>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {/* </Slider> */}
      </Box>
    </div>
  );
}
