import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
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

export default function Example(props) {
  const [useCanvas, setUseCanvas] = useState(false);
  const [casetype, setCaseType] = useState();
  const [filter, setfilter] = useState(null);
  const [hovered, sethovered] = useState(null);
  const [highlighting, sethighlighting] = useState(false);
  useEffect(() => {
    axios
      .get("cases/case_type?case_type=6,19&color_sequence=red,goldenrod,yellow")
      .then((response) => {
        setCaseType(response.data.data);
      })
      .catch((error) => {
        console.log("catch", error);
      });
  }, [casetype]);
  return (
    <div className="grpah">
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
