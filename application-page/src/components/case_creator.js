import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  MenuItem,
  Container,
  FormControl,
  Card,
  Fab,
} from "@material-ui/core";
import Froala from "./froala.js";
import AddIcon from "@material-ui/icons/Add";
// import Select from 'react-select'

//Ideally this componet takes in a case-type-id,
//make call to backend for data, then generates
//case inpus component

export default function CaseCreator(props) {
  //url is hard coded, will need to adjust after dev

  const [caseType, setCaseType] = useState(19);
  const [data, setData] = useState([]);
  const [DropDownData, setDropDownData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fields = () => {
    console.log(caseType);
    axios
      .get("http://localhost:5000/cases/config?CaseTypeID=".concat(caseType))
      .then(resp => setData(resp.data))
      .then(setLoaded(true))
    //wait until after axios req is done
   
  };

  const createTextField = (data) => {
    return ( 
        <div className="">
          <TextField
            id={String(data.ASSOC_TYPE_ID)}
            label={data.label}
            required
          />
        </div>)
  }

  const createDateField = (data) => {
    return (<div className="">
          <FormControl>
            <TextField
              type="date"
              id={String(data.ASSOC_TYPE_ID)}
              label={data.label}
              InputLabelProps={{ shrink: true }}
              required
            />
      </FormControl>
    </div>)
  }

  const createDropDown = (data) =>{
    axios.get('http://localhost:5000/cases/assocDecode', {params:{ASSOC_TYPE_ID:data.AssocTypeId}} )
          .then(resp => {setDropDownData(resp.data)})

    console.log(DropDownData.DecodeValue)
    return (<div>YO</div>)
  }

  const handleSubmit = (event) => {
    console.log(event);
    alert('A name was submitted: ');
    event.preventDefault();
  }

  const convertRequired = (data) => {

    if (data.IsRequired == "Y") {
      //backend use Y and N for True and False
      return true
    } else {
      return false
    }
  }

  const fieldHandler = (data) => {
    //TODO: implment id structure
    console.log(data.AssocTypeId)

    var required = convertRequired(data)

    console.log(required)
    if (data.AssocFieldType === "T" || data.AssocFieldType === "N") {

      return createTextField(data);    
    } else if (data.AssocFieldType === "A") {

      return createDateField(data)
    } else if (
      data.AssocFieldType === "D" ||
      data.AssocFieldType === "E" ||
      data.AssocFieldType === "O"
    ) {

        return createDropDown(data);
      }
     else if (data.type === "Froala") {
      return <Froala />;
    }
  };
  const loadFields = () => {
    console.log('Loading...')
    return (<div>
      {loaded
        ? data.map((item, idx) => <div key={idx}>{fieldHandler(item)}</div>)
        : "Loading..."}
    </div>)
  }
  useEffect(fields,[])

  return (
    <form onSubmit={handleSubmit}>
    <Card>
      <Container maxWidth="sm">
        {props.casetypeName}
       <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>

          {loadFields()}
      </Container>
    </Card>
    </form>
  );
}
