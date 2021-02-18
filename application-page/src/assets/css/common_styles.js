import { makeStyles } from "@material-ui/core";
const drawerWidth = 240;
export default makeStyles(
  (theme) => {
    return {
      // margin class
      m_one: {
        margin: theme.spacing(2),
      },
      mt_one: {
        marginTop: theme.spacing(2),
      },
      mb_one: {
        marginBottom: theme.spacing(2),
      },
      mr_one: {
        marginRight: theme.spacing(2),
      },
      ml_one: {
        marginLeft: theme.spacing(2),
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
      ex_large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
      },

      form: {
        "& .MuiTextField-root": {
          marginBottom: theme.spacing(1),
          minWidth: `calc(100%)`,
        },
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
      paper: {
        padding: theme.spacing(1),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
      },
      fixedHeight: {
        height: "70vh",
        overflow: "auto",
      },
      fixedHeightCard: {
        height: "75vh",
        overflow: "auto",
      },
      // use for side by side form field
      form_root: {
        "& .MuiTextField-root": {
          margin: theme.spacing(1),
          width: "31ch",
        },
      },
      root: {
        flexGrow: 1,
      },

      paper: {
        textAlign: "center",
        color: theme.palette.text.secondary,
      },
      inputLabel: {
        color: "red",
      },

      //top DropDown (10/2/2021)
      listHeader: {
        paddingBottom: 0,
      },
      listSubHeader: {
        height: 23,
        fontSize: "1.25rem",
      },
      listHeaderItem: {
        textAlign: "right",
      },
      skeletonWidth: {
        width: 200,
        height: 50,
      },
    };
  },
  { index: 1 }
);
