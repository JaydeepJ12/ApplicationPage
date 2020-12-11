import {
  Box,
  Card,
  Container,
  Fab,
  Grid,
  MenuItem,
  TextField
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SecureLS from "secure-ls";
import swal from "sweetalert";
import UserAutocomplete from "./autocomplete.js";
import FileUpload from "./file-upload.js";
import Froala from "./froala.js";
import Loading from "./Loader.js";

//Ideally this componet takes in a case-type-id,
//make call to backend for data, then generates
//case inpus component

export default function CaseCreator(props) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState({});
  const [caseType, setCaseType] = useState(0);
  const [caseTypeData, setCaseTypeData] = useState([]);
  const [parentChildData, setParentChildData] = useState([]);
  const [froalaValue, setFroala] = useState({});
  const [formDataValue, setFormDataValue] = useState([]);
  const [maxCount, setMaxCount] = useState(50);
  const [parentValue, setParentValue] = useState(0);
  const [loadMoreText, setLoadMoreText] = useState(false);
  const [disableCaseType, setCaseTypeDisable] = useState(false);
  const [defaultHopper, setDefaultHopper] = useState("");
  const [defaultHopperId, setDefaultHopperId] = useState(0);
  const [assignTo, setAssignTo] = useState(0);
  const [isFirstField, setIsFirstField] = useState(true);

  const caseTypes = async () => {
    setLoaded(false);
    await axios.get("http://localhost:5000/cases/caseTypes").then((resp) => {
      setLoaded(true);
      setCaseTypeData(resp.data);
    });
  };

  useEffect(() => {
    caseTypes();
  }, []);

  const handleCaseTypeChange = (event) => {
    const caseTypeId = event.target.value;
    setData([]);
    setCaseType(caseTypeId);
    if (caseTypeId > 0) {
      setLoaded(false);
      var defaultHopperValue = caseTypeData.find(
        (x) => x.CASE_TYPE_ID === caseTypeId
      );
      if (defaultHopperValue) {
        setDefaultHopper(defaultHopperValue.HopperName);
        setDefaultHopperId(defaultHopperValue.DEFAULT_HOPPER_ID);
        setAssignTo(defaultHopperValue.DEFAULT_HOPPER_ID);
      }

      fields(caseTypeId);
    }
  };

  const fields = (caseTypeId) => {
    // var ls = new SecureLS({encodingType: 'aes'});
    var ls = new SecureLS({
      encodingType: "des",
      isCompression: false,
      encryptionSecret: "BhavikS",
    });
    var fieldData = [];
    caseTypeId = caseTypeId ? caseTypeId : caseType;
    var sessionFieldData = ls.get("CaseType-" + caseTypeId);

    var fieldDataReceived = false;
    if (sessionFieldData || sessionFieldData != "") {
      setData(JSON.parse(sessionFieldData));
      fieldData = JSON.parse(sessionFieldData);
      setLoaded(true);
      fieldDataReceived = true;
    }

    var sessionParentChildData = ls.get("ParentChildData-" + caseTypeId);

    var parentChildDataReceived = false;
    if (sessionParentChildData || sessionParentChildData != "") {
      setParentChildData(JSON.parse(sessionParentChildData));
      setLoaded(true);
      parentChildDataReceived = true;
      loadParentDropDown(
        JSON.parse(sessionParentChildData),
        fieldData,
        caseTypeId
      );
    }
    setCaseTypeDisable(true);
    axios
      .get("http://localhost:5000/cases/config?CaseTypeID=".concat(caseTypeId))
      .then((resp) => {
        if (sessionFieldData !== JSON.stringify(resp.data)) {
          setData(resp.data);
          ls.set("CaseType-" + caseTypeId, JSON.stringify(resp.data)); // set encrypted CaseType fields
          fieldData = resp.data;
        }

        if (fieldData.length > 0) {
          axios
            .get(
              "http://localhost:5000/cases/caseassoctypecascade?CaseTypeID=".concat(
                caseTypeId
              )
            )
            .then((resp) => {
              if (sessionParentChildData !== JSON.stringify(resp.data)) {
                setParentChildData(resp.data);
                ls.set(
                  "ParentChildData-" + caseTypeId,
                  JSON.stringify(resp.data)
                );
                setLoaded(true);
                loadParentDropDown(resp.data, fieldData, caseTypeId);
              }
            });
        }
      });
  };

  // useEffect(caseTypes, fields, []);

  const loadParentDropDown = async (responseData, fieldData, caseTypeId) => {
    let superParentAssocTypeIds = [];
    var externalData = fieldData.filter((x) => x.ExternalDataSourceId > 0);

    // Use map to get a simple array of "CASE_ASSOC_TYPE_ID_CHILD" values. Ex: [1,2,3]
    let childAssocTypeIds = responseData.map((x) => {
      return x.CASE_ASSOC_TYPE_ID_CHILD;
    });

    if (externalData.length > 0 && childAssocTypeIds.length > 0) {
      var filteredExternalData = externalData.filter(function (item) {
        return childAssocTypeIds.indexOf(item.AssocTypeId) === -1;
      });
      superParentAssocTypeIds = filteredExternalData.map((x) => {
        return x.AssocTypeId;
      });
    } else {
      superParentAssocTypeIds = externalData.map((x) => {
        return x.AssocTypeId;
      });
    }

    for (var i = 0; i < superParentAssocTypeIds.length; i++) {
      const currentData = [...fieldData];
      var commentIndex = fieldData.findIndex(function (c) {
        return c.AssocTypeId == superParentAssocTypeIds[i];
      });
      if (currentData[commentIndex]) {
        var jsonData = {
          searchText: "",
          maxCount: maxCount,
          skipCount: 0,
          application: 0,
          typeID: caseTypeId,
          fieldID: superParentAssocTypeIds[i],
          username: "",
          parentValues: { ["0"]: ["0"] },
        };

        var config = {
          method: "post",
          url: "http://localhost:5000/cases/GetExternalDataValues",
          data: jsonData,
        };

        await axios(config)
          .then(function (response) {
            const externalData = response.data.responseContent;
            currentData[commentIndex].assoc_decode = externalData;
            setData(currentData);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
    setCaseTypeDisable(false);
  };

  const onScroll = (fieldData, event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      loadMoreData(
        fieldData.AssocTypeId,
        "",
        maxCount,
        fieldData?.assoc_decode?.length,
        event
      );
    }
  };

  const loadMoreData = async (
    assocTypeId,
    searchText,
    maxCount,
    skipCount,
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();
    // setLoaded(false);
    setLoadMoreText(true);
    if (searchText !== "") {
      skipCount = 0;
    }

    var parentData = parentChildData.find(
      (x) => x.CASE_ASSOC_TYPE_ID_CHILD == assocTypeId
    );

    var parentId = parentData?.CASE_ASSOC_TYPE_ID_PARENT;
    if (!parentId || parentId <= 0) {
      parentId = 0;
    }

    var commentIndex = data.findIndex(function (c) {
      return c.AssocTypeId == assocTypeId;
    });

    const currentData = [...data];

    if (currentData[commentIndex]) {
      var jsonData = {
        searchText: searchText,
        maxCount: maxCount,
        skipCount: skipCount,
        application: 0,
        typeID: caseType,
        fieldID: assocTypeId,
        username: "",
        parentValues: {
          [String(parentId)]: [String(parentId > 0 ? parentValue : 0)],
        },
      };

      var config = {
        method: "post",
        url: "http://localhost:5000/cases/GetExternalDataValues",
        data: jsonData,
      };

      await axios(config)
        .then(function (response) {
          const externalData = response.data.responseContent;
          currentData[commentIndex].assoc_decode = currentData[
            commentIndex
          ].assoc_decode.concat(externalData);
          setData(currentData);
          setLoadMoreText(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleChange = (assocTypeId, event) => {
    if (event) {
      const value = event.target.value;
      setParentValue(value);
      var parentData = parentChildData.find(
        (x) => x.CASE_ASSOC_TYPE_ID_PARENT == assocTypeId
      );

      if (value && value != "0" && parentData) {
        var commentIndex = data.findIndex(function (c) {
          return c.AssocTypeId == parentData.CASE_ASSOC_TYPE_ID_CHILD;
        });
        const currentData = [...data];
        if (currentData[commentIndex]) {
          parentChildData.forEach(function (item, index) {
            currentData[commentIndex].assoc_decode = [];
            var childData = parentChildData.find(
              (x) =>
                x.CASE_ASSOC_TYPE_ID_PARENT ==
                currentData[commentIndex].AssocTypeId
            );
            if (childData) {
              if (childData.CASE_ASSOC_TYPE_ID_CHILD > 0) {
                var childIndex = data.findIndex(function (c) {
                  return c.AssocTypeId == childData.CASE_ASSOC_TYPE_ID_CHILD;
                });
                if (currentData[childIndex]) {
                  currentData[childIndex].assoc_decode = [];
                }
              }
            }
          });
          var parentId = parentData?.CASE_ASSOC_TYPE_ID_PARENT;

          var jsonData = {
            searchText: "",
            maxCount: maxCount,
            skipCount: 0,
            application: 0,
            typeID: caseType,
            fieldID: parentData?.CASE_ASSOC_TYPE_ID_CHILD,
            username: "",
            parentValues: { [String(parentId)]: [String(value)] },
          };

          var config = {
            method: "post",
            url: "http://localhost:5000/cases/GetExternalDataValues",
            data: jsonData,
          };

          axios(config)
            .then(function (response) {
              const externalData = response.data.responseContent;
              currentData[commentIndex].assoc_decode = externalData;
              setData(currentData);
            })
            .catch(function (error) {
              console.log(error);
            });
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

    if (froalaValue) {
      fields["Froala"] = froalaValue;
    }

    if (formDataValue) {
      fields["fileData"] = formDataValue;
    }

    if (assignTo > 0) {
      fields["AssignTo"] = assignTo;
    } else {
      fields["AssignTo"] = defaultHopperId;
    }

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
      return true;
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

  const handleModelChange = (event) => {
    setFroala(event);
  };

  const createFroalaField = () => {
    return (
      <div className="froala-editor">
        <br></br>
        <br></br>
        <Froala onModelChange={(e) => handleModelChange(e)} fullWidth={true} />
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

  const createLoader = () => {
    return <Loading />;
  };

  const createDropDownField = (data) => {
    var required = convertRequired(data);

    return (
      <div
        className="card-page-wrap"
        id="card-page-wrap"
        onScroll={(event) => onScroll(data, event)}
      >
        {" "}
        <TextField
          id={String(data?.AssocTypeId)}
          select
          name={String(data?.AssocTypeId)}
          label={data.Name}
          // value={state.value}
          onChange={(event) => handleChange(data?.AssocTypeId, event)}
          fullWidth={true}
          required={required}
        >
          {data.assoc_decode
            ? data.assoc_decode.map((option) => (
                <MenuItem key={option.DecodeId} value={option.DecodeId}>
                  {option.DecodeValue}
                </MenuItem>
              ))
            : []}

          {data?.assoc_decode.length >= maxCount &&
          data?.assoc_decode.length % maxCount == 0 ? (
            <span>Loading Please Wait...</span>
          ) : (
            <span></span>
          )}
        </TextField>
      </div>
    );
  };

  const handleOnFileChange = (fileData) => {
    if (fileData) {
      //Set details of the uploaded file
      setFormDataValue(fileData);
      console.log(fileData);
    }
  };

  const createFileField = () => {
    return (
      <FileUpload
        caseType={caseType}
        handleOnFileChange={handleOnFileChange}
      ></FileUpload>
    );
  };

  const handleAutocompleteChange = (userId) => {
    setAssignTo(userId);
  };

  const createAssignTo = () => {
    return (
      <UserAutocomplete
        defaultHopper={defaultHopper}
        defaultHopperId={defaultHopperId}
        handleAutocompleteChange={handleAutocompleteChange}
      ></UserAutocomplete>
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
      (data.AssocFieldType === "D" ||
        data.AssocFieldType === "E" ||
        data.AssocFieldType === "O") &&
      data.ExternalDataSourceId !== 121
    ) {
      return createDropDownField(data);
    }
  };

  const loadFields = () => {
    return (
      <Box>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <div>
                {data
                  ? data.map((item, idx) => (
                      <div key={idx}>{fieldHandler(item)}</div>
                    ))
                  : []}
                <Box>
                  <Box>{data?.length > 0 ? createFileField() : ""}</Box>
                  <Box>{data?.length > 0 ? createAssignTo() : ""}</Box>
                </Box>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div>{data?.length > 0 ? createFroalaField() : ""}</div>
            </Grid>
          </Grid>
        </div>

        {!loaded ? createLoader() : []}
      </Box>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit} className="case-create-form">
          <Card>
            <Container className="case-create-form-div">
              <div style={{ width: "50%" }} className="">
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
                <Fab
                  style={{ top: 49 }}
                  className="create-case-button"
                  aria-label="add"
                  type="submit"
                >
                  +
                </Fab>
              </div>

              {loadFields()}
            </Container>
          </Card>
        </form>
      </Grid>
    </Grid>
  );
}
