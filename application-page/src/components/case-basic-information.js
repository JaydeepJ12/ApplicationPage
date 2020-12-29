import { Box } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import UserAutocomplete from "./autocomplete.js";

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
      <div className="sc-eOnLuU kbLHgv">
        <div className="sc-igaqVs kvdIbC"></div>
        {priority ? (
          <span className="sc-gcpVEs czZyXP">{priority}</span>
        ) : (
          "Normal"
        )}
      </div>
    );
  };

  return (
    <div className="" data-test-id="">
      <div className="" data-test-id=""></div>
      <div>
        <div className="">
          <div className="" data-test-id="">
            <div>
              <div className="">
                <div>
                  <label className="">
                    <div className="">
                      <span style={{ fontWeight: "bold" }}>Assignee</span>
                    </div>
                  </label>
                </div>
                <div className="">
                  {caseData?.assignedToFullName
                    ? caseData?.assignedToFullName
                    : caseData?.assignedTo}
                </div>
                <Box>{createAssignTo()}</Box>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="">
        <div className="" data-test-id="">
          <div>
            <div className="">
              <div>
                <label className="">
                  <div className="">
                    <span style={{ fontWeight: "bold" }}>Reporter</span>
                  </div>
                </label>
              </div>
              <div className="">{caseData?.createdByFullName}</div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="">
        <div className="">
          <div>
            <div className="">
              <div>
                <label className="">
                  <div className="">
                    <span style={{ fontWeight: "bold" }}>Priority</span>
                  </div>
                </label>
              </div>
              {handlePriority(caseData.priority)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
