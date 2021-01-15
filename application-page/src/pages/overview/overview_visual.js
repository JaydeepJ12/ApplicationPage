import {
    Box,
    Grid,
    Button,
    AppBar,
    Tab,
    Tabs,
    Paper,
    Typography
  } from "@material-ui/core";
  
import SwipeableViews from 'react-swipeable-views';
import { navigate } from "@reach/router";
import React, {useState} from "react";
import { useTheme } from "@material-ui/core/styles";


const TabPanel = (props) => {
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

export default function VisualOverview(){

  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  
  const handleClick = (props) => {
    navigate("/react/case-select", {
      state: { isParent: true, isChild: false },
    });
  };
  
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

return (
    
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
        <Button
            onClick={() => {
            handleClick();
            }}
            variant="contained"
            size="large"
            className="btn btn-create-button btn-primary rounded-pill"
            variant="contained"
            color="primary"
        >
            + Create
        </Button>
        </form>
    </Grid>
    <Grid item lg={8} md={8} xs={12} sm={8}>
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
          </Grid>)
                }