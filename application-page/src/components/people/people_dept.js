import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardHeader,
  Grid,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import PropTypes from "prop-types";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import useStyles from "../../assets/css/common_styles";

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
      <Grid container spacing={3}>
        <Grid item lg={3} md={4} xs={12} sm={12}>
          <AppBar position="position" className={classes.appBar}>
            <Toolbar>
              <FilterListIcon />
            </Toolbar>
          </AppBar>
          <Box boxShadow={0} className="card bg-secondary" borderRadius={5}>
            <Card
              padding={0.5}
              style={{ cursor: "pointer" }}
              className={"card-user-case"}
            >
              <CardHeader
                avatar={
                  <Avatar
                    className={classes.large}
                    alt="Test"
                    src="https://material-ui.com/static/images/avatar/1.jpg"
                  />
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
              />
            </Card>
            <Card
              padding={0.5}
              style={{ cursor: "pointer" }}
              className={"card-user-case"}
            >
              <CardHeader
                avatar={
                  <Avatar
                    className={classes.large}
                    alt="Test"
                    src="https://material-ui.com/static/images/avatar/1.jpg"
                  />
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
              />
            </Card>
            <Card
              padding={0.5}
              style={{ cursor: "pointer" }}
              className={"card-user-case"}
            >
              <CardHeader
                avatar={
                  <Avatar
                    className={classes.large}
                    alt="Test"
                    src="https://material-ui.com/static/images/avatar/1.jpg"
                  />
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
              />
            </Card>
            <Card
              padding={0.5}
              style={{ cursor: "pointer" }}
              className={"card-user-case"}
            >
              <CardHeader
                avatar={
                  <Avatar
                    className={classes.large}
                    alt="Test"
                    src="https://material-ui.com/static/images/avatar/1.jpg"
                  />
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
              />
            </Card>
            <Card
              padding={0.5}
              style={{ cursor: "pointer" }}
              className={"card-user-case"}
            >
              <CardHeader
                avatar={
                  <Avatar
                    className={classes.large}
                    alt="Test"
                    src="https://material-ui.com/static/images/avatar/1.jpg"
                  />
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
              />
            </Card>
            <Card
              padding={0.5}
              style={{ cursor: "pointer" }}
              className={"card-user-case"}
            >
              <CardHeader
                avatar={
                  <Avatar
                    className={classes.large}
                    alt="Test"
                    src="https://material-ui.com/static/images/avatar/1.jpg"
                  />
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
              />
            </Card>
            <Card
              padding={0.5}
              style={{ cursor: "pointer" }}
              className={"card-user-case"}
            >
              <CardHeader
                avatar={
                  <Avatar
                    className={classes.large}
                    alt="Test"
                    src="https://material-ui.com/static/images/avatar/1.jpg"
                  />
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
              />
            </Card>
          </Box>
        </Grid>
        <Grid item lg={9} md={8} xs={12} sm={12}>
          <Grid container spacing={3}>
            <Grid item lg={2} md={3} xs={12} sm={12}>
              <div
                className="top-section"
                style={{ textAlign: "left", padding: "5px" ,borderRight:'2px solid #eeeeee' }}
              >
                <Avatar
                  className={classes.ex_large}
                  alt="Test"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </div>
            </Grid>
            <Grid item lg={8} md={9} xs={12} sm={12}>
              <Grid container spacing={1}>
                <Grid item lg={6} md={6} xs={12} sm={12} container>
                  
                      <Grid item lg={6} md={6} xs={6} sm={6}><Typography color={"primary"}>Name: </Typography></Grid>
                      <Grid item lg={6} md={6} xs={6} sm={6}>  <Typography>Dixit Solanki </Typography></Grid>
                      <Grid item lg={6} md={6} xs={6} sm={6}><Typography color={"primary"}>Job: </Typography></Grid>
                      <Grid item lg={6} md={6} xs={6} sm={6}>  <Typography>Software  Engineer </Typography></Grid>
                      <Grid item lg={6} md={6} xs={6} sm={6}><Typography color={"primary"}>Department: </Typography></Grid>
                      <Grid item lg={6} md={6} xs={6} sm={6}>  <Typography>IT Department </Typography></Grid>
                      <Grid item lg={6} md={6} xs={6} sm={6}><Typography color={"primary"}>Contact Info: </Typography></Grid>
                      <Grid item lg={6} md={6} xs={6} sm={6}>  <Typography>85856959547 </Typography></Grid>
                      <Grid item lg={6} md={6} xs={6} sm={6}><Typography color={"primary"}>Location: </Typography></Grid>
                  <Grid item lg={6} md={6} xs={6} sm={6}>  <Typography>Vadodara </Typography></Grid>
                  <Grid item lg={6} md={6} xs={6} sm={6}><Typography color={"primary"}>Manager: </Typography></Grid>
                  <Grid item lg={6} md={6} xs={6} sm={6}>  <Typography>Michael Fore </Typography></Grid>
                </Grid>
               
              </Grid>
            </Grid>
          </Grid>

          <div className={classes.mt_one}>
            <Paper>
              <AppBar position="static" elevation={1}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="secondary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab className="nav-tab" label="Info" {...a11yProps(0)} />
                  <Tab className="nav-tab" label="Task" {...a11yProps(1)} />
                  <Tab className="nav-tab" label="Acivity" {...a11yProps(2)} />
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
    </div>
  );
}
