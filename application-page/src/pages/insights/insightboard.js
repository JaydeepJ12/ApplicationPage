import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select
} from "@material-ui/core";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { navigate } from "@reach/router";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useStylesBase from "../../assets/css/common_styles";
import * as notification from "../../components/common/toast";

const useStyles = makeStyles(
  (theme) => ({
    paper: {
      padding: theme.spacing(1),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    fixedHeight: {
      height: "80vh",
      overflow: "auto",
    },
  }),
  { index: 1 }
);

//this component will be how we render dash reports in teh app
//cors policy will be an issue in development
//https://home.boxerproperty.com/Visualize/3d_scatter
export default function Insights() {
  const classes = useStyles();
  const classesBase = useStylesBase();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const reducerState = useSelector((state) => state);
  const [associatedReports, setAssociatedReports] = useState([]);
  const [
    selectedAssociatedReportName,
    setSelectedAssociatedReportName,
  ] = useState("");
  const [noDataFound, setNoDataFound] = useState(false);
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  const getAssociatedReports = async (entityIds) => {
    var jsonData = JSON.stringify({ entityIds: entityIds });

    var config = {
      method: "post",
      url: "/entity/entity_link",
      headers: {
        "Content-Type": "application/json",
      },
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        if (!response.data) {
          setNoDataFound(true);
        }
        setAssociatedReports(response.data);
      })
      .catch(function (error) {
        console.log(error);
        navigateToErrorPage(error?.message);
      });
  };

  const navigateToErrorPage = (message) => {
    navigate(process.env.REACT_APP_ERROR_PAGE, {
      state: {
        errorMessage: message,
      },
    });
  };

  useEffect(() => {
    let entityData = reducerState.applicationData.applicationElements;
    let filteredEntityData = [];
    let isFiltered = false;
    if (entityData && entityData.length) {
      isFiltered = true;
      filteredEntityData = entityData?.filter((x) => x.SYSTEM_CODE === "ASSRP");
    }

    if (filteredEntityData && filteredEntityData.length) {
      let ids = filteredEntityData
        .map(function (x) {
          return x.EXID;
        })
        .join(",");

      getAssociatedReports(ids);
    } else if (isFiltered) {
      setNoDataFound(true);
    }
    setLabelWidth(inputLabel.current.offsetWidth);
  }, [reducerState.applicationData.applicationElements]);

  const handleRedirect = (url) => {
    if (url) {
      window.open(
        url,
        "_blank",
        "location=yes,height=700,width=700,scrollbars=yes,status=yes"
      );
    } else {
      notification.toast.warning("No url available...!!");
      return false;
    }
  };

  const handleAssociatedReportChange = (name) => {
    setSelectedAssociatedReportName(name);
  };

  return (
    <div>
      <div id="react-entry-point">
        <Card>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={3} md={3} lg={3} className="panel-left">
              <div className={fixedHeightPaper}>
                <FormControl
                  variant="outlined"
                  style={{ width: "-webkit-fill-available" }}
                  className={classesBase.mt_one + " " + classesBase.mb_one}
                >
                  <InputLabel
                    ref={inputLabel}
                    htmlFor="outlined-associated-reports-native-simple"
                  >
                    Associated Reports
                  </InputLabel>
                  <Select
                    value={selectedAssociatedReportName}
                    label="Associated Reports"
                    input={
                      <OutlinedInput
                        labelWidth={labelWidth}
                        name="age"
                        id="outlined-associated-reports-native-simple"
                      />
                    }
                    onChange={(event) =>
                      handleAssociatedReportChange(event.target.value)
                    }
                    fullWidth={true}
                  >
                    {associatedReports.length ? (
                      associatedReports.map((option) => (
                        <MenuItem
                          key={option.ENTITY_ID}
                          value={option.ID}
                          onClick={() => handleRedirect(option.NAME)}
                        >
                          {option.ID}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">
                        {noDataFound ? (
                          <em>No Data Available</em>
                        ) : (
                          <em>Please wait..!!</em>
                        )}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>
            </Grid>
          </Grid>
        </Card>
      </div>
      {/* <DashComponent url='http://localhost:8050'></DashComponent> */}
    </div>
  );
}
