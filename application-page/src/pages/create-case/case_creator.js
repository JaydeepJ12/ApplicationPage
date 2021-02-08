import { Box, Fab, Grid, MenuItem, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SecureLS from "secure-ls";
import swal from "sweetalert";
import UserAutocomplete from "../../components/autocomplete.js";
import Froala from "../../components/common/froala.js";
import FileUpload from "../../components/file-upload.js";
import Loading from "../../components/Loader.js";

export default function CaseCreator(props) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(true);
  const [caseType, setCaseType] = useState(0);
  const [parentChildData, setParentChildData] = useState([]);
  const [froalaValue, setFroala] = useState({});
  const [formDataValue, setFormDataValue] = useState([]);
  const [maxCount, setMaxCount] = useState(50);
  const [parentValue, setParentValue] = useState(0);
  const [defaultHopper, setDefaultHopper] = useState("");
  const [defaultHopperId, setDefaultHopperId] = useState(0);
  const [assignTo, setAssignTo] = useState(0);

  const handleCaseTypeChange = (caseType, caseTypeData) => {
    const caseTypeId = caseType;
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

  useEffect(() => {
    handleCaseTypeChange(props.caseTypeId, props.caseTypeData);
  }, [props.caseTypeId, props.caseTypeData]);

  const fields = (caseTypeId) => {
    setLoaded(false);
    var ls = new SecureLS({
      encodingType: "des",
      isCompression: false,
      encryptionSecret: "BhavikS",
    });
    var fieldData = [];
    caseTypeId = caseTypeId ? caseTypeId : caseType;
    var localFieldData = ls.get("CaseType-" + caseTypeId);

    var fieldDataReceived = false;
    if (localFieldData || localFieldData != "") {
      fieldData = JSON.parse(localFieldData);
      console.log(fieldData);
      fieldDataReceived = true;
    }

    var localParentChildData = ls.get("ParentChildData-" + caseTypeId);
    props.disableEnableCaseTypeDropDown(true);
    if (localParentChildData || localParentChildData != "") {
      setParentChildData(JSON.parse(localParentChildData));
      loadParentDropDown(
        JSON.parse(localParentChildData),
        fieldData,
        caseTypeId
      );
    }

    axios.get("/cases/config?CaseTypeID=".concat(caseTypeId)).then((resp) => {
      if (localFieldData !== JSON.stringify(resp.data)) {
        setData(resp.data);
        setLoaded(true);
        ls.set("CaseType-" + caseTypeId, JSON.stringify(resp.data)); // set encrypted CaseType fields
        fieldData = resp.data;
      }

      if (fieldData.length > 0) {
        axios
          .get("/cases/caseassoctypecascade?CaseTypeID=".concat(caseTypeId))
          .then((resp) => {
            if (localParentChildData !== JSON.stringify(resp.data)) {
              setParentChildData(resp.data);
              ls.set(
                "ParentChildData-" + caseTypeId,
                JSON.stringify(resp.data)
              );
              // if (resp.data && resp.data.length) {
              //   ls.set(
              //     "ParentChildData-" + caseTypeId,
              //     JSON.stringify(resp.data)
              //   );
              // }
              loadParentDropDown(resp.data, fieldData, caseTypeId);
            }
          });
      }
    });
  };

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

    if (!superParentAssocTypeIds.length && fieldData.length) {
      setData(fieldData);
      setLoaded(true);
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
          url: "/cases/GetExternalDataValues",
          data: jsonData,
        };

        await axios(config)
          .then(function (response) {
            const externalData = response.data.responseContent;
            currentData[commentIndex].assoc_decode = externalData;
            setData(currentData);
            setLoaded(true);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
    props.disableEnableCaseTypeDropDown(false);
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
        url: "/cases/GetExternalDataValues",
        data: jsonData,
      };

      await axios(config)
        .then(function (response) {
          const externalData = response.data.responseContent;
          currentData[commentIndex].assoc_decode = currentData[
            commentIndex
          ].assoc_decode.concat(externalData);
          setData(currentData);
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
            url: "/cases/GetExternalDataValues",
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

  const createTextField = (data, index) => {
    var required = convertRequired(data);
    return (
      <div className="form-control">
        <TextField
          name={String(data.AssocTypeId)}
          id={String(data.AssocTypeId)}
          label={data.Name}
          required={required}
          fullWidth={true}
          InputLabelProps={{ shrink: true }}
          autoFocus={index == 0 ? true : false}
        />
      </div>
    );
  };

  const handleModelChange = (event) => {
    setFroala(event);
  };

  const createFroalaField = () => {
    return (
      <div className="form-control froala-editor">
        <br></br>
        <br></br>
        <Froala onModelChange={(e) => handleModelChange(e)} fullWidth={true} />
      </div>
    );
  };

  const createDateField = (data, index) => {
    var required = convertRequired(data);

    return (
      <div className="form-control">
        <TextField
          type="date"
          name={String(data.AssocTypeId)}
          id={String(data.AssocTypeId)}
          label={data.Name}
          InputLabelProps={{ shrink: true }}
          required={required}
          fullWidth={true}
          autoFocus={index == 0 ? true : false}
        />
      </div>
    );
  };

  const createLoader = () => {
    return <Loading />;
  };

  const createDropDownField = (data, index) => {
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
          name={String(data?.AssocTypeId + caseType)}
          label={data.Name}
          onChange={(event) => handleChange(data?.AssocTypeId, event)}
          fullWidth={true}
          required={required}
          autoFocus={index == 0 ? true : false}
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
      <>
        <label> Assign To :</label>
        <UserAutocomplete
          defaultHopper={defaultHopper}
          defaultHopperId={defaultHopperId}
          handleAutocompleteChange={handleAutocompleteChange}
        ></UserAutocomplete>
      </>
    );
  };

  const fieldHandler = (data, index) => {
    if (data.AssocFieldType === "T" || data.AssocFieldType === "N") {
      return createTextField(data, index);
    } else if (data.AssocFieldType === "A") {
      return createDateField(data, index);
    } else if (
      (data.AssocFieldType === "D" ||
        data.AssocFieldType === "E" ||
        data.AssocFieldType === "O") &&
      data.ExternalDataSourceId !== 121
    ) {
      return createDropDownField(data, index);
    }
  };

  const loadFields = () => {
    return (
      <Box>
        <Grid container spacing={3}>
          <Grid item sm={12} xs={12} lg={6} md={6}>
            {data
              ? data.map((item, index) => (
                  <div key={index}>{fieldHandler(item, index)}</div>
                ))
              : []}
            <Box>
              <Box>{data?.length > 0 ? createFileField() : ""}</Box>
              <Box>{data?.length > 0 ? createAssignTo() : ""}</Box>
            </Box>
          </Grid>
          <Grid item sm={12} xs={12} lg={6} md={6}>
            {data?.length > 0 ? createFroalaField() : ""}
          </Grid>
        </Grid>

        {!loaded ? createLoader() : []}
      </Box>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="st-form frm-case-create">
      <Fab
        className="btn-create-case bg-primary"
        aria-label="add"
        type="submit"
      >
        +
      </Fab>
      {loadFields()}
    </form>
  );
}
