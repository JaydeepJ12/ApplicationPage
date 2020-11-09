import React from 'react';
import './App.css';
import Dashboard from './components/dashboard.js';
import {ThemeProvider,
   makeStyles} from '@material-ui/core';
import theme from './components/theme.js';

const useStyles = makeStyles((theme)=>({
   root:{
      minHeight:'100vh',
      backgroundImage: `url(https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png)`
  },
}));

function App() {
  
 const classes = useStyles()
 return <ThemeProvider theme = {theme}>
    <div classes={classes.root}>
    </div>
    <Dashboard></Dashboard>
    
 </ThemeProvider>
}

export default App;
