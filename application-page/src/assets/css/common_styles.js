import { makeStyles } from "@material-ui/core";
const drawerWidth = 240;
export default makeStyles(
  (theme) => {
 
    return {
      // margin class 
      mt_one: {
        marginTop: theme.spacing(2),
      },
      mb_one: {
        marginBottom: theme.spacing(2),
      },
      // padding class
      pt_zero: {
        paddingTop: theme.spacing(0),
      },
      pb_zero: {
        paddingBottom: theme.spacing(0),
      },
      // badge size
      large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
      },
      form: {
        "& .MuiTextField-root": {
          marginBottom: theme.spacing(1),
          minWidth: `calc(100%)`,
        }
      },
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
      // 
      
    };
  },
  { index: 1 }
);
