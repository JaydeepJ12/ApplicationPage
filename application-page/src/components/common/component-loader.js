import React, { useEffect, useState } from "react";
import loaderImage from "../../assets/images/component-loader.gif";

export default function ComponentLoader(props) {
  const [componentLoader, setComponentLoader] = useState(props.componentLoader);

  useEffect(() => {
    setComponentLoader(props.componentLoader);
  }, [props.componentLoader]);

  return (
    <div className="">
      {componentLoader ? (
        <div class="component-loader-overlay">
          <img className="loader-image" src={loaderImage}></img>
          <div class="loader"></div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
