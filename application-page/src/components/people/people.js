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
import React from "react";

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
}));

export default function Peoples() {
  const classes = useStyles();

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
          <Grid item lg={3} md={3} xs={3} sm={3}>
            <Box>
              <Icon className="s-option-auto-image">
                <img
                  src={"https://material-ui.com/static/images/avatar/1.jpg"}
                  height={50}
                  width={50}
                />
              </Icon>
              <Typography variant="caption" display="block" gutterBottom>
                Dixit Solanki
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                (10)
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                (50)
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={3} md={3} xs={3} sm={3}>
            <Box>
              <Icon className="s-option-auto-image">
                <img
                  src={"https://material-ui.com/static/images/avatar/1.jpg"}
                  height={50}
                  width={50}
                />
              </Icon>
              <Typography variant="caption" display="block" gutterBottom>
                Dixit Solanki
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                (10)
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                (50)
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={3} md={3} xs={3} sm={3}>
            <Box>
              <Icon className="s-option-auto-image">
                <img
                  src={"https://material-ui.com/static/images/avatar/1.jpg"}
                  height={50}
                  width={50}
                />
              </Icon>

              <Typography variant="caption" display="block" gutterBottom>
                Dixit Solanki
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                (10)
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                (50)
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={3} md={3} xs={3} sm={3}>
            <Box>
              <Icon className="s-option-auto-image">
                <img
                  src={"https://material-ui.com/static/images/avatar/1.jpg"}
                  height={50}
                  width={50}
                />
              </Icon>
              <Typography variant="caption" display="block" gutterBottom>
                Dixit Solanki
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                (10)
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                (50)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </div>
      {/* </Slider> */}
    </Box>
  );
}
