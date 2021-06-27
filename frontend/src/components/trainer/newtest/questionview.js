import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Descriptions, Typography, Divider } from 'antd';

import {SecurePost} from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import Alert from '../../common/alert';

import { Redirect } from 'react-router-dom';
import Markdown from '../../../utils/Markdown';
import renderHTML from 'react-render-html';
import { FormBuilder, FormRenderer } from 'react-ant-form-builder';

const { Title } = Typography;

class FinalQuestionView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            testid: null
        };
    };

    createtest = () => {
        SecurePost({
            url: apis.CREATE_TEST,
            data: {
                type: this.props.test.newtestFormData.testType,
                title: this.props.test.newtestFormData.testTitle,
                questions: this.props.test.newtestFormData.testQuestions,
                duration: this.props.test.newtestFormData.testDuration,
                subjects: this.props.test.newtestFormData.testSubject,
                organisation: this.props.test.newtestFormData.OrganisationName,
                startTime: this.props.test.newtestFormData.startTime,
                endTime: this.props.test.newtestFormData.endTime,
                
                addjobpost: this.props.test.addjobpost,
                jobtitle:this.props.test.jobPostData.title,
                jobdescription: this.props.test.jobPostData.description,
                joblocation: this.props.test.jobPostData.location,
                jobtype: this.props.test.jobPostData.type,
                jobcustom: this.props.test.jobPostData.customdata,

                addcoding: this.props.test.addcoding,
                codingquestions: this.props.test.codingtData.testQuestions,
            }
        })
        .then((response) => {
            // console.log(response.data);
            if (response.data.success) {
                Alert('success', 'Test paper Created Successfully!', 'Redirecting to Test Deatils Page.');
                setTimeout(() => {
                    this.setState({
                        testid: response.data.testid
                    })
                }, 3000);
            }
            else {
                Alert('error', 'Error!', response.data.message);
            }
        }).catch((err) => {
            // console.log(err);
            Alert('error', 'Error!', 'Server Error');
        });
    }

    render(){
        if(this.state.testid){
            return <Redirect to={`/user/conducttest?testid=${this.state.testid}`} />
        }
        else{
            return (
                <div>
                    {this.props.test.addjobpost ? 
                        <div style={{justifyContent: 'left'}} >
                            <Descriptions 
                                size="small" 
                                title="Job Post Info"
                                column={4} 
                                layout="vertical" 
                                bordered={true}
                            >
                                <Descriptions.Item span={1} label="Job Title">
                                    {this.props.test.jobPostData.title}
                                </Descriptions.Item>

                                <Descriptions.Item 
                                    span={1} 
                                    label="Job Description" 
                                    style={{justifyContent: 'left'}}
                                >
                                    {renderHTML(this.props.test.jobPostData.description)}
                                </Descriptions.Item>

                                <Descriptions.Item span={1} label="Job Location" style={{justifyContent: 'left'}} >
                                    {this.props.test.jobPostData.location}
                                </Descriptions.Item>

                                <Descriptions.Item span={1} label="Job Type" style={{justifyContent: 'left'}} >
                                    {this.props.test.jobPostData.type}
                                </Descriptions.Item>

                                <Descriptions.Item span={1} label="Custom Form" style={{justifyContent: 'left'}} >
                                    <FormRenderer
                                        allowDraft={false}
                                        formStructure={this.props.test.jobPostData.customdata}
                                        onError={error => console.log(error)}
                                    />
                                </Descriptions.Item>

                                <br />
                            </Descriptions>
                        </div> : <div></div>
                    }
                    
                    <Divider />

                    <Title level={3} style={{textAlign: 'center'}} >Assessment Question</Title>

                    {this.props.test.newtestFormData.testQuestions.map((d,i)=>{
                        return <Q key={i+1} _id={d} no={i+1}/>
                    })}
                    <div style={{width:'100%',padding:'10px'}}>
                        <Button style={{float:'right'}} type="primary" onClick={this.createtest}>
                            Create Test
                        </Button>
                    </div>
                    
                </div>
            )
        }
    };
};

const mapStateToProps = state => ({
    test : state.test
});

export default connect(mapStateToProps,null)(FinalQuestionView);

function QuestionView(props) {
    var _id = props._id;
    var no = props.no;
    var obj = props.test.questionsAvailablebasedonSubject.filter((hero) => {
        return hero._id == _id;
    });
    
    // console.log(obj[0].weightage);

    var oo = ['A', 'B', 'C', 'D', 'E'];

    return (
        <div style={{ marginBottom: '20px' }}>
            <div>
                <div style={{ width: '100%' }}>
                    <b style={{ float: 'left' }}>Question No. {no})</b>
                    <b style={{ float: 'right' }}>Marks. {obj[0].weightage}</b>
                </div>
                <div style={{ padding: '5px 20px' }}>
                    <br />
                    <Markdown>
                        {obj[0].body}
                    </Markdown>
                    {obj[0].quesimg ? <img alt="Question" src={obj[0].quesimg} /> : null}
                </div>
            </div>
            <Row>
                {obj[0].options.map((d, i) => {
                    return (
                        <Col key={i} span={12} style={{ padding: '5px 20px' }}>
                            <b>{oo[i]} ) </b> <Markdown>{d.optbody}</Markdown>
                            {d.optimg ? <img alt="Option" src={d.optimg} /> : null}
                        </Col>
                    )
                })}
            </Row>
        </div>
    );
};

var Q = connect(mapStateToProps,null)(QuestionView);