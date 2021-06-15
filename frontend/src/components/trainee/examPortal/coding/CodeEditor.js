import React, { useState, Fragment, useEffect } from "react";
import AceEditor from "react-ace";
import { Typography, Button } from 'antd';
import axios from 'axios';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";

import { SecurePost } from '../../../../services/axiosCall';
import apis from '../../../../services/Apis';
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
    fontSize: 16,
    testcaseshow: false 
  });

  const [score, setscore] = useState([]);

  // useEffect(() => {}, []);

  const handleCodeChange = (ncode) => {
    setQuestion({ ...question, code: ncode });
    // console.log(ncode);
  };
  
  const handleMode = (event) => {
    let lang = event.target.value;
  
    let req_mode = "c_cpp";
    
    if (lang === '48') {
      req_mode = "c_cpp"
    }

    if (lang === '52') {
        req_mode = "c_cpp"
    }

    else if (lang ==='62') {
      req_mode = "java"
    }

    else if (lang === '70') {
      req_mode = "python"
    }

    else if (lang ==='71') {
      req_mode = "python"
    }

    setQuestion({ ...question, editorMode: req_mode, language: lang })
  };

    // Submit Code For Evaluation
    const submitCode = (event) => {
        event.preventDefault();
        setQuestion({ ...question, 
            error: "", 
            evaluating: true, 
            testcaseshow: false 
        });

        // Submit
        SecurePost({
            url:apis.POST_SUBMISSION,
            data:{
                testId: props.test.testid,
                traineeId: props.test.traineeid,
                que_id: props.data._id,
                source_code: question.code, 
                language_id: question.language,
            }
        })
        .then((response) => {
            setQuestion({ 
                ...question, 
                error: "", 
                evaluating: false, 
                testcaseshow: true 
            });

            setscore(response.data.score);

            console.log(response.data.score);
        })
        .catch((error) => {
            setQuestion({ 
                ...question, 
                error: "", 
                evaluating: false, 
                testcaseshow: true 
            });
        });
    };

    const isEvaluating = () => {
        if(question.evaluating) {
            return <React.Fragment>
                <span className="text-info ml-2">Evaluating...</span>
            </React.Fragment>
        }
    };

    const showResult = () => {
        let i = 1;
        return score.map((data) => {
            return <div className="container">
            <div className="row">
                <div className="col-lg-6">
                    <b>Test Case - #</b>{i++}
                </div>
                
                <div className="col-lg-6">
                    <b>Status - </b>{data}
                </div>
            </div>
        </div>    
        });
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

                    <option value="48">C (GCC 7.4.0)</option>
                    <option value="52">C++ (GCC 7.4.0)</option>
                    <option value="62">Java (OpenJDK 13.0.1)</option>
                    <option value="70">Python (2.7.17)</option>
                    <option value="71">Python (3.8.1)</option>
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
                                {score.length > 0 ? showResult() : null}
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