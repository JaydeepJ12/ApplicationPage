import useStyles from "../assets/css/common_styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SecureLS from "secure-ls";
import swal from "sweetalert";
import * as notification from "../components/common/toast";
import CaseBasicInformation from "./case-basic-information.js";
import FileUpload from "./file-upload.js";
import Froala from "./froala.js";
import Loading from "./Loader.js";
const casesBaseURL = process.env.BASE_CASES_URL;

export default function CaseViewer(props) {
  const [state, setState] = useState({});
  const [loaded, setLoaded] = useState(true);
  const [notes, setNotes] = useState([]);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [caseType, setCaseType] = useState(0);
  const [parentChildData, setParentChildData] = useState([]);
  const [froalaValue, setFroalaValue] = useState({});
  const [formDataValue, setFormDataValue] = useState([]);
  const [maxCount, setMaxCount] = useState(50);
  const [parentValue, setParentValue] = useState(0);
  const [assignTo, setAssignTo] = useState(0);
  const [fieldExpanded, setFieldExpanded] = useState(false);
  const [caseData, setCaseData] = useState(props.caseData);
  const [caseFields, setCaseFields] = useState([]);
  const [parentDropDownloaded, setParentDropDownloaded] = useState(false);

  var classes = useStyles();
  const handleFieldAccordionChange = (isFieldExpanded) => {
    setFieldExpanded(!isFieldExpanded);
  };

  const handleCaseTypeChange = (caseId, caseData) => {
    const caseTypeId = caseData.typeId;
    setNotesLoaded(false);
    props.handleCaseLoaded(false);
    setNotes([]);
    setCaseFields([]);
    setCaseData([]);
    setCaseData(caseData);
    setCaseType(caseTypeId);
    if (caseTypeId > 0) {
      caseNotes(caseTypeId, caseId);
    }
  };

  const caseNotes = async (caseTypeId, caseId) => {
    var jsonData = {
      applicationId: caseId,
      sinceDate: null,
    };

    var config = {
      method: "post",
      url: "/cases/GetCaseNotes",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        let notesData = response?.data?.responseContent;
        setNotes(notesData);
        setNotesLoaded(true);
        getCaseDetails(caseTypeId, caseId);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getCaseDetails = async (caseTypeId, caseId) => {
    setParentDropDownloaded(false);
    var jsonData = {
      caseId: caseId,
      caseTypeId: caseTypeId,
      assignedToMe: true,
      isActive: "Y",
      systemCode: "",
      username: "BhavikS",
      pageNumber: 1,
      pageSize: 100,
      userOwner: "",
      userAssignTo: "",
      userCreatedBy: "",
      userTeam: "",
      userClosedby: "",
    };

    // This commented code is for cancel axios. It may require in future.

    // var CancelToken = axios.CancelToken;
    // var cancel;

    var config = {
      method: "post",
      url: "/cases/GetFullCaseByCaseId",
      data: jsonData,
      // cancelToken: new CancelToken(function executor(c) {
      //   // An executor function receives a cancel function as a parameter
      //   cancel = c;
      // }),
    };

    await axios(config)
      .then(function (response) {
        let caseDetailsData = response?.data?.responseContent;

        if (caseDetailsData.details.length) {
          caseDetailsData.details = caseDetailsData.details.sort(
            (a, b) => a.controlPriority - b.controlPriority
          );
        }

        setCaseFields(caseDetailsData?.details);
        loadAssocDecodeData(caseDetailsData?.details, caseTypeId);
      })
      .catch(function (error) {
        // cancel the request
        // cancel();
        console.log(error);
      });
  };

  useEffect(() => {
    handleCaseTypeChange(props.caseId, props.caseData);
  }, [props.caseId, props.caseData]);

  const loadAssocDecodeData = async (fieldData, caseTypeId) => {
    let assocTypeIds = [];
    var assocDecodeData = fieldData.filter(
      (x) =>
        x.externalDatasourceId == null &&
        (x.controlTypeCode == "D" ||
          x.controlTypeCode == "E" ||
          x.controlTypeCode == "O")
    );

    assocTypeIds = assocDecodeData.map((x) => {
      return x.controlId;
    });

    for (var i = 0; i < assocTypeIds.length; i++) {
      const currentData = [...fieldData];
      var commentIndex = fieldData.findIndex(function (c) {
        return c.controlId == assocTypeIds[i];
      });

      if (currentData[commentIndex]) {
        await axios
          .get("/cases/assocDecode?AssocId=".concat(assocTypeIds[i]))
          .then((resp) => {
            if (resp.data.length) {
              currentData[commentIndex].assoc_decode = resp.data;
              setCaseFields(currentData);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }

    var ls = new SecureLS({
      encodingType: "des",
      isCompression: false,
      encryptionSecret: "BhavikS",
    });

    if (fieldData.length > 0) {
      var localParentChildData = ls.get("ParentChildData-" + caseTypeId);
      if (localParentChildData || localParentChildData != "") {
        setParentChildData(JSON.parse(localParentChildData));
        loadParentDropDown(fieldData, caseTypeId);
      }

      axios
        .get("/cases/caseassoctypecascade?CaseTypeID=".concat(caseTypeId))
        .then((resp) => {
          if (localParentChildData !== JSON.stringify(resp.data)) {
            setParentChildData(resp.data);
            ls.set("ParentChildData-" + caseTypeId, JSON.stringify(resp.data));
            loadParentDropDown(fieldData, caseTypeId);
          }
        });
    }
  };

  const loadParentDropDown = async (
    fieldData,
    caseTypeId,
    maxCountValue = maxCount,
    controlId = 0
  ) => {
    setParentDropDownloaded(false);
    let superParentAssocTypeIds = [];

    var externalData = [];
    if (controlId > 0) {
      externalData = fieldData.filter(
        (x) => x.externalDatasourceId > 0 && x.controlId === controlId
      );
    } else {
      externalData = fieldData.filter((x) => x.externalDatasourceId > 0);
    }

    superParentAssocTypeIds = externalData.map((x) => {
      return x.controlId;
    });

    let isLastDropdown = false;
    if (!superParentAssocTypeIds.length) {
      isLastDropdown = true;
    }
    for (var i = 0; i < superParentAssocTypeIds.length; i++) {
      const currentData = [...fieldData];

      let cascadeItems = currentData.find(
        (x) => x.controlId === superParentAssocTypeIds[i]
      )?.cascadeItems;
      let parentId = 0;
      if (cascadeItems && cascadeItems.length) {
        parentId = cascadeItems.find(
          (x) => x.childTypeId === superParentAssocTypeIds[i]
        )?.parentTypeId;
      }

      let parentCascadeItems = currentData.find((x) => x.controlId === parentId)
        ?.cascadeItems;
      let superParentValue = 0;
      let mainParentValue = 0;
      let superParentId = 0;
      let mainParentId = 0;
      if (parentCascadeItems && parentCascadeItems.length) {
        superParentId = parentCascadeItems.find(
          (x) => x.childTypeId === superParentAssocTypeIds[i]
        )?.parentTypeId;
        if (superParentId > 0) {
          superParentValue = currentData.find((x) => x.controlId === parentId)
            ?.externalDatasourceObjectId;

          let mainParentCascadeItems = currentData.find(
            (x) => x.controlId === superParentId
          )?.cascadeItems;
          if (mainParentCascadeItems && mainParentCascadeItems.length) {
            mainParentId = mainParentCascadeItems.find(
              (x) => x.childTypeId === superParentId
            )?.parentTypeId;
            if (mainParentId > 0) {
              mainParentValue = currentData.find(
                (x) => x.controlId === mainParentId
              )?.externalDatasourceObjectId;
            }
          }
        }
      }

      let parentValue = 0;
      if (superParentId > 0) {
        parentValue = superParentValue;
      }
      if (mainParentId > 0 && !mainParentValue) {
        parentValue = mainParentValue;
      }

      var maxRecordCount =
        maxCountValue > 0 ? maxCountValue : parentId > 0 ? 1000 : maxCount;
      var commentIndex = fieldData.findIndex(function (c) {
        return c.controlId == superParentAssocTypeIds[i];
      });

      if (currentData[commentIndex]) {
        var jsonData = {
          searchText: "",
          maxCount: maxRecordCount,
          skipCount: 0,
          application: 0,
          typeID: caseTypeId,
          fieldID: superParentAssocTypeIds[i],
          username: "",
          parentValues: {
            [parentId ? String(parentId) : "0"]: [
              parentValue ? String(parentValue) : "0",
            ],
          },
        };
        var config = {
          method: "post",
          url: "/cases/GetExternalDataValues",
          data: jsonData,
        };

        await axios(config)
          .then(function (response) {
            let externalData = response?.data?.responseContent;

            let dataAvailable = true;
            if (
              externalData &&
              externalData.length &&
              currentData[commentIndex].externalDatasourceObjectId > 0
            ) {
              var dataValue = externalData.filter(
                (x) =>
                  x.DecodeId ===
                  String(currentData[commentIndex].externalDatasourceObjectId)
              );

              if (dataValue && !dataValue.length) {
                dataAvailable = false;
                currentData[commentIndex].assoc_decode = currentData[
                  commentIndex
                ].assoc_decode
                  ? currentData[commentIndex].assoc_decode.concat(externalData)
                  : externalData;
                loadParentDropDown(
                  fieldData,
                  caseTypeId,
                  maxCountValue * 2,
                  currentData[commentIndex].controlId
                );
              }
            }

            if (dataAvailable) {
              currentData[commentIndex].assoc_decode = externalData;
              setCaseFields(currentData);
              if (i + 1 === superParentAssocTypeIds.length) {
                isLastDropdown = true;
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
    setParentDropDownloaded(true);
    if (isLastDropdown) {
      props.handleCaseLoaded(true);
    }
  };

  const onScroll = (fieldData, event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      loadMoreData(
        fieldData.controlId,
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

    var commentIndex = caseFields.findIndex(function (c) {
      return c.controlId == assocTypeId;
    });

    const currentData = [...caseFields];

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
          let externalData = response?.data?.responseContent;
          currentData[commentIndex].assoc_decode = currentData[
            commentIndex
          ].assoc_decode.concat(externalData);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleChange = async (data, index, assocTypeId, event) => {
    if (event) {
      const currentData = [...caseFields];
      const value = event.target.value;
      if (currentData[index].externalDatasourceId > 0) {
        currentData[index].externalDatasourceObjectId = value;
      } else {
        currentData[index].decodeId = value;
      }
      setParentValue(value);
      var parentData = parentChildData.find(
        (x) => x.CASE_ASSOC_TYPE_ID_PARENT == assocTypeId
      );

      var maxRecordCount = maxCount;
      if (value && value != "0" && parentData) {
        var commentIndex = currentData.findIndex(function (c) {
          return c.controlId === parentData.CASE_ASSOC_TYPE_ID_CHILD;
        });

        if (currentData[commentIndex]) {
          parentChildData.forEach(function (item, index) {
            currentData[commentIndex].assoc_decode = [];
            currentData[commentIndex].externalDatasourceObjectId = state.value;
            maxRecordCount = 1000;
            var childData = parentChildData.find(
              (x) =>
                x.CASE_ASSOC_TYPE_ID_PARENT ==
                currentData[commentIndex].controlId
            );
            if (childData) {
              if (childData.CASE_ASSOC_TYPE_ID_CHILD > 0) {
                var childIndex = caseFields.findIndex(function (c) {
                  return c.controlId == childData.CASE_ASSOC_TYPE_ID_CHILD;
                });
                if (currentData[childIndex]) {
                  currentData[childIndex].assoc_decode = [];
                  currentData[childIndex].externalDatasourceObjectId =
                    state.value;
                }
              }
            }
          });
          var parentId = parentData?.CASE_ASSOC_TYPE_ID_PARENT;

          var jsonData = {
            searchText: "",
            maxCount: maxRecordCount,
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
          await axios(config)
            .then(function (response) {
              let externalData = response?.data?.responseContent;
              currentData[commentIndex].assoc_decode = externalData;
              setCaseFields(currentData);
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
    if (!parentDropDownloaded) {
      notification.toast.warning("Please wait. Your fields are loading...!!");
      return false;
    }
    let fields = {};
    var submitted = true;
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

    fields["AssignTo"] = assignTo > 0 ? assignTo : caseData.assignTo;

    if (submitted == true) {
      //{ timer: 3000 }
      notification.toast.success("Case updated successfully..!!!");
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
    return (
      <div className="">
        <TextField
          name={String(data.controlId)}
          id={String(data.controlId)}
          label={data.controlTitle}
          defaultValue={data.controlValue}
          required={data.isRequired}
          fullWidth={true}
          InputLabelProps={{ shrink: true }}
          autoFocus={index == 0 ? true : false}
        />
      </div>
    );
  };

  const handleModelChange = (event) => {
    setFroalaValue(event);
  };

  const createFroalaField = () => {
    return (
      <div>
        <br></br>
        <Froala onModelChange={(e) => handleModelChange(e)} />
      </div>
    );
  };

  const createDateField = (data, index) => {
    var dateFormat = require("dateformat");
    return (
      <div className="">
        <TextField
          type="date"
          name={String(data.controlId)}
          id={String(data.controlId)}
          label={data.controlTitle}
          defaultValue={dateFormat(data.controlValue, "yyyy-mm-dd")}
          InputLabelProps={{ shrink: true }}
          required={data.isRequired}
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
    return (
      <div className={classes.form+' '+'card-page-wrap'}
        id="card-page-wrap"
        onScroll={(event) => onScroll(data, event)}
      >
        {" "}
        <TextField
          id={String(data?.controlId)}
          select
          name={String(data?.controlId + caseType)}
          label={data.controlTitle}
          value={
            data.externalDatasourceId > 0
              ? data.externalDatasourceObjectId
              : data.decodeId
          }
          onChange={(event) => {
            handleChange(data, index, data?.controlId, event);
          }}
          fullWidth={true}
          required={data.isRequired}
          autoFocus={index == 0 ? true : false}
        >
          {data.assoc_decode?.length
            ? data.assoc_decode.map((option) => (
                <MenuItem key={option.DecodeId} value={option.DecodeId}>
                  {option.DecodeValue}
                </MenuItem>
              ))
            : []}

          {data?.assoc_decode?.length >= maxCount &&
          data?.assoc_decode?.length % maxCount == 0 ? (
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
        className="input-file-upload"
        caseType={caseType}
        handleOnFileChange={handleOnFileChange}
      ></FileUpload>
    );
  };

  const handleAutocompleteChange = (userId) => {
    setAssignTo(userId);
  };

  const fieldHandler = (data, index) => {
    if (data.controlTypeCode === "T" || data.controlTypeCode === "N") {
      return createTextField(data, index);
    } else if (data.controlTypeCode === "A") {
      return createDateField(data, index);
    } else if (
      (data.controlTypeCode === "D" ||
        data.controlTypeCode === "E" ||
        data.controlTypeCode === "O") &&
      data.externalDatasourceId !== 121
    ) {
      return createDropDownField(data, index);
    }
  };

  const loadFields = () => {
    return (
      <Box>
   
          <Grid container spacing={3}>
            <Grid item xs={12}>
              
                {caseFields.length
                  ? caseFields.map((item, index) => (
                      <div key={index}>{fieldHandler(item, index)}</div>
                    ))
                  : []}
                <Box></Box>
           
            </Grid>
          </Grid>
       

        {!loaded ? createLoader() : []}
      </Box>
    );
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
          src={process.env.REACT_APP_USER_ICON.concat(userName)}
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

  const createNotes = (notes, index) => {
    var element = document.createElement("div");
    element.innerHTML = notes.note;
    var imgSrcUrls = element.getElementsByTagName("img");
    var hrefUrls = element.getElementsByTagName("a");
    for (var i = 0; i < imgSrcUrls.length; i++) {
      var urlValue = imgSrcUrls[i].getAttribute("src");
      let isUrlContain = false;
      if (urlValue) {
        isUrlContain = urlValue.includes("http");
      }

      if (!isUrlContain) {
        urlValue = casesBaseURL + urlValue;
      }
      if (urlValue) {
        imgSrcUrls[i].setAttribute("src", urlValue);
        // This commented code is for set image width and height

        // imgSrcUrls[i].setAttribute(
        //   "style",
        //   "height: 100%;max-width: 100%; max-height: 100%; margin: auto;"
        // );
      }
    }

    for (var j = 0; j < hrefUrls.length; j++) {
      var hrefUrlValue = hrefUrls[j].getAttribute("href");
      let hrefId = hrefUrls[j].getAttribute("id");
      let isHrefUrlContain = false;
      if (hrefUrlValue) {
        isHrefUrlContain = hrefUrlValue.includes("http");
      }

      if (!isHrefUrlContain) {
        hrefUrlValue = casesBaseURL + hrefUrlValue;
      }
      if (hrefUrlValue) {
        hrefUrls[j].setAttribute("href", hrefUrlValue);
      }
    }

    var dateFormat = require("dateformat");

    return (
      <div className="card-user-comment">
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item className="st-p-1">
            <Avatar>{renderUserImage(notes.createdBy)}</Avatar>
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: "left" }}>
              {notes.fullName ? notes.fullName : notes.createdBy}
            </h4>
            <p style={{ textAlign: "left", color: "gray" }}>
              Posted at {dateFormat(notes.createdAt, "mmm dd, yyyy h:MM TT")}
            </p>
            <p style={{ textAlign: "left" }}>
              <div
                dangerouslySetInnerHTML={{ __html: element.innerHTML }}
              ></div>
            </p>
          </Grid>
        </Grid>

        <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
      </div>
    );
  };

  const notesHandler = (notes, index) => {
    if (notes) {
      return createNotes(notes, index);
    }
  };

  const loadNotes = () => {
    return (
      <Grid item item xs={12} sm={12} md={12} lg={12}>
        <h1>Comments</h1>
        {notes.length
          ? notes.map((item, index) => (
              <span key={index}>{notesHandler(item, index)}</span>
            ))
          : "No Comments Available...!!!"}
      </Grid>
    );
  };

  return (
    <>
      <Grid item lg={6} md={6} xs={12} sm={12} className="panel-center">
        <Typography color="textSecondary" gutterBottom>
          {caseData.typeName}
        </Typography>
        <Typography variant="h4" component="h3">
          {caseData.title}
        </Typography>

        <Box>{createFileField()}</Box>
        <span>Description</span>
        {createFroalaField()}
        <div>
          {notesLoaded ? (
            <div className="comment-list">{loadNotes()}</div>
          ) : (
            <p>Please wait...!! Comments Loading</p>
          )}
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={3}
        lg={3}
        className="panel-right st-p-1 side-bar-case-create"
      >
        {/* <CaseDetailBasicInfo /> */}
        <Box>
          <div data-test-id="">
            <CaseBasicInformation
              caseData={caseData}
              handleAutocompleteChange={handleAutocompleteChange}
            ></CaseBasicInformation>

            {caseFields ? (
              <Accordion
                className="input-accordation"
                expanded={fieldExpanded}
                onChange={(event) => {
                  handleFieldAccordionChange(fieldExpanded);
                }}
              >
                <AccordionSummary
                  className="input-accordation-summary"
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    {!fieldExpanded ? "Show  more fields" : "Show less"}
                  </Typography>
                </AccordionSummary>
                {caseFields?.length ? (
                  <AccordionDetails className="case-fields" style={{display:'block'}}>
                    <form onSubmit={handleSubmit} className="case-create-form">
                      <Button type="submit" variant="contained" color="primary">
                        Save
                      </Button>
                      <br />
                      <br />
                      <Typography>{loadFields()}</Typography>
                    </form>
                  </AccordionDetails>
                ) : (
                  <AccordionDetails>
                    <Typography>
                      Please wait while we are loading fields...!!
                    </Typography>
                  </AccordionDetails>
                )}
              </Accordion>
            ) : (
              ""
            )}
          </div>
        </Box>
      </Grid>
    </>
  );
}
