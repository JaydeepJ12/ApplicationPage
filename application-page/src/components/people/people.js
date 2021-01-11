import {
  Box,
  Button,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  Typography, InputBase,fade
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import * as apiConfig from "../../components/api_base/api-config";
import UserAutocomplete from "../autocomplete";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  root: {
    flexGrow: 1,
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  root2: {
    backgroundColor: theme.palette.background.paper,
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
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
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
}));

export default function Peoples() {
  const classes = useStyles();
  const [peopleData, setPeopleData] = useState([]);
  const [componentLoader, setComponentLoader] = useState(false);
  const [maxCount, setMaxCount] = useState(16);
  const [recordLength, setRecordLength] = useState(0);
  const [userId, setUserId] = useState(0);
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
        getPeople(0, false, searchText, false);
      } else {
        setPeopleData([]);
        setRecordLength(0);
        getPeople(0, false, '', true);
      }
    }, timeoutVal);
  };

  const getPeople = async (skipCount = 0, isPrev = false, searchText = '', isReset = false) => {
    setComponentLoader(true);
    var jsonData = {
      maxCount: maxCount,
      skipCount: skipCount,
      searchText: searchText
    };
    var config = {
      method: "post",
      url: "http://localhost:5000/cases/getpeople",
      data: jsonData,
    };

    let recordLengthValue = maxCount;
    if(!isReset){
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

  const renderUserImage = (userName) => {
    if (userName) {
      return (
        <img
          onError={(event) => addDefaultSrc(event)}
          src={apiConfig.BASE_USER_IMAGE_URL.concat(userName)}
          height={50}
          width={50}
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
    getPeople(recordLength);
  };

  const handlePrevClick = () => {
    setComponentLoader(true);
    setPeopleData([]);
    getPeople(recordLength - maxCount * 2, true);
  };

  const handleAutocompleteChange = (userId) => {
    setPeopleData([]);
    setRecordLength(0);
    setUserId(userId);
    let isReset = false;
    if(userId <= 0){
      isReset = true;
    }
    getPeople(0, false, userId, isReset);
    console.log(userId);
  };

  return (
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
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            onInput={(event) => searchPeople(event.target.value)}
          />
        </div>
          {/* <UserAutocomplete
            className=""
            defaultHopper={""}
            defaultHopperId={0}
            handleAutocompleteChange={handleAutocompleteChange}
          ></UserAutocomplete> */}
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
      <div className="people-image-list">
        <Grid container spacing={3}>
          {peopleData.length ? (
            peopleData.map((people) => (
              <Grid item lg={3} md={3} xs={3} sm={3}>
                <Box>
                  <Icon className="s-option-auto-image">
                    {renderUserImage(people.ShortUserName)}
                  </Icon>
                  <Typography
                    className={classes.fontWeight}
                    variant="caption"
                    display="block"
                    gutterBottom
                  >
                    {people.FullName ? people.FullName : people.ShortUserName}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
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
            <div style={{ height: "2rem" }}>
              {componentLoader ? "Loading please wait..!!" : "No Data Found"}
            </div>
          )}
        </Grid>
      </div>
      { !userId > 0 ? <div>
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
      </div> : "" }

      {/* </Slider> */}
    </Box>
  );
}
