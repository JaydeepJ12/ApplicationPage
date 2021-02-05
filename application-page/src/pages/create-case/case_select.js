import { Card, Container, Grid, MenuItem, TextField } from "@material-ui/core";
import { createHistory } from "@reach/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SecureLS from "secure-ls";
import GotoBackButton from "../../components/common/BackButton.js";
import { actionData } from "../../redux/action.js";
import CaseCreator from "./case_creator.js";

export default function CaseSelect(props) {
  let history = createHistory(window);
  const dispatch = useDispatch();
  const [caseType, setCaseType] = useState(0);
  const [caseTypeData, setCaseTypeData] = useState([]);
  const [disableCaseType, setCaseTypeDisable] = useState(false);
  const caseTypesByEntityData = useSelector((state) => state);
  const isParent = props.location?.state?.isParent;

  const pageLoad = () => {
    var ls = new SecureLS({
      encodingType: "des",
      isCompression: false,
      encryptionSecret: "BhavikS",
    });
    var days = 5;
    var sessionStartTime = new Date(ls.get("SessionStartTime"));
    var sessionEndTime = new Date(ls.get("SessionEndTime"));
    var dateTime_now = new Date();
    var sessionEnd = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    if (
      (sessionStartTime == "Invalid Date" &&
        sessionEndTime == "Invalid Date") ||
      sessionEndTime < dateTime_now
    ) {
      ls.clear();
      ls.set("SessionStartTime", dateTime_now);
      ls.set("SessionEndTime", sessionEnd);
    }
  };

  // This API call is for get case types data

  // const caseTypes = async () => {
  //   await axios.get("http://localhost:5000/cases/caseTypes").then((resp) => {
  //     setCaseTypeData(resp.data);
  //   });
  // };

  useEffect(() => {
    pageLoad();
    // Set Is Case Type Available As True
    dispatch(actionData(true, "CASE_TYPE_PROPERTY"));
    let caseTypes = caseTypesByEntityData.applicationData.caseTypes;
    if (caseTypes && caseTypes.length) {
      setCaseTypeData(caseTypes);
    }
  }, [caseTypesByEntityData.applicationData.caseTypes]);

  const disableEnableCaseTypeDropDown = (value) => {
    setCaseTypeDisable(value);
  };

  const handleCaseTypeChange = (event) => {
    const caseTypeId = event.target.value;
    setCaseType(caseTypeId);
  };

  return (
    <div id="page-case-select" className="page">
      <Container className="">
        {isParent ? <GotoBackButton /> : ""}
        <Grid item xs={12}>
          <Card>
            <form className="st-p-2">
              <div className="drp-select-case-type">
                <TextField
                  id={"CaseType" + caseType}
                  name="CaseType"
                  select
                  label="Case Type"
                  value={caseType}
                  onChange={(e) => handleCaseTypeChange(e)}
                  fullWidth={true}
                  required
                  disabled={disableCaseType}
                >
                  <MenuItem key="0" value="0">
                    {"Please Select Case Type"}
                  </MenuItem>
                  {caseTypeData
                    ? caseTypeData.map((option) => (
                        <MenuItem
                          key={option.CASE_TYPE_ID}
                          value={option.CASE_TYPE_ID}
                        >
                          {option.NAME}
                        </MenuItem>
                      ))
                    : []}
                </TextField>
              </div>
              <CaseCreator
                caseTypeId={caseType}
                caseTypeData={caseTypeData}
                disableEnableCaseTypeDropDown={disableEnableCaseTypeDropDown}
              ></CaseCreator>
            </form>
          </Card>
        </Grid>
      </Container>
    </div>
  );
}
