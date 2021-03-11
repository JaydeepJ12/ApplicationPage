import { Box,Link } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import UserAutocomplete from "../../components/autocomplete.js";
import { navigate } from '@reach/router';
export default function CaseBasicInformation(props) {
  const [caseData, setCaseData] = useState(props.caseData);

  useEffect(() => {
    setCaseData(props.caseData);
  }, [props.caseData]);

  const handleAutocompleteChange = (userId) => {
    props.handleAutocompleteChange(userId);
  };

  const createAssignTo = () => {
    return (
      <UserAutocomplete
        className="input-auto-suggest"
        defaultHopper={""}
        defaultHopperId={0}
        selectedUser={
          caseData?.assignedToFullName
            ? caseData?.assignedToFullName
            : caseData?.assignedTo
        }
        handleAutocompleteChange={handleAutocompleteChange}
      ></UserAutocomplete>
    );
  };

  const handlePriority = (priority) => {
    priority = "Normal";
    if (priority && priority.includes("High")) {
      priority = "High";
    } else if (priority && priority.includes("Critical")) {
      priority = "Critical";
    } else if (priority && priority.includes("Low")) {
      priority = "Low";
    }

    return (
      <>
        {priority ? (
          <span className="sc-gcpVEs czZyXP">{priority}</span>
        ) : (
          "Normal"
        )}
      </>
    );
  };

  const handlePeopleDepartment = (userName) => {
  
    navigate("people", {
      state: {
        userName: userName,
        IsTaskClick : true,
      },
    });
  };

  return (
    <>
      <div className="text-left" style={{ marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold" }}>Assignee : </span>
     

        <Link
          component="button"
          variant="body2"
          onClick={() => {
            handlePeopleDepartment(caseData?.assignedTo);
          }}
        >
       {caseData?.assignedToFullName
          ? caseData?.assignedToFullName
          : caseData?.assignedTo}
        </Link>
      </div>
      <Box className="input-box">{createAssignTo()}</Box>
      <br />
      <div className="text-left">
        <span style={{ fontWeight: "bold" }}>Reporter : </span>
        {caseData?.createdByFullName}
      </div>
      <br />
      <div className="text-left" style={{ marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold" }}>Priority : </span>
        {handlePriority(caseData.priority)}
      </div>
    </>
  );
}
