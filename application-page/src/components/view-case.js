import { Container } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { fade, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import CaseList from "./case-list";
import CaseViewer from "./case_viewer";
import Loading from "./Loader";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    float: "left",
    marginLeft: "12rem",
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
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
  accordionSam: {
    height: "80vh",
    overflow: "auto",
  },
  caseDetails: {
    padding: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    // width: '100%'
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    // transition: theme.transitions.create('width'),
    width: "100%",
  },
}));

export default function ViewCase() {
  const [caseId, setCaseId] = useState(0);
  const [caseData, setCaseData] = useState([]);
  const [caseListData, setCaseListData] = useState([]);
  const [filteredCaseListData, setFilteredCaseListData] = useState([]);
  const [loaded, setLoaded] = useState(true);
  const [maxCount, setMaxCount] = useState(50);
  const [pageSize, setPageSize] = useState(50);
  const timeoutRef = useRef(null);

  let timeoutVal = 1000; // time it takes to wait for user to stop typing in ms

  const handleCasePreviewClick = (caseId, caseData) => {
    setCaseId(caseId);
    setCaseData(caseData);
  };

  const caseList = async (searchText = "", skipCount = 0, loadMore = false) => {
    if (!loadMore) {
      setLoaded(false);
      skipCount = 0;
    }
    var jsonData = {
      Username: "bhaviks",
      TypeId: 19,
      PageSize: pageSize,
      MaxCount: maxCount,
      SkipCount: skipCount,
      CurrentPage: 1,
      Ascending: false,
      SortColumn: null,
      Filter: 0,
      Filters: null,
      TypeIdsForGrouping: null,
    };

    var config = {
      method: "post",
      url: "http://localhost:5000/cases/GetCaseHeaders",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        let caseHeadersData = response?.data?.responseContent;
        if (caseHeadersData.length && !loadMore) {
          setCaseListData(caseHeadersData);
          setFilteredCaseListData(caseHeadersData);
          setCaseData(caseHeadersData[0]);
          setCaseId(caseHeadersData[0].caseID);
          setLoaded(true);
        } else if (caseHeadersData.length && loadMore) {
          caseHeadersData = caseListData.concat(caseHeadersData);
          setCaseListData(caseHeadersData);
          setFilteredCaseListData(caseHeadersData);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    caseList();
  }, []);

  const createLoader = () => {
    return <Loading />;
  };

  const loadMoreCaseList = async (searchText = "", skipCount = 0) => {
    if (searchText !== "") {
      skipCount = 0;
    }

    var jsonData = {
      Username: "bhaviks",
      TypeId: 19,
      PageSize: pageSize,
      MaxCount: maxCount,
      SkipCount: skipCount,
      CurrentPage: 1,
      Ascending: false,
      SortColumn: null,
      Filter: 0,
      Filters: null,
      TypeIdsForGrouping: null,
    };

    var config = {
      method: "post",
      url: "http://localhost:5000/cases/GetCaseHeaders",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        let responseData = response?.data?.responseContent;
        if (responseData) {
          responseData = caseListData.concat(responseData);
          setCaseListData(responseData);
          setFilteredCaseListData(responseData);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onScroll = (caseListData, event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      //   alert('bottom');
      caseList("", caseListData?.length, true);
    }
  };

  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const CaseDetailsPaper = clsx(
    classes.paper,
    classes.fixedHeight,
    classes.caseDetails
  );

  const searchCase = (searchText, event) => {
    if (timeoutRef.current !== null) {
      // IF THERE'S A RUNNING TIMEOUT
      clearTimeout(timeoutRef.current); // THEN, CANCEL IT
    }
    if (searchText != "") {
    }

    timeoutRef.current = setTimeout(() => {
      // SET A TIMEOUT
      timeoutRef.current = null; // RESET REF TO NULL WHEN IT RUNS
      if (searchText) {
        setFilteredCaseListData([]);
        getCases(searchText, event);
      } else {
        setFilteredCaseListData(caseListData);
        setCaseListData(caseListData);
      }
    }, timeoutVal);
  };

  const getCases = async (searchText, event) => {
    let currentCaseListData = [...caseListData];

    if (currentCaseListData.length) {
      let filteredCurrentCaseListData = [];
      for (var i = 0; i < currentCaseListData.length; i++) {
        var assignedToFullName = currentCaseListData[i].assignedToFullName
          ? currentCaseListData[i].assignedToFullName.toLowerCase()
          : currentCaseListData[i].assignedTo;
        var caseTitle = currentCaseListData[i].title?.toLowerCase();
        if (
          assignedToFullName.includes(searchText.toLowerCase()) ||
          caseTitle.includes(searchText.toLowerCase())
        ) {
          filteredCurrentCaseListData.push(currentCaseListData[i]);
        }
      }

      if (filteredCurrentCaseListData.length) {
        setFilteredCaseListData(filteredCurrentCaseListData);
      } else {
        setFilteredCaseListData(filteredCurrentCaseListData);
      }
    }
  };

  return (
    <div className={classes.root}>
      {loaded ? (
        <main className={classes.content}>
           <Container className={classes.container}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="open drawer"
                >
                  <MenuIcon />
                </IconButton>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ "aria-label": "search" }}
                    onInput={(event) => searchCase(event.target.value, event)}
                  />
                </div>
              </Toolbar>
            </AppBar>
            <Grid container spacing={1}>
              {/* Chart */}
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Paper>
                  <div
                    className={fixedHeightPaper}
                    onScroll={(event) => onScroll(caseListData, event)}
                  >
                    <CaseList
                      handleCasePreviewClick={handleCasePreviewClick}
                      caseListData={
                        filteredCaseListData.length
                          ? filteredCaseListData
                          : []
                      }
                    ></CaseList>
                  </div>
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} sm={6} md={8} lg={8}>
                <Paper className={CaseDetailsPaper}>
                  {caseId > 0 ? (
                    <CaseViewer
                      caseId={caseId}
                      caseData={caseData}
                    ></CaseViewer>
                  ) : (
                    ""
                  )}
                </Paper>
              </Grid>
              {/* Recent Orders */}
              {/* <Grid item xs={12}>
              <Paper className={classes.paper}></Paper>
            </Grid> */}
            </Grid>
          </Container>
        </main>
      ) : (
        ""
      )}
      {!loaded ? createLoader() : []}
    </div>
  );
}
