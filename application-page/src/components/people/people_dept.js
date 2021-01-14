import React from "react";
import {
  Grid,
  Box,
  Card,
  AppBar,
  Toolbar,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tab,
  Tabs,
  makeStyles,
  Typography
} from "@material-ui/core";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useTheme } from "@material-ui/core/styles";
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
  const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  card: {
    margin: 10,
  },
  listItem: {
    textAlign: "right",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));
export default function PeopleDepartment() {
    const theme = useTheme();
  var classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  return (
    <div className="page" id="page-overview">
      <Card>
        <Grid container spacing={3}>
          <Grid item lg={3} md={3} xs={12} sm={12}>
            <AppBar position="position" className={classes.appBar}>
              <Toolbar>
                <FilterListIcon />
              </Toolbar>
            </AppBar>
            <div className={"st-p-1"}>
              <Card
                style={{ cursor: "pointer", marginBottom: "10px" }}
                className={"card card-people-dpt"}
              >
                <List>
                  <ListItem>
                    <ListItemAvatar>
                    <Avatar
                            alt="Test"
                            src="https://s3-alpha-sig.figma.com/img/67fb/f195/182fba98c8d3f90d0466b52daece2698?Expires=1610928000&Signature=WbTSsAC2RK2pr2DDwOxX44kddohUxpwnCq9Y6QFkJ73fvWpfBn1w~~Sf0GxfLpuyhu4Csza5VpKa8kFbKUA1Y5-7zAnpeqSUCspdUnnkWyyPC1mFkBdkKp~yZbsnHIENumo3wTmvz~pSDdHoyFgxOREPaCWOQukUjXQrVyem4QY~wYdbkQLOeeorCecTzOi-qcXS1PqXe~tT1qpZuytEbfpy~oo~RysXbXrfUNdpIQ4HcSKnw7I-dgJuwvx5U2mWkX8CorMgQi5dmwYd5Dwyyvd-gD7cUJUP~PFYBJ0sxIGwMb-lfz9oCe~X80q4bacvjJb9-77-HrQuQ5N3yC8Vng__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
                          />
                    </ListItemAvatar>
                 
                    <ListItemText primary="Dixit Solanki" />
                    <ListItemText secondary="Fullstack Developer" />
                  </ListItem>
                </List>
              </Card>

              <Card
                style={{ cursor: "pointer", marginBottom: "10px" }}
                className={"card card-people-dpt"}
              >
                <List>
                  <ListItem>
                    <ListItemAvatar>
                    <Avatar
                            alt="Test"
                            src="https://s3-alpha-sig.figma.com/img/67fb/f195/182fba98c8d3f90d0466b52daece2698?Expires=1610928000&Signature=WbTSsAC2RK2pr2DDwOxX44kddohUxpwnCq9Y6QFkJ73fvWpfBn1w~~Sf0GxfLpuyhu4Csza5VpKa8kFbKUA1Y5-7zAnpeqSUCspdUnnkWyyPC1mFkBdkKp~yZbsnHIENumo3wTmvz~pSDdHoyFgxOREPaCWOQukUjXQrVyem4QY~wYdbkQLOeeorCecTzOi-qcXS1PqXe~tT1qpZuytEbfpy~oo~RysXbXrfUNdpIQ4HcSKnw7I-dgJuwvx5U2mWkX8CorMgQi5dmwYd5Dwyyvd-gD7cUJUP~PFYBJ0sxIGwMb-lfz9oCe~X80q4bacvjJb9-77-HrQuQ5N3yC8Vng__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
                          />
                    </ListItemAvatar>
                 
                    <ListItemText primary="Dixit Solanki" />
                    <ListItemText secondary="Fullstack Developer" />
                  </ListItem>
                </List>
              </Card>
            </div>
          </Grid>
          <Grid item lg={9} md={9} xs={12} sm={12}>
              <div className="top-section" style={{'textAlign':'left','padding':'5px'}}>
              <Avatar className={classes.large} 
                            alt="Test"
                            src="https://s3-alpha-sig.figma.com/img/67fb/f195/182fba98c8d3f90d0466b52daece2698?Expires=1610928000&Signature=WbTSsAC2RK2pr2DDwOxX44kddohUxpwnCq9Y6QFkJ73fvWpfBn1w~~Sf0GxfLpuyhu4Csza5VpKa8kFbKUA1Y5-7zAnpeqSUCspdUnnkWyyPC1mFkBdkKp~yZbsnHIENumo3wTmvz~pSDdHoyFgxOREPaCWOQukUjXQrVyem4QY~wYdbkQLOeeorCecTzOi-qcXS1PqXe~tT1qpZuytEbfpy~oo~RysXbXrfUNdpIQ4HcSKnw7I-dgJuwvx5U2mWkX8CorMgQi5dmwYd5Dwyyvd-gD7cUJUP~PFYBJ0sxIGwMb-lfz9oCe~X80q4bacvjJb9-77-HrQuQ5N3yC8Vng__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
                          />
              </div>
          <div>
              
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
                            label="Info"
                            {...a11yProps(0)}
                          />
                          <Tab
                            className="nav-tab"
                            label="Task"
                            {...a11yProps(1)}
                          />
                          <Tab
                            className="nav-tab"
                            label="Acivity"
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
                        Info
                      </TabPanel>
                      <TabPanel value={value} index={1} dir={theme.direction}>
                        Task
                      </TabPanel>
                      <TabPanel value={value} index={2} dir={theme.direction}>
                       Activity
                      </TabPanel>
                    </SwipeableViews>
                  </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
