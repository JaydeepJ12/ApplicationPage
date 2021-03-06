import { Avatar, CircularProgress, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import useStyles from "../assets/css/common_styles";
export default function UserAutocomplete(props) {
  var classes = useStyles();
  const [users, setUsersData] = useState([]);
  const [assignTo, setAssignTo] = useState(props.defaultHopperId);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(props.selectedUser);
  const [defaultHopper, setDefaultHopper] = useState(props.defaultHopper);
  const [defaultHopperId, setDefaultHopperId] = useState(props.defaultHopperId);

  let timeoutVal = 1000; // time it takes to wait for user to stop typing in ms

  useEffect(() => {
    setSelectedUser(props.selectedUser);
    setDefaultHopper(props.defaultHopper);
    setDefaultHopperId(props.defaultHopperId);
  }, [props.selectedUser, props.defaultHopper, props.defaultHopperId]);

  const handleAutocompleteKeyUp = (searchText) => {
    if (searchText == "") {
      setAssignTo(defaultHopperId);
      setSelectedUser(props.selectedUser);
      setUsersData([]);
    }
  };

  const filterUser = (userId) => {
    let userData = users.filter((x) => x.id === userId);
    if (userData) {
      setUsersData(userData);
    }
  };

  const handleAutocompleteChange = (userId, displayName) => {
    if (userId) {
      props.handleAutocompleteChange(userId);
      setAssignTo(userId);
      setSelectedUser(displayName);
      filterUser(userId);
    } else {
      props.handleAutocompleteChange(defaultHopperId);
      setAssignTo(defaultHopperId);
      setSelectedUser(props.selectedUser);
      setUsersData([]);
    }
  };

  const searchUsers = (searchText, event) => {
    if (timeoutRef.current !== null) {
      // IF THERE'S A RUNNING TIMEOUT
      clearTimeout(timeoutRef.current); // THEN, CANCEL IT
    }
    if (searchText != "") {
      setLoading(true);
    }

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
      url: "/cases/GetEmployeesBySearch",
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
        <Avatar
          // className={classes.avt_small}
          onError={(event) => addDefaultSrc(event)}
          // variant="rounded"
          src={
            "http://services.boxerproperty.com/userphotos/DownloadPhoto.aspx?username=" +
            userName
          }
        />
      );
    } else {
      return (
        <img
          src="../../assets/images/default-userimage.png"
          height={50}
          width={50}
        />
      );
    }
  };

  return (
    <div>
      <div
        style={{ width: "auto", marginTop: ".5em" }}
        className={classes.form}
      >
        {" "}
        {
          <Autocomplete
            {...props}
            id="users"
            options={users}
            getOptionLabel={(option) => option.displayName}
            renderOption={(option) => {
              return (
                <Fragment>
                  {renderUserImage(option?.username)}
                  <span className={classes.ml_one}>
                    {option?.displayName +
                      (option.primaryJobTitle
                        ? " (" + option.primaryJobTitle + ")"
                        : "")}
                  </span>
                </Fragment>
              );
            }}
            // getOptionValue={(option) => option.id}
            style={{ width: "auto" }}
            onChange={(event, user) =>
              handleAutocompleteChange(user?.id, user?.displayName)
            }
            onInput={(event) => searchUsers(event.target.value, event)}
            onKeyUp={(event) => handleAutocompleteKeyUp(event.target.value)}
            open={open}
            loading={loading}
            onOpen={(event) => {
              setOpen(true);
              if (assignTo === defaultHopperId) {
                setUsersData([]);
              } else {
                filterUser(assignTo);
              }
            }}
            onClose={(event) => {
              setOpen(false);
            }}
            renderInput={(params) => (
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
            )}
          />
        }
      </div>
    </div>
  );
}
