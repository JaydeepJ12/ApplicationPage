import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
// // icons
import { Notifications, Settings } from "@material-ui/icons";
import PropTypes from "prop-types";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import Peoples from "./people/people";


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
  image_spacing: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(4),
    },
  },
  root2: {
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function OverView(props) {
  const theme = useTheme();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [age, setAge] = React.useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleClick = (props) => {
    props.navigate("/case-select");
  };
  var SilderSetting = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="page" id="page-overview">
      <Container>
        <Grid container spacing={3}>
    
          
          <Grid item lg={12} md={12} xs={12} sm={12}>
            <Box
              boxShadow={0}
              className="card card-task-overview"
              borderRadius={35}
            >
              <Grid container>
                <Grid
                  item
                  lg={2}
                  md={2}
                  xs={12}
                  sm={2}
                  justify="center"
                  className="vertical-center"
                >
                  <form>
                    <div
                      className=""
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        handleClick(props);
                      }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        className="btn btn-create-button btn-primary rounded-pill"
                        variant="contained"
                        color="primary"
                      >
                        + Create
                      </Button>
                    </div>
                  </form>
                </Grid>
                <Grid item lg={8} md={8} xs={12} sm={8}>
                  <div className={classes.root2}>
                    <Paper elevation={3}>
                      <AppBar position="static" elevation={3}>
                        <Tabs
                          className="nav-tab-list"
                          value={value}
                          onChange={handleChange}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="fullWidth"
                          aria-label="full width tabs example"
                        >
                          <Tab
                            className="nav-tab"
                            label="All"
                            {...a11yProps(0)}
                          />
                          <Tab
                            className="nav-tab"
                            label="Tab"
                            {...a11yProps(1)}
                          />
                          <Tab
                            className="nav-tab"
                            label="Tab"
                            {...a11yProps(2)}
                          />
                        </Tabs>
                      </AppBar>
                    </Paper>
                    <SwipeableViews
                      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                      index={value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        Tab-1
                      </TabPanel>
                      <TabPanel value={value} index={1} dir={theme.direction}>
                        Tab-2
                      </TabPanel>
                      <TabPanel value={value} index={2} dir={theme.direction}>
                        Tab-3
                      </TabPanel>
                    </SwipeableViews>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item lg={6} md={6} xs={12} sm={12}>
            <Peoples></Peoples>
          </Grid>
          <Grid item lg={6} md={6} xs={12} sm={12}>
            <Box
              boxShadow={0}
              className="card card-task-overview"
              borderRadius={35}
            >
              <Grid container spacing={3}>
                <Grid item lg={9} md={9} xs={6} sm={6}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Items
                    </InputLabel>
                    <Select
                      className="input-dropdown"
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={age}
                      onChange={handleChange}
                      label="Items"
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

              <div className="people-item-list" style={{ cursor: "pointer" }}>
                <Grid container spacing={7}>
                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <Typography variant="caption" display="block" gutterBottom>
                      COUNT OF ITEMS
                    </Typography>
                  </Grid>

                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <Typography variant="caption" display="block" gutterBottom>
                      COUNT OF ITEMS BY STATUS TYPE
                    </Typography>
                  </Grid>

                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <Typography variant="caption" display="block" gutterBottom>
                      COUNT OF ITEMS BY CATEGORY
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
