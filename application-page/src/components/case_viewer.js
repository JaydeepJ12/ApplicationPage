import {
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    MenuItem,
    Paper,
    TextField
} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SecureLS from "secure-ls";
import swal from "sweetalert";
import UserAutocomplete from "./autocomplete.js";
import FileUpload from "./file-upload.js";
import Froala from "./froala.js";
import Loading from "./Loader.js";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function CaseViewer(props) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(true);
  const [state, setState] = useState({});
  //   const [caseId, setCaseId] = useState(props.caseId);
  const [caseType, setCaseType] = useState(0);
  const [parentChildData, setParentChildData] = useState([]);
  const [froalaValue, setFroala] = useState({});
  const [formDataValue, setFormDataValue] = useState([]);
  const [maxCount, setMaxCount] = useState(50);
  const [parentValue, setParentValue] = useState(0);
  const [loadMoreText, setLoadMoreText] = useState(false);
  const [defaultHopper, setDefaultHopper] = useState("");
  const [defaultHopperId, setDefaultHopperId] = useState(0);
  const [assignTo, setAssignTo] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [fieldExpanded, setFieldExpanded] = useState(false);
  const [caseData, setCaseData] = useState(props.caseData);

  const handleFieldAccordionChange = (isFieldExpanded) => (
    event,
    isExpanded
  ) => {
    setFieldExpanded(!isFieldExpanded);
  };
  const handleCaseTypeChange = (caseId, caseData) => {
    const caseTypeId = 19;
    setData([]);
    setNotes([]);
    setCaseData(caseData);
    setCaseType(caseTypeId);
    if (caseTypeId > 0) {
      setLoaded(false);
      // var defaultHopperValue = caseTypeData.find(
      //   (x) => x.CASE_TYPE_ID === caseTypeId
      // );
      // if (defaultHopperValue) {
      //   setDefaultHopper(defaultHopperValue.HopperName);
      //   setDefaultHopperId(defaultHopperValue.DEFAULT_HOPPER_ID);
      //   setAssignTo(defaultHopperValue.DEFAULT_HOPPER_ID);
      // }
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
      url: "http://localhost:5000/cases/GetCaseNotes",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        const notesData = response.data.responseContent;
        setNotes(notesData);
        setLoaded(true);
        fields(caseTypeId);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    handleCaseTypeChange(props.caseId, props.caseData);
  }, [props.caseId, props.caseData]);

  const fields = (caseTypeId) => {
    // var ls = new SecureLS({encodingType: 'aes'});
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
      // setData(fieldData);
      console.log(fieldData);
      fieldDataReceived = true;
    }

    var localParentChildData = ls.get("ParentChildData-" + caseTypeId);

    var parentChildDataReceived = false;
    if (localParentChildData || localParentChildData != "") {
      setParentChildData(JSON.parse(localParentChildData));
      parentChildDataReceived = true;
      loadParentDropDown(
        JSON.parse(localParentChildData),
        fieldData,
        caseTypeId
      );
    }
    axios
      .get("http://localhost:5000/cases/config?CaseTypeID=".concat(caseTypeId))
      .then((resp) => {
        if (localFieldData !== JSON.stringify(resp.data)) {
          setData(resp.data);
          setLoaded(true);
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
              if (localParentChildData !== JSON.stringify(resp.data)) {
                setParentChildData(resp.data);
                ls.set(
                  "ParentChildData-" + caseTypeId,
                  JSON.stringify(resp.data)
                );
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
            setLoaded(true);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
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

  const createTextField = (data, index) => {
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
      <div className="froala-editor">
        <br></br>
        <br></br>
        <Froala onModelChange={(e) => handleModelChange(e)} fullWidth={true} />
      </div>
    );
  };

  const createDateField = (data, index) => {
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
          // value={state.value}
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
      <UserAutocomplete
        defaultHopper={defaultHopper}
        defaultHopperId={defaultHopperId}
        handleAutocompleteChange={handleAutocompleteChange}
      ></UserAutocomplete>
    );
  };

  const fieldHandler = (data, index) => {
    //TODO: implment id structure
    var required = convertRequired(data);

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
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div>
                {data
                  ? data.map((item, index) => (
                      <div key={index}>{fieldHandler(item, index)}</div>
                    ))
                  : []}
                <Box></Box>
              </div>
            </Grid>
          </Grid>
        </div>

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

  const createNotes = (notes, index) => {
    var element = document.createElement("div");
    element.innerHTML = notes.note;
    var imgSrcUrls = element.getElementsByTagName("img");
    var hrefUrls = element.getElementsByTagName("a");
    for (var i = 0; i < imgSrcUrls.length; i++) {
      var urlValue = imgSrcUrls[i].getAttribute("src");
      if (urlValue) {
        imgSrcUrls[i].setAttribute(
          "src",
          "https://cases.boxerproperty.com/" + urlValue
        );
        imgSrcUrls[i].setAttribute("style", "width:100%");
      }
    }

    for (var j = 0; j < hrefUrls.length; j++) {
      var hrefUrlValue = hrefUrls[j].getAttribute("href");
      if (hrefUrlValue) {
        hrefUrls[j].setAttribute(
          "href",
          "https://cases.boxerproperty.com/" + hrefUrlValue
        );
      }
    }

    var dateFormat = require("dateformat");

    return (
      <div>
        <Paper>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar>{renderUserImage(notes.createdBy)}</Avatar>
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
              <h4 style={{ margin: 0, textAlign: "left" }}>{notes.fullName}</h4>
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
        </Paper>
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
      <Box>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h1>Comments</h1>
              <div>
                {notes
                  ? notes.map((item, index) => (
                      <div key={index}>{notesHandler(item, index)}</div>
                    ))
                  : []}
              </div>
            </Grid>
          </Grid>
        </div>
      </Box>
    );
  };

  const handlePriority = (priority) => {
    let imageSource =
      "https://bhaviks123.atlassian.net/images/icons/priorities/medium.svg";
    if (priority && priority.includes("High")) {
      imageSource =
        "https://bhaviks123.atlassian.net/images/icons/priorities/highest.svg";
      priority = "High";
    } else if (priority && priority.includes("Critical")) {
      imageSource =
        "https://bhaviks123.atlassian.net/images/icons/priorities/highest.svg";
      priority = "Critical";
    } else if (priority && priority.includes("Low")) {
      imageSource =
        "https://bhaviks123.atlassian.net/images/icons/priorities/low.svg";
      priority = "Low";
    } else {
      priority = "Medium";
    }

    return (
      <div className="sc-eOnLuU kbLHgv">
        <div className="sc-igaqVs kvdIbC">
          <img
            className="sc-ccXozh hymfyn"
            src={imageSource}
            width="16px"
            height="16px"
          />
        </div>
        {priority ? (
          <span className="sc-gcpVEs czZyXP">{priority}</span>
        ) : (
          "Medium"
        )}
      </div>
    );
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        alignItems="flex-start"
        p={1}
        m={1}
        bgcolor="background.paper"
      >
        <Grid item xs={12}>
          <Box p={1} style={{ height: "700px", overflow: "auto" }}>
            <div>{caseData.typeName}</div>
            <h1>{caseData.title}</h1>
            <Box>{createFileField()}</Box>
            <div>
              <span>Description</span>
              {createFroalaField()}
            </div>
            <br></br>
            <Button variant="contained" color="primary">
              Save
            </Button>
            <Button variant="contained">Cancel</Button>
            <br></br>
            {loaded ? (
              <Container className="">{loadNotes()}</Container>
            ) : (
              <p>Please wait...!! Comments Loading</p>
            )}
          </Box>
        </Grid>
        <Box className="field-div">
          <div data-test-id="issue.views.issue-base.context.context-items">
            <div
              className="sc-hBfwTO jTBcel"
              data-test-id="issue.views.issue-base.context.context-items.primary-items"
            >
              <div
                className="sc-jyQkQA iBOQoh"
                data-test-id="issue.views.issue-base.context.context-items.pinned-fields-box.pinned-items"
              ></div>
              <div>
                <div className="sc-lXiCt dICbGu">
                  <div
                    className="sc-dcOKER iUrewv"
                    data-test-id="issue.views.field.user.assignee"
                  >
                    <div>
                      <div className="RootWrapper-sc-1va80k6-0 fsVJT">
                        <div>
                          <label className="Label__LabelWrapper-sc-17towfw-0 keOXhT">
                            <div className="Label__LabelInner-sc-17towfw-1 jbyPaz">
                              <span style={{ fontWeight: "bold" }}>
                                Assignee
                              </span>
                            </div>
                          </label>
                        </div>
                        <div className="SingleLineTextInput__ReadView-sc-4hfvq0-0 epXzqq">
                          {caseData?.assignedToFullName
                            ? caseData?.assignedToFullName
                            : caseData?.assignedTo}
                        </div>
                        <Box>{data?.length > 0 ? createAssignTo() : ""}</Box>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="sc-lXiCt dICbGu">
                <div
                  className="sc-dcOKER iUrewv"
                  data-test-id="issue.views.field.user.reporter"
                >
                  <div>
                    <div className="RootWrapper-sc-1va80k6-0 fsVJT">
                      <div>
                        <label className="Label__LabelWrapper-sc-17towfw-0 keOXhT">
                          <div className="Label__LabelInner-sc-17towfw-1 jbyPaz">
                            <span>Reporter</span>
                          </div>
                        </label>
                      </div>
                      <div className="SingleLineTextInput__ReadView-sc-4hfvq0-0 epXzqq">
                        {caseData?.createdByFullName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="sc-lXiCt dICbGu">
                <div className="sc-dcOKER dIawmf">
                  <div>
                    <div className="RootWrapper-sc-1va80k6-0 fsVJT">
                      <div>
                        <label className="Label__LabelWrapper-sc-17towfw-0 keOXhT">
                          <div className="Label__LabelInner-sc-17towfw-1 jbyPaz">
                            <span>Priority</span>
                          </div>
                        </label>
                      </div>
                      {handlePriority(caseData.priority)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <div>
                <div className="sc-efEzrW iJYPpJ">
                  <div>
                    {data?.length > 0 ? (
                      <Accordion
                        expanded={fieldExpanded}
                        onChange={handleFieldAccordionChange(fieldExpanded)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography className={classes.heading}>
                            {!fieldExpanded
                              ? "Show " + data.length + " more fields"
                              : "Show less"}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <div>
                              <Box p={1}>
                                <Container className="">
                                  {loadFields()}
                                </Container>
                              </Box>
                            </div>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </form>
  );
}
