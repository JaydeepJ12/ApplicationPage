import {
  Box,
  Container,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, {useState} from "react";
import VisualOverview from './overview_visual'
import PeopleOverview from './overview_people'
import ItemOverview from './overview_items'

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function OverView(props) {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  

  
const handleChange = (event, newValue) => {
  setValue(newValue);
};


  return (
    <div className="page" id="page-overview">
      <Container>
        
        <VisualOverview/>
        <PeopleOverview/>
        <ItemOverview/>
                

             
      </Container>
      </div>
  );
}
