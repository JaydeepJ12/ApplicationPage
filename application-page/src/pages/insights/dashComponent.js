import React, {useEffect, useState} from 'react'

export default function DashComponent(props){
    const [loaded, setLoaded] = React.useState(false)
    const [scriptPaths, setscriptPaths] = React.useState(null)
    const [dashConfig, setdashConfig] = React.useState(null)

    const prefix = props.url
    console.log(prefix)

    const fetch_html = () => {
        fetch(prefix,{method:"GET"}).then(
            (r)=>{
            return r.text()
            }
        ).then(
            (r) =>{
                var el = document.createElement( 'html' );
                el.innerHTML = r
               
                var arr = Array.prototype.slice.call(el.getElementsByTagName('script'))

                var p = arr.map(parse_scripts)
                setscriptPaths(p)
            }
        )
    }
    const parse_scripts = (data, idx) => {
        if (data.id == '_dash-config'){
            setdashConfig(data.innerText)
        }
        //get resource location 
        var idx = data.src.indexOf('/_dash-component-suites')
        return prefix + data.src.substring(idx)
    }

    const add_script = (path, idx) =>{
        const script = document.createElement('script');
        script.id = String(idx)
        //script.async = true;
        script.src = path
        if (path.includes('/dash_renderer/dash_renderer')){
            script.id = '_dash_local_renderer'
        }
        document.body.appendChild(script);
    }
    const add_renderer = () =>{
        //event listener to wait for dash-render js files to be loaded
        document.getElementById("_dash_local_renderer").addEventListener('load', () => {
            // DTM is loaded
            const script = document.createElement('script');
            script.id = '_dash-renderer'
            script.type = 'application/javascript'
        
            script.innerText = 'var renderer = new DashRenderer();'
            document.body.appendChild(script);
          })
        
    }
    const add_config = () =>{
        const script = document.createElement('script');
        script.id = '_dash-config'
        script.type = 'application/json'
        
        //request pathname prefix is key
        //may want to use reace style stuff for htis
        // script.innerText = `{"url_base_pathname": null, 
        // "requests_pathname_prefix":"${url}", 
        // "ui": false, 
        // "props_check": false, 
        // "show_undo_redo": false, "suppress_callback_exceptions": false, "update_title": "Updating..."}`
        var obj = JSON.parse(dashConfig)
        obj.requests_pathname_prefix = prefix
        
        console.log(JSON.stringify(obj))
        script.innerText = JSON.stringify(obj)

        document.body.appendChild(script);
        
        setLoaded(true)
    }
    
    React.useEffect(()=>{
        fetch_html()
       
    },[])

    //when the paths are loaded, append them to the document
    React.useEffect(()=>{
        // don't run before paths are fetches
        if(scriptPaths != null){
        after_html()
        add_config()
        }
    },[scriptPaths])

    const after_html = () =>{
        scriptPaths.map(add_script)
    }

    if(prefix==null){
        return(<div>Empty</div>)
    }

    return (
        <div>
        {loaded ? <div>{add_renderer()}</div>: <div>Rendering Dash Application...</div>}
        </div>)
}