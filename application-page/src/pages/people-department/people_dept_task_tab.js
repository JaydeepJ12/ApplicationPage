import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import ComponentLoader from "../../components/common/component-loader";
import * as notification from "../../components/common/toast";
import CasePreview from "../viewcases/case-preview.js";
import { navigate } from "@reach/router";

function PeopleTaskTab(props) {
  const handleTaskClick = (userName, filter, taskCount, caseId, caseTypeId) => {
    if (taskCount <= 0) {
      notification.toast.warning("No task available...!!");
      return false;
    }
    navigate("tasks", {
      state: {
        userName: userName,
        filter: filter,
        taskCount: taskCount,
        replace: true,
        isParent: true,
        caseId: caseId,
        caseTypeId: caseTypeId,
      },
    });
  };

  return (
    <div className="page" id="people-task-tab">
      <Box boxShadow={0} className="card bg-secondary" borderRadius={5}>
        <Grid container spacing={3}>
          {props.caseListData?.length ? (
            <>
              {(!props.taskLoader
                ? Array.from(new Array(props.caseListData.length))
                : props.caseListData
              ).map((peopleCase, index) => (
                <Grid item lg={4} md={4} xs={12} sm={12}>
                  <Box
                    key={index}
                    width="100%"
                    onClick={() => {
                      
                      handleTaskClick(
                        props.SHORT_USER_NAME,
                        1,
                        2,
                        peopleCase.caseID,
                        peopleCase.typeId
                      );
                    }}
                  >
                    {peopleCase ? (
                      <CasePreview
                        caseId={peopleCase.caseID}
                        caseData={peopleCase}
                        firstCaseId={peopleCase.caseID}
                        isFromPeopleDept={true}
                      ></CasePreview>
                    ) : (
                      <ComponentLoader type="rect" />
                    )}
                  </Box>
                </Grid>
              ))}
            </>
          ) : (
            <>
              {!props.taskLoader ? (
                <>
                  {(!props.taskLoader
                    ? Array.from(new Array(3))
                    : Array(2)
                  ).map((item, index) => (
                    <Grid item lg={4} md={4} xs={12} sm={12}>
                      <Box key={index} width="100%" padding={0.5}>
                        {item ? (
                          <img
                            style={{ width: "100%", height: 118 }}
                            alt={item.title}
                            src={item.src}
                          />
                        ) : (
                          <ComponentLoader type="rect" />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </>
              ) : (
                <Typography
                  variant="h6"
                  center
                  style={{
                    textAlign: "center",
                    padding: "5px",
                  }}
                >
                  No Task Found
                </Typography>
              )}
            </>
          )}
        </Grid>
      </Box>
    </div>
  );
}
export default PeopleTaskTab;
