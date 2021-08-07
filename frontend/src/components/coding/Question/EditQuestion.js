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
    ChangeCodingQuestionData
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
            if (!err) {
                SecurePost({
                    url:apis.EDIT_CODING_QUESTION,
                    data:{
                        _id: this.props.details._id,
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
                        this.props.ChangeCodingQuestionData();
                    }
                    else{
                        this.props.ChangeCodingQuestionModalState(false);
                        this.props.form.resetFields();
                        return Alert('warning','Warning!',response.data.message);
                    }
                })
                .catch((error) => {
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
                                        initialValue: this.props.details.title,
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
                                        initialValue: this.props.details.statement,
                                        rules: [{ required: true, message: 'Please type question!' }],
                                    })(
                                        <TextArea
                                            id="textarea_input"
                                            rows={5}
                                            onChange={this.handleChange} 
                                        />
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
                                        initialValue: this.props.details.memorylimit,
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
                                        initialValue: this.props.details.timelimit,
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
                                        initialValue: this.props.details.difficulty,
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
                                        initialValue: this.props.details.category,
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
                                        Submit
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
    ChangeCodingQuestionModalState,
    ChangeCodingQuestionData
})(NewQuestionForm);