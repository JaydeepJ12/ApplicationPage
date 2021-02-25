import React from 'react'
import DashComponent from './dashComponent'


//this component will be how we render dash reports in teh app
//cors policy will be an issue in development
//https://home.boxerproperty.com/Visualize/3d_scatter
export default function Insights(){

    return (
    <div>
        <div id='react-entry-point'></div>
        <DashComponent url='http://localhost:8050'></DashComponent>
    </div>
    )
}
