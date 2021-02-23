import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "2015",
    uv: 85,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "2016",
    uv: 134,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "2017",
    uv: 808,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "2018",
    uv: 83821,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "2019",
    uv: 86056,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "2020",
    uv: 90225,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "2021",
    uv: 120615,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "2022",
    uv: 1637579,
    pv: 4300,
    amt: 2100,
  },
];

function ActiveEntity() {
  const [entityData, setEntityData] = useState(data);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        {/* <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        /> */}
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ActiveEntity;
