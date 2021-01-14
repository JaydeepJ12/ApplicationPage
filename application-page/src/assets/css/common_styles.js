import { makeStyles } from "@material-ui/core";
const drawerWidth = 240;
export default makeStyles((theme) => {
  return {
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    appBar: {
      width: `calc(100%)`,
    },
  };
}, {index: 1});
