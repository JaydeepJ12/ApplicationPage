import {
    Box,
    Grid,
    Button,
    Container,
    FormControl, InputLabel,
    Select, 
    MenuItem
  } from "@material-ui/core";

import Peoples from "../../components/people/people";
import React, {useState} from "react";
import { useTheme } from "@material-ui/core/styles";

export default function PeopleOverview(){
    const [age, setAge] = React.useState("");
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
      

    return(

          <Container>  
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
                  <FormControl variant="outlined">
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
                </Grid>
                </Box>
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
            </Container>    
              
        )

    }