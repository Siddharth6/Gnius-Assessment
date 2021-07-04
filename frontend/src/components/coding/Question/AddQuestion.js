import React, { Fragment, Component } from "react";
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

import { SecurePost } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import Alert from '../../../components/common/alert';
import auth from '../../../services/AuthServices';
import Markdown from "../../../utils/Markdown";
import Toolbar from './Toolbar';

import { 
    ChangeCodingQuestionModalState,
} from "../../../actions/codingAction";

class AddQuestion extends Component {
    constructor(props){
        super(props);
        this.state = {
            submitDisabled: false,
            adding: false,
            description: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    // Handle Change
    handleChange(event) {
        this.setState({description: event.target.value});
    };

    // Submit Form
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log(values);
            if (!err) {
                SecurePost({
                    url:apis.CREATE_CODING_QUESTION,
                    data:{
                        title:values.title,
                        statement: values.statement,
                        category:values.category,
                        difficulty:values.difficulty,
                        timelimit:values.timelimit,
                        memorylimit: values.memorylimit
                    }
                })
                .then((response) => {
                    this.setState({
                        adding:false
                    });

                    if(response.data.success){
                        this.props.ChangeCodingQuestionModalState(false);
                        Alert('success','Success', response.data.message);
                        // this.props.ChangeQuestionTableData(this.props.trainer.selectedSubjects);
                    }
                    else{
                        this.props.ChangeCodingQuestionModalState(false);
                        this.props.form.resetFields();
                        return Alert('warning','Warning!',response.data.message);
                    }
                })
                .catch((error)=>{
                    // console.log(error);
                    this.props.form.resetFields();
                    
                    return Alert('error','Error!','Server Error');
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { Option } = Select;
        const { TextArea } = Input;
        
        return (
            <Fragment>
                <div>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="Problem Title" hasFeedback>
                                    {getFieldDecorator('title', {
                                            rules: [{ required: true, message: 'Please type problem title!' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item> 
                            </Col>  
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item label="Problem Statement" hasFeedback>
                                    {getFieldDecorator('statement', {
                                        rules: [{ required: true, message: 'Please type question!' }],
                                    })(
                                        <div>
                                            <Toolbar />
                                            <TextArea
                                                id="textarea_input"
                                                rows={5}
                                                onChange={this.handleChange} 
                                            />
                                        </div>
                                    )}
                                </Form.Item> 
                            </Col>  
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Markdown>{this.state.description}</Markdown>
                            </Col>  
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item label="Memory Limit" hasFeedback>
                                    {getFieldDecorator('memorylimit', {
                                        rules: [{ required: true, message: 'Please input memory limit!'}],
                                    })(
                                        <InputNumber min={1} style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item label="Time Limit" hasFeedback>
                                    {getFieldDecorator('timelimit', {
                                        rules: [{ required: true, message: 'Please input time limit!'}],
                                    })(
                                        <InputNumber min={1} style={{ width: '100%' }} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item label="Difficulty" hasFeedback>
                                    {getFieldDecorator('difficulty', {
                                        rules: [{ required: true, message: 'Please select difficulty' }],
                                    })(
                                        <Select
                                            style={{ width:'100%'}}
                                            placeholder="Select Difficulty"
                                        >
                                            <Option value='easy'>Easy</Option>
                                            <Option value='medium'>Medium</Option>
                                            <Option value='hard'>Hard</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item label="Category" hasFeedback>
                                    {getFieldDecorator('category', {
                                            rules: [{ required: true, message: 'Enter category' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item> 
                            </Col>  
                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        disabled={this.state.submitDisabled} 
                                        loading={this.state.adding} 
                                        block
                                    >
                                        Create Question
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </div>
            </Fragment>
        );
    }
};

const mapStateToProps = state => ({
    trainer: state.trainer,
    admin: state.admin,
    coding: state.coding 
});

const NewQuestionForm = Form.create({ name: 'newQuestion' })(AddQuestion);

export default connect(mapStateToProps, {
    ChangeCodingQuestionModalState
})(NewQuestionForm);
