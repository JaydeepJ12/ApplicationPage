import { Box, Card, Container } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CaseList from "./case-list";
import CaseViewer from "./case_viewer";
import Loading from "./Loader";

export default function ViewCase() {
  const [caseId, setCaseId] = useState(0);
  const [caseData, setCaseData] = useState([]);
  const [caseListData, setCaseListData] = useState([]);
  const [loaded, setLoaded] = useState(true);
  const [maxCount, setMaxCount] = useState(50);
  const [pageSize, setPageSize] = useState(50);

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
        if (caseHeadersData && !loadMore) {
          setCaseListData(caseHeadersData);
          setCaseData(caseHeadersData[0]);
          setCaseId(caseHeadersData[0].caseID);
          setLoaded(true);
        } else if (caseHeadersData && loadMore) {
          caseHeadersData = caseListData.concat(caseHeadersData);
          setCaseListData(caseHeadersData);
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
      TypeIdsForGrouping: null
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
      // alert('bottom');
      caseList("", caseListData?.length, true);
    }
  };

  return (
    <form>
      {caseListData.length > 0 ? (
        <Card>
          <Container className="view-case-main">
            <Box
              display="flex"
              alignItems="flex-start"
              p={1}
              m={1}
              bgcolor="background.paper"
              style={{ width: "100% !important" }}
            >
              <div
                style={{ width: "30% !important" }}
                onScroll={(event) => onScroll(caseListData, event)}
              >
                <CaseList
                  handleCasePreviewClick={handleCasePreviewClick}
                  caseIds={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                  caseListData={caseListData}
                ></CaseList>
              </div>

              <div style={{ width: "70% !important" }}>
                {caseId > 0 ? (
                  <CaseViewer caseId={caseId} caseData={caseData}></CaseViewer>
                ) : (
                  ""
                )}
              </div>
              {/* <Grid item xs={12}>
              <Box p={1} style={{ height: "700px", overflow: "auto" }}></Box>
            </Grid> */}
            </Box>
          </Container>
        </Card>
      ) : (
        ""
      )}

      {!loaded ? createLoader() : []}
    </form>
  );
}
