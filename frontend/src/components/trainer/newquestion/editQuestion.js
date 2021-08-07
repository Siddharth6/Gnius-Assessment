import React, { Component, Fragment } from 'react';
import './newquestion.css';
import {
    Form,
    Input,
    Button,
    Select,
    Row,
    Col,
    Checkbox,
    Modal,
    Upload,
    Icon,
    InputNumber 
} from 'antd';
import { connect } from 'react-redux';

import { 
    ChangeQuestionConfirmDirty,
    ChangeQuestionTableData,
    ChangeQuestionModalState
} from '../../../actions/trainerAction';

import { SecureGet, SecurePost } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import Alert from '../../../components/common/alert';
import auth from '../../../services/AuthServices';

class QuestionEdit extends Component {
    constructor(props){
        super(props);
        this.state={
            loading: false,
            details: {},
            questionDetails:{
                questionimage:null,
                options :[
                    {
                        image :null,
                        body : null,
                        isAnswer :false
                    },
                    {
                        image :null,
                        body : null,
                        isAnswer :false
                    },
                    {
                        image :null,
                        body : null,
                        isAnswer :false
                    },
                    {
                        image :null,
                        body : null,
                        isAnswer :false
                    }
                ] ,  
            },
            adding:false,
            submitDisabled:false,
            fifthoptioAddButtonVisible:true
        }
        
    }

    componentDidMount(){
        let newOptions = [];

        // Load Options Data
        this.props.details.options.map((option,i) => {
            newOptions[i] = {
                body: option.optbody,
                isAnswer: option.isAnswer,
                optimg: option.optimg,
            };
        });

        this.setState((ps,pp)=>{
            return({
                questionDetails:{
                    ...ps.questionDetails,
                    options:newOptions
                }
            })
        });
    };

    addfifthOption = (e)=>{
        this.setState((previousState,previousProps)=>{
            return({
                fifthoptioAddButtonVisible:false,
                questionDetails:{
                    ...previousState.questionDetails,
                    options:[
                        ...previousState.questionDetails.options,
                        {
                            image :null,
                            body : null,
                            isAnswer :false
                        }
                    ]
                }
            })
        })
    }

    Customalert = ()=>{
        Modal.confirm({
            title: 'Confirm',
            content: 'empty option can not be set as answer',
            okText: 'I understand',
            cancelText: null,
        });
    };
    
    OptionTextChange =(e,i)=>{
        var newOptions = [...this.state.questionDetails.options]
        newOptions[i]={
            ...this.state.questionDetails.options[i],
            body : e.target.value
        }
        if((newOptions[i].image==='undefined' || newOptions[i].image===undefined || newOptions[i].image===null || newOptions[i].image==='null') && 
            (newOptions[i].body==='undefined' || newOptions[i].body===undefined || newOptions[i].body==='null' || newOptions[i].body==='' || newOptions[i].body===null)){
                newOptions[i]={
                    ...this.state.questionDetails.options[i],
                    isAnswer : false
                }
                this.setState((ps,pp)=>{
                    return({
                        questionDetails:{
                            ...ps.questionDetails,
                            options:newOptions
                        }
                    })
                })
        }
        this.setState((ps,pp)=>{
            return({
                questionDetails:{
                    ...ps.questionDetails,
                    options:newOptions
                }
            })
        })     
    }

    AnswerOptionSwitch = (e,i)=>{
        if((this.state.questionDetails.options[i].body!=='' && this.state.questionDetails.options[i].body!==null)
            || (this.state.questionDetails.options[i].image!==null && this.state.questionDetails.options[i].image!=='undefined' && this.state.questionDetails.options[i].image!==undefined)
        ){
            var newOptions = [...this.state.questionDetails.options]
            newOptions[i]={
                ...this.state.questionDetails.options[i],
                isAnswer : e.target.checked
            }
            this.setState((ps,pp)=>{
                return({
                    questionDetails:{
                        ...ps.questionDetails,
                        options:newOptions
                    }
                })
            })
            
        }
        else{   
            this.Customalert()
            return;
        }
        
    }

