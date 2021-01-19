import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React from "react";
import useStyles from "../../assets/css/common_styles";
export default function ItemOverview() {
  var classes = useStyles();
  return (
    <Box
      boxShadow={0}
      className="card bg-secondary"
      color="secondary"
      borderRadius={35}
    >
      <Grid item xs={12} container spacing={3}>
        <Grid item lg={3} md={3} xs={12} sm={12}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              Items
            </InputLabel>
            <Select
              className="input-dropdown"
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
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
          lg={9}
          md={9}
          xs={12}
          sm={12}
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
    </Box>
  );
}
