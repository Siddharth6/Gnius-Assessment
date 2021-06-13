import React, { Fragment, useState, useEffect } from 'react';
import { Skeleton, Row, Col, Icon, Tabs, Descriptions, Button, Typography, Divider } from 'antd';
import { Link } from "react-router-dom";
import moment from 'moment';
import Markdown from '../../../utils/Markdown';

import { SecurePost } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import Alert from '../../../components/common/alert';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const QuestionDetails = (props) => {
    const [state, setstate] = useState({
        id: props.id,
        loading: true,
        details: []
    });

    const [question, setquestion] = useState([]);

    const getData = () => {
        SecurePost({
            url:apis.GET_CODING_QUESTION_DETAILS,
            data:{
                questionId: state.id
            }
        })
        .then((response) => {
            if(response.data.success){
                setquestion(response.data.question);

                setTimeout(() => {
                    setstate({
                        ...state,
                        loading: false
                    });
                }, 3000);
                
            }
            else{
                return Alert('warning','Warning!',response.data.message);
            }
        })
        .catch((error) => {
            return Alert('error','Error!','Server Error');
        });
    };

    useEffect(() => {
        getData();
    }, []);

    const tabChange = (key) => {
        // console.log(key)
    }

    // console.log(question.statement);

    return (
        <Fragment>
            <Skeleton loading={state.loading} active avatar>
                <Tabs defaultActiveKey="1" onChange={(e) => tabChange(e)}>

                    <TabPane tab={<span><Icon type="home" />Basic Info</span>} key="1">
                        <Descriptions 
                            bordered 
                            title="" 
                            border 
                            size="small" 
                            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                        >
                            <Descriptions.Item label="Question Id">{state.id}</Descriptions.Item>

                            <Descriptions.Item label="Problem Statement">
                                <Markdown>
                                    {question.statement}
                                </Markdown>
                            </Descriptions.Item>

                        </Descriptions>
                    </TabPane>

                    <TabPane tab={<span><Icon type="plus" />Test Case</span>} key="2">
                        <Tab2 id={state.id} details={state.details} />
                    </TabPane>

                </Tabs>
            </Skeleton>
        </Fragment>
    );
};

const Tab2 = (props) => {
    const [testcase, setTestCase] = useState({
        loading: true,
        error: "",
        question: {},
        testcases: [],
        input: null,
        output: null
    });

    const questionId = props.id;

    const TestCaseListComp = () => {
        if (testcase.testcases.length) {
            let i = 1;
            return testcase.testcases.map((testcase) => {

                let inputLink = `/testcase/raw/input/${questionId}/${testcase.id}`;
                let outputLink = `/testcase/raw/output/${questionId}/${testcase.id}`;

                return <li className="list-group-item" key={testcase.id}>
                    <div className="row">

                        <div className="col-md-3">
                            <span className="input-label">Testcase #{i++}</span>
                        </div>

                        <div className="col-md-3">
                            <Link target="_blank" to={inputLink}>
                                input
                            </Link>
                        </div>

                        <div className="col-md-3">
                            <Link target="_blank" to={outputLink}>
                                output
                            </Link>
                        </div>

                        <div className="col-md-3">
                            <span className="float-right badge badge-pill badge-danger btn">
                                delete
                            </span>
                        </div>

                    </div>
                </li>
            })
        } else {
            return <div>
                <Title level={4} style={{ marginLeft: '15px'}}> No TestCases found !!!</Title>
            </div>
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
    };

    const handlechangeFile = name => event => {
        setTestCase({ ...testcase, [name]: event.target.files[0] });
    }

    return(
        <Fragment>
            <div className="row mx-0 my-4 pb-md-0 pb-sm-4 shadow-sm align-items-center">
                <div className="col-md-4">
                    <div className="form-group">
                        <span className="input-label">Input File</span>
                        <div className="input-group">
                            <input 
                                type="file" 
                                className="form-control-file" 
                                onChange={handlechangeFile("input")}
                            ></input>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="form-group">
                        <span className="input-label">Output File</span>
                        <div className="input-group">
                            <input 
                                type="file" 
                                className="form-control-file" 
                                onChange={handlechangeFile("output")}
                            ></input>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <button className="btn btn-primary float-right" onClick={onSubmit}>Add</button>
                </div>
            </div>

            <Divider />
            <br />

            <div className="card mb-5">
                <div className="card-body">
                    <ul className="list-group list-group-flush row">
                        {TestCaseListComp()}
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

export default QuestionDetails;