    OptionImageonChange = (f,i)=>{
        var newOptions = [...this.state.questionDetails.options]
        if(!f){
            delete newOptions[i].image
            newOptions[i].image=null
        }
        else{
            newOptions[i]={
                ...this.state.questionDetails.options[i],
                image :`${apis.BASE}/${f.link}`
            }
        }
        this.setState({
            submitDisabled:false
        })
        if((newOptions[i].image==='undefined' || newOptions[i].image===undefined || newOptions[i].image===null || newOptions[i].image==='null') && 
            (newOptions[i].body==='undefined' || newOptions[i].body===undefined || newOptions[i].body==='null' || newOptions[i].body==='' || newOptions[i].body===null)){
                newOptions[i]={
                    ...this.state.questionDetails.options[i],
                    isAnswer : false
                }
        }
        this.setState((ps,pp)=>{
            return({
                questionDetails:{
                    ...ps.questionDetails,
                    options:newOptions
                }
            })
        })
    };

    // Handle Submit
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var f = 1;
                var ans = 0;
                var opts = [];
                this.state.questionDetails.options.forEach((element,i) => {
                    opts.push({
                        optbody:element.body,
                        optimg:element.image,
                        isAnswer:element.isAnswer
                    });
                    if((element.image==='undefined' || element.image===undefined || element.image===null || element.image==='null')&&(element.body==='' ||element.body===null || element.body==='null' || element.body==='undefined' || element.body===undefined )){
                        f=0;
                    }
                    if(element.isAnswer){
                        ans=ans+1
                    }
                })
                if(f){
                    if(!ans){
                        Alert('warning','Warning!','There must be atleast one right answer');
                    }
                    else{
                        this.setState({
                            adding:true
                        });

                        SecurePost({
                            url:apis.EDIT_QUESTION,
                            data:{
                                _id: this.props.details._id,
                                body:values.questionbody,
                                options:opts,
                                quesimg:this.state.questionDetails.questionimage,
                                subject:values.subject,
                                explanation:values.explanation,
                                weightage:values.waitage,
                            }
                        }).then((response) => {
                            this.setState({
                                adding:false
                            });

                            if(response.data.success){
                                this.props.ChangeQuestionModalState(false);
                                Alert('success','Success',response.data.message);
                                this.props.ChangeQuestionTableData(this.props.trainer.selectedSubjects);
                            }
                            else{
                                this.props.ChangeQuestionModalState(false);
                                this.props.form.resetFields();
                                return Alert('warning','Warning!',response.data.message);
                            }

                        }).catch((error)=>{
                            this.props.form.resetFields();

                            this.setState({
                                adding:false,
                                questionDetails:{
                                    questionimage:null,
                                    options :[
                                        {
                                            image :null,
                                            body : null,
                                            isAnswer :false
                                        },
                                        {
                                            image :null,
                                            body : null,
                                            isAnswer :false
                                        },
                                        {
                                            image :null,
                                            body : null,
                                            isAnswer :false
                                        },
                                        {
                                            image :null,
                                            body : null,
                                            isAnswer :false
                                        }
                                    ] ,  
                                }
                            });
                            return Alert('error','Error!','Server Error');
                        })
                        
                    }
                }
                else{
                    Alert('warning','Warning!','Please fill all the options');
                }
            }
        });
    };

    changeqImage = (f)=>{
        this.setState((ps,pp)=>{
            return({
                questionDetails:{
                    ...ps.questionDetails,
                    questionimage:(f.link ?`${f.link}`:null)
                },
                submitDisabled:false
            })
        })
    };

    upl = () => {
        this.setState({
            submitDisabled: true
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const { Option } = Select;
        const { TextArea } = Input;

        var QuestionImageprops = {
            name: 'file',
            action: `${apis.BASE}${apis.FILE_UPLOAD}?Token=${auth.retriveToken()}`,
            listType: 'picture',
        };

        return (
            <Fragment>
                <div className="register-subject-form">
                        <div className="register-trainer-form-body">
                                <Form  onSubmit={this.handleSubmit}>
                                    <div>
                                        <Row>
                                            <Col span={8}>
                                                <Form.Item label="Subject" hasFeedback>
                                                    {getFieldDecorator('subject', {
                                                        initialValue: this.props.details.subject._id,
                                                        rules: [{ required: true, message: 'Please select any subject!' }],
                                                    })(
                                                        <Select
                                                            showSearch
                                                            style={{ width:'100%'}}
                                                            placeholder="Select a subject"
                                                            optionFilterProp="s"
                                                        >
                                                            {
                                                                this.props.admin.subjectTableData.map((d,i)=><Option 
                                                                    key={d._id} 
                                                                    s={d.topic} 
                                                                    value={d._id}
                                                                >
                                                                    {d.topic}
                                                                </Option>)
                                                            }
                                                        </Select>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row>
                                            {/* Question Body */}
                                            <Col span={18}>
                                                <Form.Item label="Question" hasFeedback>
                                                    {getFieldDecorator('questionbody', {
                                                        initialValue: this.props.details.body,
                                                        rules: [{ required: true, message: 'Please type question!' }],
                                                    })(
                                                        <TextArea rows={5} />
                                                    )}
                                                </Form.Item>
                                            </Col>

                                            <Col span={6} style={{padding : '0px 20px'}}>
                                                <Form.Item label="Question Image">
                                                    <Upload 
                                                        {...QuestionImageprops} 
                                                        beforeUpload={this.upl} 
                                                        onRemove={this.changeqImage} 
                                                        onSuccess={this.changeqImage}
                                                    >
                                                        <Button>
                                                            <Icon type="upload" /> Upload
                                                        </Button>
                                                    </Upload>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col span={18}>
                                                <Form.Item label="Explanation" hasFeedback>
                                                    {getFieldDecorator('explanation', {
                                                        initialValue: this.props.details.explanation,
                                                        rules: [{ required: true, message: 'Please type Explanation for the answers!' }],
                                                    })(
                                                        <TextArea onChange={this.ExplanationChange} rows={3} />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                            <Col offset={2} span={4}>
                                                <Form.Item label="Weightage" hasFeedback>
                                                    {getFieldDecorator('waitage', {
                                                        initialValue: this.props.details.weightage,
                                                        rules: [{ required: true, message: 'Please enter the marks' }],
                                                    })(
                                                        <InputNumber min={1} max={2}  />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        {/* Options */}
                                        <div style={{paddingTop:'20px'}}>
                                            {
                                                this.state.questionDetails.options.map((option,i)=>{
                                                    
                                                    return(
                                                        <Row key={i} className="">
                                                            <Col offset={1} span={13}>
                                                                <Form.Item 
                                                                    label={`option${i+1}`}
                                                                >
                                                                    <TextArea 
                                                                        value={this.state.questionDetails.options[i].body} 
                                                                        onChange={ (e)=>this.OptionTextChange(e,i)} 
                                                                        rows={3} 
                                                                    />
                                                                </Form.Item>
                                                            </Col>

                                                            <Col offset={2} span={6} style={{textAlign:'center'}}>
                                                                <Form.Item label={`Option${i+1} Image`}>
                                                                    <Upload {...QuestionImageprops} beforeUpload={this.upl} onRemove={(f)=>this.OptionImageonChange(null,i)} onSuccess={(f)=>this.OptionImageonChange(f,i)}>
                                                                        <Button>
                                                                            <Icon type="upload" /> Upload
                                                                        </Button>
                                                                    </Upload>
                                                                </Form.Item>
                                                            </Col>

                                                            <Col span={2} style={{padding : '55px 10px'}}>
                                                                <Form.Item>
                                                                    <Checkbox checked={this.state.questionDetails.options[i].isAnswer} onChange={(e)=>this.AnswerOptionSwitch(e,i)} ></Checkbox>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )
                                                })
                                            }
                                        </div>

                                        <Row>
                                            <Col span={12}>
                                                { this.state.fifthoptioAddButtonVisible ? <Button type="primary" onClick={(e)=>this.addfifthOption(e)}>Add 5th option</Button> : null}
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col offset={20}  span={4}>
                                                <Form.Item>
                                                    <Button 
                                                        type="primary" 
                                                        htmlType="submit" 
                                                        disabled={this.state.submitDisabled} 
                                                        loading={this.state.adding} 
                                                        block
                                                    >
                                                        Submit
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>

                                </Form>
                        </div>
                    </div>
            </Fragment>
        );
    }
};

const mapStateToProps = state => ({
    trainer : state.trainer,
    admin : state.admin
});

const EditQuestionForm = Form.create({ name: 'newQuestion' })(QuestionEdit);

export default connect(mapStateToProps,{
    ChangeQuestionConfirmDirty,
    ChangeQuestionModalState,
    ChangeQuestionTableData
})(EditQuestionForm);