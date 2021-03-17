import React, { useEffect ,useState} from "react";
import {
  Box,
  Fab,
  Grid,
  MenuItem,
  TextField,
  Container,
  Card,
} from "@material-ui/core";
import axios from 'axios';
export default function EntityCreator() {
  // get all entity type
  const[ allEntityTypeData,setAllEntityTypeData] =useState([0]) 
  
  const getEntityType = async () => {
    var config = {
      method: "GET",
      url: "/entity/GetEntityAllTypeList",
    };

    axios(config)
      .then(function (response) {
         if(response){
          setAllEntityTypeData(response.data);
         }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // call Intial useEffect 

  useEffect(() => {
    getEntityType();
  });

  console.log("--allEntityTypeData",allEntityTypeData);
  return (
    <div id="page-case-select" className="page">
      <Container className="">
        <Grid item xs={12}>
          <Card>
            <form className="st-p-2">
              <div className="drp-select-case-type">
                <TextField
                  id={"EntityType"}
                  name="EntityType"
                  select
                  label="Entity Type"
                  fullWidth={true}
                  required
                  disabled={true}
                >
                  <MenuItem key="0" value="0">
                    {"Please Select Entity Type"}
                  </MenuItem>
                </TextField>
              </div>
            </form>
          </Card>
        </Grid>
      </Container>
    </div>
  );
}
