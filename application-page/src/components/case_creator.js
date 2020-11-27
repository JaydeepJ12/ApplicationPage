import {
  Button,
  Card,
  Container,
  Fab,
  MenuItem,
  TextField
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import Froala from "./froala.js";
import Loading from "./Loader.js";

//Ideally this componet takes in a case-type-id,
//make call to backend for data, then generates
//case inpus component

export default function CaseCreator(props) {
  //url is hard coded, will need to adjust after dev

  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState({});
  const [caseType, setCaseType] = useState({});
  const [caseTypeState, setCaseTypeState] = useState({});
  const [caseTypeData, setCaseTypeData] = useState([]);
  const [parentChildData, setParentChildData] = useState([]);

  const options = [
    { DecodeId: 1, DecodeValue: "Dallas" },
    { DecodeId: 2, DecodeValue: "Houston" },
    { DecodeId: 3, DecodeValue: "Outer Markets" },
  ];

  const markets = [
    { DecodeId: 1, DecodeValue: "Dallas Market" },
    { DecodeId: 2, DecodeValue: "Fort Worth" },
  ];

  const fields = (caseTypeId) => {
    console.log(caseTypeId);
    caseTypeId = caseTypeId ? caseTypeId : caseType;
    axios
      .get("http://localhost:5000/cases/config?CaseTypeID=".concat(caseTypeId))
      .then((resp) => {
        resp.data[5].assoc_decode = options;
        setData(resp.data);
        console.log(JSON.stringify(resp.data));
      })
      .then(setLoaded(true));

    axios
      .get(
        "http://localhost:5000/cases/caseassoctypecascade?CaseTypeID=".concat(
          caseTypeId
        )
      )
      .then((resp) => {
        setParentChildData(resp.data);
        console.log(JSON.stringify(resp.data));
      })
      .then(setLoaded(true));

    //wait until after axios req is done
  };

  const caseTypes = () => {
    setLoaded(false);
    console.log(caseType);

    axios.get("http://localhost:5000/cases/caseTypes").then((resp) => {
      setCaseTypeData(resp.data);
      setLoaded(true);
    });
  };

  useEffect(caseTypes, fields, []);

  const handleCaseTypeChange = (event) => {
    setData(null);
    const caseTypeId = event.target.value;
    setCaseType(caseTypeId);
    fields(caseTypeId);

    // var jsonData = JSON.stringify({"Application":0,"TypeID":19,"FieldID":1829,"Username":"BhavikS","ParentValues":{"3415":["2"]}});

    // var config = {
    //   method: 'post',
    //   url: 'http://localhost:54504/api/ExternalData/GetExternalDataValues',
    //   headers: {
    //     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJGdWxsTmFtZSI6IkJoYXZpayBTYXZhbGl5YSIsIlVzZXJuYW1lIjoiQmhhdmlrUyIsIkZpcnN0TmFtZSI6IkJoYXZpayIsIk1pZGRsZU5hbWUiOiIiLCJMYXN0TmFtZSI6IlNhdmFsaXlhIiwiRGlzcGxheU5hbWUiOiJCaGF2aWsgU2F2YWxpeWEiLCJFbWFpbCI6IkJoYXZpay5TYXZhbGl5YUBTdGVtbW9ucy5jb20iLCJEZXBhcnRtZW50TmFtZSI6IkFwcGxpY2F0aW9uIERldmVsb3BtZW50IiwiT2ZmaWNlUGhvbmUiOiIiLCJDZWxsUGhvbmUiOiIiLCJDaXR5IjoiVmFkb2RhcmEiLCJTdGF0ZSI6Ikd1amFyYXQiLCJTdXBlcnZpc29yIjoiUHJhZ25lc2ggUmF2YWwiLCJTdXBlcnZpc29yVXNlcm5hbWUiOiJQcmFnbmVzaFIiLCJJc0V4dGVybmFsVXNlciI6IkZhbHNlIiwiSm9iVGl0bGUiOiJTZW5pb3IgRnVsbHN0YWNrIERldmVsb3BlciIsIkhhc1RlYW0iOiJUcnVlIiwiUHJvZmlsZVBpY3R1cmUiOiIiLCJuYmYiOjE2MDY0NzE2OTMsImV4cCI6MTYwNzA3NjQ5MywiaWF0IjoxNjA2NDcxNjkzfQ.i2y79lYFgUdnj-azB_kfIG-VRJGDtXHkIk1uMCGt9UY',
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': true
    //   },
    //   data : jsonData
    // };

    // axios(config)
    // .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  };

  const handleChange = (assocTypeId, event) => {
    if (event) {
      const value = event.target.value;

      var parentData = parentChildData.find(
        (x) => x.CASE_ASSOC_TYPE_ID_PARENT == assocTypeId
      );

      if (value && value != "0") {
        var commentIndex = data.findIndex(function (c) {
          return c.AssocTypeId == 1829;
        });
        const currentData = [...data];
        if (currentData[commentIndex]) {
          currentData[commentIndex].assoc_decode = markets;
          setData(currentData);
        }
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let fields = {};
    var submitted = false;
    Object.entries(event.target.elements).forEach(([name, input]) => {
      if (input.type != "submit") {
        if (input.name != "" && input.value != "" && caseType > 0) {
          submitted = true;
          fields[input.name] = input.value;
        }
      }
    });
    if (submitted == true) {
      //{ timer: 3000 }
      swal(
        "Good job!",
        "Form Submitted : " + JSON.stringify(fields),
        "success"
      );
    }
    console.log(fields);
  };

  const convertRequired = (data) => {
    if (data.IsRequired == "Y") {
      //backend use Y and N for True and False
      return false;
    } else {
      return false;
    }
  };

  const createTextField = (data) => {
    var required = convertRequired(data);

    return (
      <div className="">
        <TextField
          name={String(data.AssocTypeId)}
          id={String(data.AssocTypeId)}
          label={data.Name}
          required={required}
          fullWidth={true}
          InputLabelProps={{ shrink: true }}
        />
      </div>
    );
  };

  const createFroalaField = () => {
    return (
      <div className="">
        <br></br>
        <br></br>
        <Froala fullWidth={true} />
      </div>
    );
  };

  const createDateField = (data) => {
    var required = convertRequired(data);

    return (
      <div className="">
        <TextField
          type="date"
          name={String(data.AssocTypeId)}
          id={String(data.AssocTypeId)}
          label={data.Name}
          InputLabelProps={{ shrink: true }}
          required={required}
          fullWidth={true}
        />
      </div>
    );
  };

  const fieldHandler = (data) => {
    //TODO: implment id structure
    var required = convertRequired(data);

    if (data.AssocFieldType === "T" || data.AssocFieldType === "N") {
      return createTextField(data);
    } else if (data.AssocFieldType === "A") {
      return createDateField(data);
    } else if (
      data.AssocFieldType === "D" ||
      data.AssocFieldType === "E" ||
      data.AssocFieldType === "O"
    ) {
      return (
        <div className="">
          {" "}
          <TextField
            id={String(data.AssocTypeId)}
            select
            name={String(data.AssocTypeId)}
            label={data.Name}
            value={state.value}
            onChange={(event) => handleChange(data.AssocTypeId, event)}
            fullWidth={true}
            required={required}
          >
            <MenuItem key="0" value="0">
              {"Please Select " + data.Name}
            </MenuItem>
            {data.assoc_decode
              ? data.assoc_decode.map((option) => (
                  <MenuItem key={option.DecodeId} value={option.DecodeId}>
                    {option.DecodeValue}
                  </MenuItem>
                ))
              : []}
          </TextField>
        </div>
      );
    } else if (data.AssocFieldType === "Froala") {
      return <Froala />;
    }
  };
  const loadFields = () => {
    return (
      <div>
        {loaded && data ? (
          data.map((item, idx) => <div key={idx}>{fieldHandler(item)}</div>)
        ) : (
          <Loading />
        )}

        {loaded && data?.length > 0 ? createFroalaField() : ""}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <Container maxWidth="sm">
          <div className="">
            {" "}
            <TextField
              id={"CaseType" + caseType}
              name="CaseType"
              select
              label="Case Type"
              value={caseType}
              onChange={(e) => handleCaseTypeChange(e)}
              fullWidth={true}
              required
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
          {props.casetypeName}
          <Fab color="primary" aria-label="add">
            {/* <button type="submit">Create Case</button> */}
            <Button type="submit">+</Button>
          </Fab>
          {loadFields()}
        </Container>
      </Card>
    </form>
  );
}
