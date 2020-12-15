import { TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import React, { Fragment, useRef, useState } from "react";

export default function ExternalLookup(props) {
  const [data, setData] = useState([]);
  const [typeId, setTypeId] = useState(props.typeId);
  const [fieldName, setFieldName] = useState(props.fieldName);
  const [fieldId, setFieldId] = useState(props.fieldId);
  const [selectedDataValue, setSelectedDataValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const [selectedData, setSelectedData] = useState("");

  let timeoutVal = 1000; // time it takes to wait for user to stop typing in ms

  const handleAutocompleteKeyPress = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleExternalLookupKeyUp = (searchText) => {
    if (searchText == "") {
      //   setSelectedDataValue(0);
      //   setSelectedData("");
      //   setData([]);
    }
  };

  const filterData = (id) => {
    if (data) {
      let fieldData = data.filter((x) => x.id === id);
      if (fieldData) {
        setData(fieldData);
      }
    }
  };

  const handleExternalLookupChange = (id, name) => {
    if (id) {
      props.handleExternalLookupChange(id);
      setSelectedDataValue(id);
      setSelectedData(name);
      filterData(id);
    } else {
      props.handleExternalLookupChange(0);
      setSelectedDataValue(0);
      setSelectedData("");
      setData([]);
    }
  };

  const searchData = (searchText) => {
    if (timeoutRef.current !== null) {
      // IF THERE'S A RUNNING TIMEOUT
      clearTimeout(timeoutRef.current); // THEN, CANCEL IT
    }
    if (searchText != "") {
      setLoading(true);
    }
    // clearTimeout(timer);

    timeoutRef.current = setTimeout(() => {
      // SET A TIMEOUT
      timeoutRef.current = null; // RESET REF TO NULL WHEN IT RUNS
      if (searchText) {
        getData(searchText);
      } else {
        setData([]);
        setLoading(false);
      }
    }, timeoutVal);
  };

  const getData = async (searchText) => {
    var jsonData = {
      searchText: searchText,
      maxCount: 0,
      skipCount: 0,
      application: 1,
      typeID: typeId,
      fieldID: fieldId,
      parentValues: {
        0: ["0"],
      },
      username: "BhavikS",
    };

    var config = {
      method: "post",
      url: "http://localhost:5000/cases/GetEntityExternalDataValues",
      data: jsonData,
    };
    await axios(config)
      .then(function (response) {
        if (response?.data?.responseContent) {
          response.data.responseContent = response.data.responseContent.sort(
            (a, b) => a.name.localeCompare(b.name)
          );
        }

        const externalData = response?.data?.responseContent;
        setData(externalData);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="assign-to-div">
      <label>{fieldName} :</label>
      <div style={{ width: "auto", marginTop: "1rem" }}>
        {" "}
        {
          <Autocomplete
            {...props}
            className=""
            id={"Search " + fieldName}
            options={data}
            getOptionLabel={(option) => option?.name}
            renderOption={(option) => {
              return <Fragment>{option?.name}</Fragment>;
            }}
            // getOptionValue={(option) => option.id}
            style={{ width: "auto" }}
            onChange={(event, fieldData) =>
              handleExternalLookupChange(fieldData?.id, fieldData?.name)
            }
            onInput={(event) => searchData(event.target.value)}
            onKeyUp={(event) => handleExternalLookupKeyUp(event.target.value)}
            open={open}
            loading={loading}
            onOpen={(event) => {
              setOpen(true);
              filterData(selectedDataValue);
            }}
            onClose={(event) => {
              setOpen(false);
            }}
            renderInput={(params) => (
              <Fragment>
                <TextField
                  {...params}
                  label={selectedData ? selectedData : fieldName}
                  placeholder={"Search " + fieldName}
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
}
