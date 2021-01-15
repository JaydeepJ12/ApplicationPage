import {
    Box,
    Grid,
    Typography
  } from "@material-ui/core";

import Peoples from "../../components/people/people";
import React, {useState} from "react";
import { useTheme } from "@material-ui/core/styles";

export default function ItemOverview(){

 return (   
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
</div>)}