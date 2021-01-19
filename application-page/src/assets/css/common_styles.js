import { makeStyles } from "@material-ui/core";
const drawerWidth = 240;
export default makeStyles(
  (theme) => {
    console.log("---common -theme", theme);
    return {
      formControl: {
        minWidth: `calc(100%)`,
      },
      input: {
        marginLeft: theme.spacing(1),
      },
      appBar: {
        width: `calc(100%)`,
      },
      // avatar
      avt_small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
      },
      avt_large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
      },
    };
  },
  { index: 1 }
);
