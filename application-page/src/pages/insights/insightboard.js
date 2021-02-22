import React from 'react'
import DashComponent from './dashComponent'


//this component will be how we render dash reports in teh app
//cors policy will be an issue in development
export default function Insights(){

    return (
    <div>
        <div id='react-entry-point'></div>
        <DashComponent url='https://home.boxerproperty.com/Visualize/3d_scatter'></DashComponent>
    </div>
    )
}
