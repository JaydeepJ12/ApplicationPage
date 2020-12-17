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
  const [dropDownValues, setDropDownData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState(null);
  const [drop, setDrop] = useState(false);

  const [state, setState] = useState({});
  const [assTypeId, setAssTypeId] = useState(1152);
  const [assTypeId2, setAssTypeId2] = useState(0);

  const fields = () => {
    console.log(caseType);
    axios
      .get("http://localhost:5000/cases/config?CaseTypeID=".concat(caseType))
      .then((resp) => setData(resp.data))
      .then(setLoaded(true));
  };

  const fetchDropDownData = (assocTypeId) => {
    let x = [];
    const response = axios
      .get(
        "http://localhost:5000/cases/assocDecode?ASSOC_TYPE_ID=".concat(
          assocTypeId
        )
      )
      .then((response) => {
        console.log(response);
        // console.log("satate data=>",dropDownValues)
        x = response.data;
        setDropDownData(x);
        //return x;
      })
      .then(setDrop(true));

    //return [];
  };

  const fetchData = (assocTypeId) => {
    let x = [];
    const response = axios
      .get(
        "http://localhost:5000/cases/assocDecode?ASSOC_TYPE_ID=".concat(
          assocTypeId
        )
      )
      .then((response) => {
        console.log(response);
        // console.log("satate data=>",dropDownValues)
        x = response.data;
        setDropDownData(x);
        //return x;
      })
      .then(setDrop(true));

    //return [];
  };

  const addFroala = () => {
    data.push({ type: "Froala" });
  };
  useEffect(() => {
    fields();
    fetchData(assTypeId);
  }, []);

  const currencies = [
    {
      value: "USD",
      label: "$",
    },
    {
      value: "EUR",
      label: "€",
    },
    {
      value: "BTC",
      label: "฿",
    },
    {
      value: "HELLO WORLD",
      label: "HELLO",
    },
  ];

  const handleChange = (event) => {
    const data = event.target;

    setState(data);
  };

  const handleSubmit = (event) => {
    console.log(event);
    alert('A name was submitted: ');
    event.preventDefault();
  }

  const fieldHandler = (data) => {
    //TODO: implment id structure
    var required = false;

    if (data.IS_REQUIRED == "Y") {
      //backend use Y and N for True and False
      required = true;
    }

    // console.log(required)
    // console.log(data.required)

    if (data.FIELD_TYPE === "T" || data.FIELD_TYPE === "N") {
      return (
        <div className="">
          {" "}
          <TextField
            id={String(data.ASSOC_TYPE_ID)}
            label={data.label}
            required
          />
        </div>
      );
    } else if (data.FIELD_TYPE === "A") {
      return (
        <div className="">
          {" "}
          <FormControl>
            <TextField
              type="date"
              id={String(data.ASSOC_TYPE_ID)}
              label={data.label}
              InputLabelProps={{ shrink: true }}
              required
            />
          </FormControl>{" "}
        </div>
      );
    } else if (
      data.FIELD_TYPE === "D" ||
      data.FIELD_TYPE === "E" ||
      data.FIELD_TYPE === "O"
    ) {
      console.log('data.ASSOC_TYPE_ID -', data.ASSOC_TYPE_ID);
      //setAssTypeId2(data.ASSOC_TYPE_ID);
      console.log('assTypeId2 -', assTypeId2);
      // setAssTypeId(data.ASSOC_TYPE_ID);
      function getData (assocTypeId) {
        const response = axios
        .get(
          "http://localhost:5000/cases/assocDecode?ASSOC_TYPE_ID=".concat(
            assocTypeId
          )
        )
        .then((response) => {
          console.log(response);
          //setDropDownData(response.data);
          // console.log("satate data=>",dropDownValues)
          return response.data;
        });

        return [];
      }

      
     //console.log('dropDownValues', getData(data.ASSOC_TYPE_ID));
      return (
        <div className="">
          {" "}
          <TextField
            id={String(data.ASSOC_TYPE_ID)}
            select
            label={data.label}
            value={state.value}
            onChange={handleChange}
            fullWidth={true}
            required
          >
            {data.AssocDecode ? data.AssocDecode.map((option) => (
              <MenuItem
                key={option.ASSOC_DECODE_ID}
                value={option.ASSOC_DECODE_ID}
              >
                {option.NAME}
              </MenuItem>
            )) : []}
          </TextField>
        </div>
      );
    } else if (data.type === "Froala") {
      return <Froala />;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <Card>
      <Container maxWidth="sm">
        {props.casetypeName}
       <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
        <div>
          {loaded
            ? data.map((item, idx) => <div key={idx}>{fieldHandler(item)}</div>)
            : "Loading..."}{" "}
        </div>
      </Container>
    </Card>
    </form>
  );
}
