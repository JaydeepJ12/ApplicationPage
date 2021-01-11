import {
    Box,
    Button,
    FormControl,
    Grid,
    Icon,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as apiConfig from "../../components/api_base/api-config";

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
}));

export default function Peoples() {
  const classes = useStyles();
  const [peopleData, setPeopleData] = useState([]);
  const [componentLoader, setComponentLoader] = useState(false);

  const getPeople = async () => {
    setComponentLoader(true);
    var jsonData = {
      maxCount: 16,
      skipCount: 0,
    };
    var config = {
      method: "post",
      url: "http://localhost:5000/cases/getpeople",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        setComponentLoader(false);
        setPeopleData(response.data);
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

  return (
    <Box boxShadow={0} className="card card-task-overview" borderRadius={35}>
      <Grid container spacing={3}>
        <Grid item lg={9} md={9} xs={6} sm={6}>
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
                  {/* <Avatar>{renderUserImage(people.shortUserName)}</Avatar> */}
                  <Icon
                    style={{ marginLeft: "1rem" }}
                    className="s-option-auto-image"
                  >
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
      {/* </Slider> */}
    </Box>
  );
}
