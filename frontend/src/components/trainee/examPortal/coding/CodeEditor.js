import React, { useState, Fragment } from "react";
import AceEditor from "react-ace";
import { Typography, Button } from 'antd';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";

import Markdown from '../../../../utils/Markdown';

const { Title, Text } = Typography;

const CodeEditor = (props) => {
  const [question, setQuestion] = useState({
    loading: false,
    error: "",
    evaluating: false,
    question: "",
    name: "",
    language: "",
    code: "",
    editorMode: "c_cpp",
    fontSize: 14,
    testcaseshow: false 
  });

  const handleCodeChange = (ncode) => {
    setQuestion({ ...question, code: ncode });
    console.log(ncode);
  };
  
  const handleMode = (event) => {
    let lang = event.target.value;
  
    let req_mode = "c_cpp";
    if (lang === 'c++') {
      req_mode = "c_cpp"
    } else if (lang ==='java') {
      req_mode = "java"
    } else if (lang === 'python') {
      req_mode = "python"
    } else if (lang ==='js') {
      req_mode = "js"
    }
    setQuestion({ ...question, editorMode: req_mode, language: lang })
  };

    // console.log(props.data);

    // Code Evaluation
    const submitCode = (event) => {
        event.preventDefault();
        setQuestion({ ...question, error: "", evaluating: true, testcaseshow:true });
    };

    const isEvaluating = () => {
        if(question.evaluating) {
            return <React.Fragment>
                <span className="text-info ml-2">Evaluating...</span>
            </React.Fragment>
        }
    };


  return (
    <Fragment>

        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div style={{marginTop: '10px'}} ></div>
                </div>
            </div>
        </div>

        {isEvaluating()}

        <div className="container">
            <div className="row">
                {/* Left */}
                <div className="col-lg-6">
                    
                    <Text>
                        Problem Id - {props.data._id}
                    </Text>

                    <Title level={4}>Problem Statement</Title>

                    <div style={{height: '600px'}} >
                        <Markdown>
                            {props.data.statement}
                        </Markdown>
                    </div>

                </div>
                
                {/* Right */}
                <div className="col-lg-6">

                <select 
                    className="custom-select" 
                    style={{marginTop: '10px', marginBottom: '10px', width: '50%'}}  
                    onChange={handleMode}
                >
                    <option value="" selected>Select Language</option>
                    <option value="c">C</option>
                    <option value="c++">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                </select>

                <AceEditor
                    mode={question.editorMode}
                    theme="monokai"
                    name="editor"
                    fontSize={question.fontSize}
                    editorProps={{ $blockScrolling: true }}
                    onChange={handleCodeChange}
                    value={question.code}
                />

                <div style={{marginTop: '10px', marginBottom: '10px'}}></div>

                <Button 
                    type="primary"
                    onClick={submitCode}
                    disabled={question.evaluating}
                >
                    Submit
                </Button>

                </div>
            </div>
        </div>

        {question.testcaseshow ? 
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div style={{marginTop: '20px', textAlign: 'center'}}>
                            <Title level={4}>Results</Title>

                            <div style={{height: '100px', marginBottom:'30px', border: '2px solid #77acf1', width: '100%'}} >
                                <table style={{width:'100%', padding: '5px'}}>
                                    <tr>
                                        <th>Test Case</th>
                                        <th>Status</th>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Passed</td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Wrong</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            :
            null
        }
    </Fragment>
  );
};

export default CodeEditor;