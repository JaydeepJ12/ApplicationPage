import { Card, Container, Grid, MenuItem, TextField } from "@material-ui/core";
import { createHistory } from "@reach/router";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SecureLS from "secure-ls";
import CaseCreator from "./case_creator.js";
import GotoBackButton from "./common/BackButton";
export default function CaseSelect(props) {
  let history = createHistory(window);

  const [caseType, setCaseType] = useState(0);
  const [caseTypeData, setCaseTypeData] = useState([]);
  const [disableCaseType, setCaseTypeDisable] = useState(false);
  const isParent = props.location.state.isParent;

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

  const caseTypes = async () => {
    await axios.get("http://localhost:5000/cases/caseTypes").then((resp) => {
      setCaseTypeData(resp.data);
    });
  };

  useEffect(() => {
    pageLoad();
    caseTypes();
  }, []);

  const disableEnableCaseTypeDropDown = (value) => {
    setCaseTypeDisable(value);
  };

  const handleCaseTypeChange = (event) => {
    const caseTypeId = event.target.value;
    setCaseType(caseTypeId);
  };

  return (
    <div id="page-case-select" className="page">
      {isParent ? <GotoBackButton /> : ""}
      <Container className="">
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
