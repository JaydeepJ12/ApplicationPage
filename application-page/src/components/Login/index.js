import {
  Avatar,
  Button,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Typography
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as notification from "../../components/common/toast";
import { isLoginPage } from "../../redux/action";
import "./login.css";

const useStyles = makeStyles(
  (theme) => ({
    main: {
      width: "auto",
      display: "block", // Fix IE 11 issue.
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${
        theme.spacing.unit * 3
      }px`,
    },
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
      marginTop: theme.spacing.unit * 3,
    },
  }),
  { index: 1 }
);

export default function Login(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  // I'm produce state using useState.
  // The second parameter that will keep the first parameter value will change the value.
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    dispatch(isLoginPage(true));
    setUserName("");
    setPassword("");
    if (props.logOutMessage) {
      notification.toast.info(props.logOutMessage);
    }
  }, [props.logOutMessage]);

  //When the form is submitted it will run
  const onSubmit = (props, e) => {
    setIsLoggedIn(false);
    e.preventDefault(); //blocks the postback event of the page
    var data = JSON.stringify({ username: userName, password: password });

    var config = {
      method: "post",
      url: "/people/authenticate",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        let token = response?.data?.responseContent?.jwt;
        if (response.data && response.data.success && token) {
          var userData = jwt_decode(token);

          props.onLogin(
            token,
            userData?.Username,
            userData?.DisplayName,
            userData?.Email
          );
        } else {
          notification.toast.warning(response?.data?.message);
        }
        setIsLoggedIn(true);
      })
      .catch(function (error) {
        console.log(error);
        notification.toast.error(error?.message);
        setIsLoggedIn(true);
      });
  };

  return (
    <>
      {/* {!isLoggedIn ? <div className="loader"></div> : ""} */}
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <form
            className={classes.form}
            onSubmit={(event) => {
              onSubmit(props, event);
            }}
          >
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">User Name</InputLabel>
              {/* When the userName field is changed, setUserName will run and assign the e-mail to the value in the input. */}
              <Input
                id="userName"
                name="userName"
                autoComplete="off"
                autoFocus
                value={userName}
                onInput={(e) => setUserName(e.target.value)}
              />
            </FormControl>
            {!isLoggedIn ? (
              <div className="circular-progress">
                <CircularProgress />
              </div>
            ) : (
              ""
            )}
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              {/* When the password field is changed, setPassword will run and assign the password to the value in the input. */}
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="off"
                value={password}
                onInput={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
    </>
  );
}
