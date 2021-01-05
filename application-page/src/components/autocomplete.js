import { Icon, TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import React, { Fragment, useRef, useState, useEffect } from "react";

export default function UserAutocomplete(props) {
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
  }, [props.selectedUser]);

  const handleAutocompleteKeyPress = () => {
    clearTimeout(timeoutRef.current);
  };

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

  return (
    <div className="assign-to-div">
      <label>Assign To :</label>
      <div style={{ width: "auto", marginTop: ".5em" }}>
        {" "}
        {
          <Autocomplete 
            {...props}
            className="input-auto-complete"
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
}
