import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Skeleton from "@material-ui/lab/Skeleton";
import useStyles from "../../assets/css/common_styles";
import { navigate } from "@reach/router";

function ActiveEntity(props) {
  const classes = useStyles();
  const [noDataFound, setNoDataFound] = React.useState(false);
  const [graphData, setGraphData] = useState([]);
  React.useEffect(() => {
    async function getEntitiesList(Ids) {
      setNoDataFound(false);
      var data = JSON.stringify({ entityTypeIds: Ids });
      var config = {
        method: "post",
        url: "/entity/entity_list_byId",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          if (response.data.length) {
            getSetGraphData(response.data);
          } else {
            setNoDataFound(true);
          }
        })
        .catch(function (error) {
          console.log(error);
          // navigateToErrorPage(error?.message);
        });
    }
    if (props.entityListId.trim() !== "") {
      getEntitiesList(props.entityListId);
    }
  }, [props.entityListId]);

  const getSetGraphData = (data) => {
    const graphArray = data.reduce((total, value) => {
      total[value.CreatedDate] = (total[value.CreatedDate] || 0) + value.count;
      return total;
    }, []);
    var graphObject = Object.keys(graphArray).map((e) => ({
      name: e,
      Count: graphArray[e],
    }));
    let sum = 0;
    const cumulativeData = graphObject.map(function (data) {
      return { name: data.name, Count: (sum += data.Count) };
    }, []);
    setGraphData(cumulativeData);
  };

  return (
    <>
      {graphData?.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={graphData}
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
            <Bar dataKey="pv" stackId="a" fill="#8884d8" />
            <Bar dataKey="Count" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <>
          {noDataFound ? (
            <>No Data Found</>
          ) : (
            <div>
              <Skeleton className={classes.skeletonWidth} />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ActiveEntity;
