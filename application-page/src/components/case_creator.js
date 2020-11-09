import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {TextField, MenuItem, Container,
     FormControl, Card, Fab} from '@material-ui/core';
import Froala from './froala.js'
import AddIcon from '@material-ui/icons/Add';


//Ideally this componet takes in a case-type-id,
//make call to backend for data, then generates
//case inpus component

export default function CaseCreator(props){
    //url is hard coded, will need to adjust after dev
    const caseType = props.caseType
    const [data, setData] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [value, setValue] = useState(null)

    const [state, setState] = useState({});

    const fields= () => {
        axios.get('http://127.0.0.1:5000/'.concat(caseType))
            .then(resp => setData(resp.data))
            .then(setLoaded(true))
    }
    const addFroala = () => {
      data.push({type:'Froala'})
    }
    useEffect(() =>{
      fields()
    }, [])

    const currencies = [
        {
          value: 'USD',
          label: '$',
        },
        {
          value: 'EUR',
          label: '€',
        },
        {
          value: 'BTC',
          label: '฿',
        },
        {
          value: 'HELLO WORLD',
          label: 'HELLO',
        },
      ]

      const handleChange = (event) => {
        const data = event.target;
        
        setState(data);
      };
    

    const fieldHandler = (data) => {
        //TODO: implment id structure
        var required = 'false'

        if (data.required == 'Y'){//backend use Y and N for True and False
            required = 'true'
        }

        console.log(required)
        console.log(data.required)

        if (data.type === 'T'){

            return <div className={props.inputclassName}> <TextField id={data.assocID}
                        label={data.label} 
                        required={required}/>  
                    </div>
        } else if (data.type === 'A'){

            return <div className={props.inputclassName}> <FormControl>
                      <TextField type="date" 
                      id={data.assocID}
                      label={data.label} 
                      InputLabelProps={{ shrink: true }} 
                      required={required} />  
                    </FormControl> </div>
        } else if (data.type === 'D'){

            return <div className={props.inputclassName}> <TextField
                    id={data.assocID}
                    select
                    label={data.label} 
                    value={state.value}
                    onChange={handleChange}
                    fullWidth='true'
                    required={required} >
                                {currencies.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))} 
                      </TextField>  
                    </div>
        } else if (data.type === 'Froala'){

          return <Froala/>
        }
    
 

    }
      
  return (
    <Card>
    <Container maxWidth="sm">
       {props.casetypeName}
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
        <div>{loaded ? data.map((item, idx)=>(
                                                <div>{fieldHandler(item)}</div>
                                            )): 'Loading...' } </div>
      
    </Container>
    </Card>
  )
}
    