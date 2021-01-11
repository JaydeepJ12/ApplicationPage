import {
  Card,
  fade,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  Toolbar,
  withStyles
} from "@material-ui/core";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import * as notification from "../components/common/toast";
import CaseList from "./case-list";
import CaseViewer from "./case_viewer";
import Loading from "./Loader";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: "90vh",
    overflow: "auto",
  },
  caseDetails: {
    padding: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function ViewCase() {
  const [caseId, setCaseId] = useState(0);
  const [caseData, setCaseData] = useState([]);
  const [caseListData, setCaseListData] = useState([]);
  const [filteredCaseListData, setFilteredCaseListData] = useState([]);
  const [loaded, setLoaded] = useState(true);
  const [maxCount, setMaxCount] = useState(50);
  const [pageSize, setPageSize] = useState(50);
  const [searchTextValue, setSearchTextValue] = useState("");
  const [caseLoaded, setCaseLoaded] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [caseFilter, setCaseFilter] = useState(0);
  const timeoutRef = useRef(null);
  const [caseListFiltered, setCaseListFiltered] = useState(false);
  const [componentLoader, setComponentLoader] = useState(false);
  const [caseTypeData, setCaseTypeData] = useState([]);
  const [caseTypeIdValue, setCaseTypeIdValue] = useState(0);
  const [state, setState] = React.useState(0);
  const [labelWidth, setLabelWidth] = React.useState(0);

  const inputLabel = React.useRef(null);
  let timeoutVal = 1000; // time it takes to wait for user to stop typing in ms

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCasePreviewClick = (caseId, caseData) => {
    setCaseId(caseId);
    setCaseData(caseData);
  };

  const handleCaseLoaded = (value) => {
    setCaseLoaded(value);
  };

  const handleDocumentList = (documentList) => {
    setDocumentList(documentList);
  };

  const handleFilterCaseList = (
    filter,
    isFilterByType = true,
    isCaseListFilterByCaseList = false,
    caseTypeId = 0
  ) => {
    if (!caseListFiltered) {
      notification.toast.warning("Please wait...!!");
      return false;
    }
    caseTypeId = caseTypeId ? caseTypeId : caseTypeIdValue;
    setState(caseTypeId);
    setComponentLoader(true);
    setCaseFilter(filter);
    caseList(
      "",
      0,
      false,
      filter,
      isFilterByType,
      isCaseListFilterByCaseList,
      caseTypeId
    );
  };

  const caseTypes = async () => {
    setComponentLoader(true);
    await axios.get("http://localhost:5000/cases/caseTypes").then((resp) => {
      setCaseTypeData(resp.data);
      caseList("", 0, false, 0, false, true, resp.data[0]?.CASE_TYPE_ID);
    });
  };

  const caseList = async (
    searchText = "",
    skipCount = 0,
    loadMore = false,
    filter = 0,
    isFilterByType = false,
    isFilterByCaseType = false,
    caseTypeId = 0
  ) => {
    if (isFilterByCaseType) {
      caseTypeId = Number(caseTypeId);
      setCaseTypeIdValue(caseTypeId);
    }

    if (isFilterByType) {
      setCaseListFiltered(false);
    }
    if (loadMore && caseFilter > 0) {
      return false;
    }

    if (!loadMore && !isFilterByType && !isFilterByCaseType) {
      setLoaded(false);
      skipCount = 0;
    }
    var jsonData = {
      Username: "bhaviks",
      TypeId: caseTypeId > 0 ? caseTypeId : caseTypeIdValue,
      PageSize: pageSize,
      MaxCount: maxCount,
      SkipCount: skipCount,
      CurrentPage: 1,
      Ascending: false,
      SortColumn: null,
      Filter: filter,
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
        setCaseListFiltered(true);
        setCaseListData([]);
        setFilteredCaseListData([]);
        setComponentLoader(false);
        let caseHeadersData = response?.data?.responseContent;
        if (
          caseHeadersData.length &&
          !loadMore &&
          !isFilterByType &&
          (!isFilterByCaseType || caseTypeIdValue == 0)
        ) {
          setCaseListData(caseHeadersData);
          setFilteredCaseListData(caseHeadersData);
          setCaseData(caseHeadersData[0]);
          setCaseId(caseHeadersData[0].caseID);
          setLoaded(true);
        } else if (caseHeadersData.length && loadMore) {
          caseHeadersData = caseListData.concat(caseHeadersData);
          setCaseListData(caseHeadersData);
          setFilteredCaseListData(caseHeadersData);
        } else if (
          caseHeadersData.length &&
          (isFilterByType || isFilterByCaseType)
        ) {
          setCaseListData(caseHeadersData);
          setFilteredCaseListData(caseHeadersData);
        }
        setComponentLoader(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    caseTypes();
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const createLoader = () => {
    return <Loading />;
  };

  const onScroll = (caseListData, event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom && !searchTextValue) {
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
        setSearchTextValue(searchText);
        setFilteredCaseListData([]);
        getCases(searchText, event);
      } else {
        setSearchTextValue("");
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
    <div className="page" id="page-view-case">
      <Card>
      <Grid container spacing={0}>
      
        {loaded ? (
          <>
          {/* dont remove this code its usefull for reference of work after confirm i will remove this */}
            {/* <AppBar position="static" className="inner-navigation bg-primary">
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
                <div>
                  <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                  >
                    Document List
                  </Button>
                  <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {documentList.length
                      ? documentList.map((option) => (
                          <StyledMenuItem>
                            <ListItemIcon>
                              <SendIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Sent mail" />
                          </StyledMenuItem>
                        ))
                      : "Documents not uploaded..!!"}
                  </StyledMenu>
                </div>
              </Toolbar>
            </AppBar> */}
           
              <Grid item xs={12} sm={3} md={3} lg={3} className="panel-left">
                  <div
                    className={fixedHeightPaper}
                    onScroll={(event) => onScroll(caseListData, event)}
                  >
                    <FormControl
                      style={{ width: "-webkit-fill-available" }}
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel
                        htmlFor="outlined-caseType-native-simple"
                        shrink
                        ref={inputLabel}
                      >
                        Case Types
                      </InputLabel>
                      <Select
                        native
                        value={state.caseTypeId}
                        onChange={(event) =>
                          handleFilterCaseList(
                            0,
                            false,
                            true,
                            event.target.value
                          )
                        }
                        label="Case Type"
                        inputProps={{
                          caseTypeId: "caseTypeId",
                          id: "outlined-caseType-native-simple",
                        }}
                        input={
                          <OutlinedInput
                            notched
                            labelWidth={labelWidth}
                            name="caseType"
                            id="outlined-caseType-always-notched"
                          />
                        }
                        fullWidth={true}
                      >
                        {caseTypeData.length
                          ? caseTypeData.map((option) => (
                              <option
                                key={option.CASE_TYPE_ID}
                                value={option.CASE_TYPE_ID}
                              >
                                {option.NAME}
                              </option>
                            ))
                          : []}
                      </Select>
                    </FormControl>
                    <CaseList
                      handleCasePreviewClick={handleCasePreviewClick}
                      handleFilterCaseList={handleFilterCaseList}
                      caseListData={
                        filteredCaseListData.length ? filteredCaseListData : []
                      }
                      caseLoaded={caseLoaded}
                      componentLoader={componentLoader}
                    ></CaseList>
                  </div>
              </Grid>
              {/* Recent Deposits */}
            
               
                  {caseId > 0 ? (
                    <CaseViewer
                      caseId={caseId}
                      caseData={caseData}
                      handleCaseLoaded={handleCaseLoaded}
                      handleDocumentList={handleDocumentList}
                    ></CaseViewer>
                  ) : (
                    ""
                  )}
              
         
         
          </>
        ) : (
          ""
        )}
        {!loaded ? createLoader() : []}
      
        </Grid>
        </Card>
    </div>
  );
}
