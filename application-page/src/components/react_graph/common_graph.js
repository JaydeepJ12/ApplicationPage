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

const StatusGraph = (props) => {
  
  // need to either get defind colors from db, or define them
  //in the front end
  const obj = props.data
  return(<BarChart width={800} height={300} data={obj}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    {
    obj.map((key, idx)=>{return <Bar dataKey={key.name} />})
    }
  </BarChart>)
}

// coulds tranform to jsx element that takes props
const StatusPriorityGraph = (props) => {
  
  // need to either get defind c olors from db, or define them
  //in the front end
  const obj = props.data
  const keys = Object.keys(obj[0])
  keys.shift()
  return(<BarChart width={400} height={300} data={obj}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="No Due Date" stackId="a" />
    <Bar dataKey="Not Due" stackId="a" fill="#855CF8" />
    <Bar dataKey="Past Due" stackId="a" fill="#c6b3e6" />
    <Bar dataKey="Due" stackId="a" fill="#c6b3e6" />
  </BarChart>)
}

const AssignedToGraph = (props) => {
  
  // need to either get defind c olors from db, or define them
  //in the front end
  const obj = props.data
  const keys = Object.keys(obj[0])
  keys.shift()
  return(<BarChart width={800} height={300} data={obj}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="No Due Date" stackId="r" />
    <Bar dataKey="Not Due" stackId="r" fill="#855CF8" />
    <Bar dataKey="Past Due" stackId="r" fill="#c6b3e6" />
    <Bar dataKey="Due" stackId="r" fill="#c6b3e6" />
  </BarChart>)
}


export default function Example(props) {
  const [caseData, setCaseData] = useState(false);
  const [refresh, setRefresh] = useState(0);

  console.log(props.caseData)

  useEffect(() => {
    case_type_data(props.caseTypes) 
      .then((response) => {
        console.log(response.data)
        setCaseData(response.data);
      })
      .catch((error) => {
        console.log("catch", error);
      });
  }, []);


  return (
    <div className="grpah">
      {
        //<Button color="primary" onClick={()=>{setRefresh(refresh+1)}}>Refresh</Button>
      }
      <Typography
        style={{ textAlign: "center" }}
        variant="h5"
        component="h5"
        gutterBottom
      >
        Case Type Status
      </Typography>
      {
      caseData ? 
      <div> 
        
        <StatusPriorityGraph data={caseData.count_by_status_priority}/>
        <StatusGraph data={caseData.count_by_status}/>
        <AssignedToGraph data={caseData.count_by_assigned_to}/>

      </div>:<div></div>
    }
    </div>
  );
}
