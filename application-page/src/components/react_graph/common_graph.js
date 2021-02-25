import React, { useEffect, useState } from "react";
import { Typography, Button } from "@material-ui/core";
// import API from "../api_base/api";
import axios from "axios";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
// we get all the data for all of the graphs from teh first call
// so we should use that every time
const case_type_data = (ids) => {
  return axios.get(`visuals/case_overview?case_types=${ids}`)
}

export default function Example(props) {
  const [casetype, setCaseType] = useState();
  const [refresh, setRefresh] = useState(0);

  console.log(props.caseTypes)

  useEffect(() => {
    case_type_data(props.caseTypes) 
      .then((response) => {
        console.log(response.data)
        setCaseType(response.data.data);
      })
      .catch((error) => {
        console.log("catch", error);
      });
  }, [refresh]);

  return (
    <div className="grpah">
      <Button color="primary" onClick={()=>{setRefresh(refresh+1)}}>Refresh</Button>
      <Typography
        style={{ textAlign: "center" }}
        variant="h5"
        component="h5"
        gutterBottom
      >
        Case Type Status
      </Typography>
      <BarChart width={800} height={300} data={casetype}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="case_type_name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="past_due_case" stackId="a" fill="#263238" />
        <Bar dataKey="not_due" stackId="a" fill="#855CF8" />
        <Bar dataKey="no_due_date" stackId="a" fill="#c6b3e6" />
      </BarChart>
    </div>
  );
}
