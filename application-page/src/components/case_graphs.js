import axios from "axios";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export default function CaseGraphs(props) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  //create function that just take sthe url and sets a json blob
  const apps = () => {
    axios
      .get("http://127.0.0.1:5000/case_data/".concat(props.appID))
      .then((resp) => setData(resp.data), setLoaded(true))
      .then(console.log(data));
  };

  useEffect(() => {
    apps();
  }, []);
  console.log(loaded);
  if (loaded) {
    return <Plot data={data.data} layout={data.layout}></Plot>;
  }
  return <div>Loading...</div>;
}
