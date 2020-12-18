import React,{useState, useEffect} from 'react';
import {Drawer,
        Divider,
        Button,

        Paper,
        Grid,
        ListItem,
        ListItemIcon,
        ListItemText,
        ListItemAvatar,
        makeStyles} from '@material-ui/core'
import {Streetview, SentimentSatisfied} from '@material-ui/icons'
import AppIcon, {AvatarIcon} from './app_icon.js'
import AssignmentIcon from '@material-ui/icons/Assignment';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import PeopleIcon from '@material-ui/icons/People';
import TimelineIcon from '@material-ui/icons/Timeline';
import ViewListIcon from '@material-ui/icons/ViewList';
import { Router, Link } from "@reach/router"

const useStyles = makeStyles((theme)=>({
    avatar:{
      flexGrow:'1'  },
 }));

export default function Dashboard(){
    // Create a state that is displays a page and updated on click
    //
    const app_icon = 'http://entities.boxerproperty.com//Download.aspx?FileID=458702' 
    const name = 'Inside Sales'
    const avatar = 'http://services.boxerproperty.com/userphotos/DownloadPhoto.aspx?username=MichaelAF'
    
    const overview = () => {
        console.log('clicked')
        return 'Hello World'
    }

    const [page,setPage] = useState(null)

    const classes = useStyles();
    return (
        <div className={classes.avatar}>
        <Drawer
        variant="permanent"
        anchor="left"
        color="primary">
            
            <ListItem alignItems='center'>
                <AppIcon src={app_icon}
                        name={name}></AppIcon>
            </ListItem>
        <Divider/>
            <ListItem>
                <ListItemIcon> <Streetview/> </ListItemIcon>
                <ListItemText> <Link to="overview">Overview</Link> </ListItemText>
            </ListItem>
        <Divider/>
            <ListItem button onClick={() => {setPage('Tasks')}}>
                <ListItemIcon> <AssignmentIcon/> </ListItemIcon>
                <ListItemText> Tasks </ListItemText>
            </ListItem >
        <Divider/>
            <ListItem button onClick={() => {setPage('People')}}>
                <ListItemIcon> <PeopleIcon/> </ListItemIcon>
                <ListItemText> People </ListItemText>
            </ListItem>
        <Divider/>
            <ListItem button>
                <ListItemIcon> <ViewListIcon/> </ListItemIcon>
                <ListItemText> Items </ListItemText>
            </ListItem>
        <Divider/>
            <ListItem button>
                <ListItemIcon> <NoteAddIcon/> </ListItemIcon>
                <ListItemText> Forms </ListItemText>
            </ListItem>
        <Divider/>
            <ListItem button>
                <ListItemIcon> <TimelineIcon/> </ListItemIcon>
                <ListItemText> Insights </ListItemText>
            </ListItem>
        <Divider/>
            <ListItem button>
                <ListItemIcon> <PeopleIcon/> </ListItemIcon>
                <ListItemText><Link to="case-select">CaseCreator</Link></ListItemText>   
            </ListItem>
            <Divider/>
            <ListItem button>
                <ListItemIcon> <PeopleIcon/> </ListItemIcon>
                <ListItemText><Link to="case-type-form">CaseTypeForm</Link></ListItemText>
            </ListItem>
            <Divider/>
            <Button color='secondary'>
                HELOO WROLD
            </Button>
        </Drawer>
        <Grid container>
            <Grid item xs={11}>
            <Paper> {page} </Paper>
            </Grid>

            <Grid item xs={1}>
                <Paper>
                    <AvatarIcon src ={avatar}/>
                </Paper>
            </Grid>
        </Grid>
        </div>
    )
}