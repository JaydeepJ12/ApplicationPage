import React, { Component } from "react";
import "./Loader.css";

class Loading extends Component {
  render() {
    return (
      <div>
        <div className="loader-overlay"></div>
        <div class="sk-cube-grid cm-spinner"></div>
      </div>
    );
  }
}

export default Loading;
