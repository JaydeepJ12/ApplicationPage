import { Grid, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import ComponentLoader from "../common/component-loader";

// we get all the data for all of the graphs from teh first call
// so we should use that every time
const case_type_data = (ids) => {
  return axios.get(`visuals/case_overview?case_types=${ids}`);
};

const StatusGraph = (props) => {
  // need to either get defined colors from db, or define them in the front end
  const obj = props.data;
  return (
    <BarChart width={500} height={300} data={obj}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" align="right" />
      {obj.map((key, idx) => {
        return <Bar dataKey={key.name} />;
      })}
    </BarChart>
  );
};

// could transform to jsx element that takes props
const StatusPriorityGraph = (props) => {
  // need to either get defined colors from db, or define them in the front end
  const obj = props?.data;
  let keys = [];
  if (obj.length) {
    keys = Object.keys(obj[0]);
    keys.shift();
  }

  return (
    <BarChart width={500} height={300} data={obj}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" align="right" />
      <Bar dataKey="No Due Date" stackId="a" fill="#000000" />
      <Bar dataKey="Not Due" stackId="a" fill="#808080" />
      <Bar dataKey="Past Due" stackId="a" fill="#ff8c00" />
      <Bar dataKey="Due" stackId="a" fill="#d1d1d1" />
    </BarChart>
  );
};

const AssignedToGraph = (props) => {
  // need to either get defined colors from db, or define them in the front end
  const obj = props?.data;
  let keys = [];
  if (obj.length) {
    keys = Object.keys(obj[0]);
    keys.shift();
  }
  return (
    <BarChart width={1100} height={300} data={obj}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" align="right" />
      <Bar dataKey="No Due Date" stackId="r" fill="#000000" />
      <Bar dataKey="Not Due" stackId="r" fill="#808080" />
      <Bar dataKey="Past Due" stackId="r" fill="#ff8c00" />
      <Bar dataKey="Due" stackId="r" fill="#d1d1d1" />
    </BarChart>
  );
};

export default function GraphVisuals(props) {
  const [caseData, setCaseData] = useState(false);

  const getCaseTypeData = () => {
    setCaseData(false);
    case_type_data(props.caseTypes)
      .then((response) => {
        setCaseData(response.data);
      })
      .catch((error) => {
        console.log("catch", error);
      });
  };

  useEffect(() => {
    getCaseTypeData();
  }, []);

  return (
    <div className="page" id="page-department">
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} xs={12} sm={12}>
          <div className="grpah">
            <Typography
              style={{ textAlign: "center" }}
              variant="h5"
              component="h5"
              gutterBottom
            >
              Case Type Status
            </Typography>
            {caseData ? (
              <Grid container spacing={3}>
                <Grid item lg={6} md={6} xs={12} sm={12}>
                  <StatusPriorityGraph
                    data={caseData.count_by_status_priority}
                  />
                </Grid>
                <Grid item lg={6} md={6} xs={12} sm={12} className="v-scroll">
                  <StatusGraph data={caseData.count_by_status} />
                </Grid>

                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <AssignedToGraph data={caseData.count_by_assigned_to} />
                </Grid>
              </Grid>
            ) : (
              <ComponentLoader type="rect" />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
