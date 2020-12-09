import {
  Box,
  Button,
  Card,
  Container,
  Fab,
  Icon,
  MenuItem,
  TextField,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import SecureLS from "secure-ls";
import swal from "sweetalert";
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
  const [defaultHopperId, setDefaultHopperId] = useState("");
  const [users, setUsersData] = useState([]);
  const [assignTo, setAssignTo] = useState(0);
  const [isFirstField, setIsFirstField] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState("");

  let timer,
    timeoutVal = 1000; // time it takes to wait for user to stop typing in ms

  const caseTypes = async () => {
    setLoaded(false);
    await axios.get("http://localhost:5000/cases/caseTypes").then((resp) => {
      setLoaded(true);
      setCaseTypeData(resp.data);
    });
  };

  const handleCaseTypeChange = (event) => {
    const caseTypeId = event.target.value;
    setData(null);
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

  useEffect(() => {
    caseTypes();
  }, []);

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
          value={state.value}
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

  const onFileChange = (event) => {
    var file = event.target.files[0];

    const formData = new FormData();
    if (file) {
      formData.append("myFile" + caseType, file, file.name);
      const fileData = [...formData];
      //Set details of the uploaded file
      setFormDataValue(fileData);
      console.log(file);
    }
  };

  const createFileField = () => {
    return (
      <div className="cm-file-input">
        <br></br>
        <Button style={{ paddingLeft: 0 }} component="label">
          <Box className="file-input">
            <AttachFileIcon></AttachFileIcon>
          </Box>
          <input type="file" hidden id="fileUpload" onChange={onFileChange} />
        </Button>
        <label>{formDataValue[0] ? formDataValue[0][1]?.name : ""}</label>
      </div>
    );
  };

  const handleAutocompleteKeyPress = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleAutocompleteKeyUp = (searchText) => {
    if (searchText == "") {
      setAssignTo(defaultHopperId);
      setSelectedUser("");
      setUsersData([]);
    }
  };

  const handleAutocompleteChange = (event, userId, displayName) => {
    if (userId) {
      setAssignTo(userId);
      setSelectedUser(displayName);
      let userData = users.filter((x) => x.id === userId);
      if (userData) {
        setUsersData(userData);
      }
    } else {
      setAssignTo(defaultHopperId);
      setSelectedUser("");
      setUsersData([]);
    }
  };

  const searchUsers = (searchText, event) => {
    if (timeoutRef.current !== null) {
      // IF THERE'S A RUNNING TIMEOUT
      clearTimeout(timeoutRef.current); // THEN, CANCEL IT
    }
    if (assignTo === defaultHopperId && searchText != "") {
      setLoading(true);
    }
    // clearTimeout(timer);

    timeoutRef.current = setTimeout(() => {
      // SET A TIMEOUT
      timeoutRef.current = null; // RESET REF TO NULL WHEN IT RUNS
      if (searchText) {
        getUsers(searchText, event);
      } else {
        setUsersData([]);
        setLoading(false);
      }
    }, timeoutVal);
  };

  const getUsers = async (searchText, event) => {
    var jsonData = {
      searchText: searchText,
      systemId: 0,
      typeId: 0,
      fieldId: 0,
      itemInfoFieldId: 0,
      fromPageIndex: 0,
      toPageIndex: 0,
      userName: "",
    };

    var config = {
      method: "post",
      url: "http://localhost:5000/cases/GetEmployeesBySearch",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        if (response?.data?.responseContent) {
          response.data.responseContent = response.data.responseContent.sort(
            (a, b) => a.displayName.localeCompare(b.displayName)
          );
        }
        const usersData = response.data.responseContent;

        setUsersData(usersData);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const addDefaultSrc = (event) => {
    let userDefaultImage = require("../assets/images/default-userimage.png");
    if (userDefaultImage) {
      event.target.src = userDefaultImage;
    }
  };

  const renderUserImage = (userName) => {
    if (userName) {
      return (
        <img
          onError={(event) => addDefaultSrc(event)}
          src={
            "http://services.boxerproperty.com/userphotos/DownloadPhoto.aspx?username=" +
            userName
          }
          height={50}
          width={50}
        />
      );
    } else {
      return (
        <img
          src="../assets/images/default-userimage.png"
          height={50}
          width={50}
        />
      );
    }
  };

  const createAssignTo = () => {
    return (
      <div className="assign-to-div">
        <label>Assign To :</label>
        <div style={{ width: "auto", marginTop: "1rem" }}>
          {" "}
          {
            <Autocomplete
              className=""
              id="users"
              options={users}
              getOptionLabel={(option) => option.displayName}
              renderOption={(option) => {
                return (
                  <Fragment>
                    <Icon className="s-option-auto-image">
                      {renderUserImage(option?.username)}
                    </Icon>
                    {option?.displayName +
                      (option.primaryJobTitle
                        ? " (" + option.primaryJobTitle + ")"
                        : "")}
                  </Fragment>
                );
              }}
              // getOptionValue={(option) => option.id}
              style={{ width: "auto" }}
              onChange={(event, user) =>
                handleAutocompleteChange(event, user?.id, user?.displayName)
              }
              onInput={(event) => searchUsers(event.target.value, event)}
              onKeyUp={(event) => handleAutocompleteKeyUp(event.target.value)}
              open={open}
              loading={loading}
              onOpen={(event) => {
                setOpen(true);
                if (assignTo === defaultHopperId) {
                  setUsersData([]);
                }
              }}
              onClose={(event) => {
                setOpen(false);
              }}
              renderInput={(params) => (
                <Fragment>
                  <TextField
                    {...params}
                    label={
                      selectedUser
                        ? selectedUser
                        : "Default Hopper- " + defaultHopper
                    }
                    placeholder="Search User"
                    variant="outlined"
                    fullWidth={true}
                    InputLabelProps={{
                      style: { fontWeight: "bold", color: "black" },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                </Fragment>
              )}
            />
          }
        </div>
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
        <div style={{ width: "1250px" }}>
          <div style={{ width: "600px", float: "left" }}>
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
          <div style={{ float: "right", top: 0, width: "600px" }}>
            {data?.length > 0 ? createFroalaField() : ""}
          </div>
        </div>
        {!loaded ? createLoader() : []}
      </Box>
    );
  };

  return (
    <Box>
      <form onSubmit={handleSubmit} className="case-create-form">
        <Card>
          <Container maxWidth="sm" className="case-create-form-div">
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
            <Fab className="create-case-button" aria-label="add" type="submit">
              +{/* <Button >+</Button> */}
            </Fab>
            {loadFields()}
          </Container>
        </Card>
      </form>
    </Box>
  );
}
