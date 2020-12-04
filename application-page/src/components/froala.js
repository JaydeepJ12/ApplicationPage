import React from 'react';
import ReactDOM from 'react-dom';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
//import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';

export default function Froala(props){

    return ( <FroalaEditor 
        {...props}
        config={{apiKey:'AVB8B-21A3B3E3D2F2D1ua2BD1IMNBUMRWAd1AYMSTRBUZYA-9H3E2J2C5C6B3B2B5B1D1=='}}/> )
};

function ViewFroala(){

    return ( <FroalaEditorView/> )
};