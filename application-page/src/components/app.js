import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import {
  Card,
  CardMedia,
  CircularProgress,
  CardContent,
  Typography,
} from "@material-ui/core";

export default function AppDropdown() {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  //create function that just take sthe url and sets a json blob
  const apps = () => {
    axios
      .get("http://127.0.0.1:5000/apps")
      .then((resp) => setData(resp.data))
      .then(setLoaded(true))
      .then(console.log(data));
  };

  useEffect(() => {
    apps();
  }, []);

  if (loaded) {
    console.log(data);
  }

  return (
    <div>
      <CircularProgress />
      {loaded ? (
        data.map((item, idx) => (
          <AppCard image={item.url} title={item.title}></AppCard>
        ))
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  media: {
    aspectRatio: 3 / 2,
    height: 32,
    width: 32, // 16:9
  },
}));

function AppCard(props) {
  const classes = useStyles();

  return (
    <Card>
      <CardMedia
        className={classes.media}
        image={props.image}
        title={props.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {props.title}
        </Typography>
      </CardContent>
    </Card>
  );
}
