import "froala-editor/css/froala_editor.pkgd.min.css";
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
// Require Editor plugin files.
import "froala-editor/js/plugins.pkgd.min.js";
import React from "react";
import FroalaEditor from "react-froala-wysiwyg";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";


// Require Font Awesome.
// import 'font-awesome/css/font-awesome.css';

export default function Froala(props) {
  return (
    <div className="">
      <FroalaEditor
        {...props}
        tag="textarea"
        config={{
          apiKey:
            "AVB8B-21A3B3E3D2F2D1ua2BD1IMNBUMRWAd1AYMSTRBUZYA-9H3E2J2C5C6B3B2B5B1D1==",
        }}
      />
    </div>
  );

  // return ( <FroalaEditor
  //     {...props}
  //     config={{apiKey:'AVB8B-21A3B3E3D2F2D1ua2BD1IMNBUMRWAd1AYMSTRBUZYA-9H3E2J2C5C6B3B2B5B1D1=='}}/> )
}

function ViewFroala() {
  return <FroalaEditorView />;
}
