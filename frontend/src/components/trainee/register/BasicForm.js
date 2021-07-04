import React, { Fragment, Component } from 'react';
import {
    Row, 
    Col, 
    Form, 
    Icon, 
    Input, 
    Button, 
    Select,
    Steps,
    Typography, Layout, Upload, message 
} from 'antd';

import apis from '../../../services/Apis';
import { Post } from '../../../services/axiosCall';
import Alert from '../../common/alert';

const { Option } = Select;

class BasicForm extends Component { 
    // Resume Upload
    changeResume = (f) => {
        if (f.success === true) {
            message.success(`Resume file uploaded successfully`);
        }

        this.setState((ps, pp)=>{
            return({
                resume:(f.link ?`${apis.BASE}/${f.link}`:null)
            });
        });
    };

    // Handle Submission
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Post({
                    url: apis.REGISTER_TRAINEE_FOR_TEST,
                    data: {
                        name: values.name,
                        emailid: values.email,
                        contact: `${values.prefix}${values.contact}`,
                        organisation: values.organisation,
                        testid: this.state.testid,
                        location: values.location,
                        resume: this.state.resume
                    }
                })
                .then((data) => {
                    if (data.data.success) {
                        this.setState({
                            inform: false,
                            user: data.data.user
                        });
                    }
                    else {
                        this.props.form.resetFields();
                        Alert('error', 'Error!', data.data.message);
                    }
                }).catch((error) => {
                    // console.log(error);
                    this.props.form.resetFields();
                    Alert('error', 'Error!', "Server Error");
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const prefixSelector = getFieldDecorator('prefix', {
            initialValue :'+91',
            rules: [{ required: true, message: 'Please enter contact no prefix' }],
        })(
            <Select style={{ width: 70 }}>
              <Option value="+91">+91</Option>
            </Select>,
        );

        const uploadProps = {
            name: 'file',
            action: `${apis.BASE}${apis.UPLOAD_RESUME}`,
            listType: 'picture'
        };
        
        return (
            <Fragment>
                <div className="registration-form-container">
                    <div className="registration-form-inner">
                <Form 
                    onSubmit={this.handleSubmit}
                    autoComplete="off"
                    className="login-form"
                >
                    <Row>
                    <Col span={12} style={{ padding: '5px' }}>
                        <Form.Item label="Name" hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please input your name' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Name"
                                />,
                            )}
                        </Form.Item>     
                    </Col>
                    
                    <Col span={12} style={{ padding: '5px' }}>
                        <Form.Item label="Email" hasFeedback>
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    equired: true,
                                    message: 'Please input your E-mail!',
                                }],
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Email Id"
                                />,
                            )}                           
                        </Form.Item>
                    </Col>
                    
                    <Col span={24} style={{ padding: '5px' }}>
                        <Form.Item label="Phone Number" hasFeedback>
                            {getFieldDecorator('contact', {
                                rules: [{
                                    required: true,
                                    message: 'Please input your phone number!'
                                },
                                {
                                    len: 10,
                                    message: 'Contact number must be 10 digit long'
                                }],
                            })(<Input addonBefore={prefixSelector} min={10} max={10} />)}
                        </Form.Item>
                        
                        <Form.Item label="Organisation (University/Company Name)" hasFeedback>
                            {getFieldDecorator('organisation', {
                                rules: [{
                                    required: true,
                                    message: 'Please input your organisation name',
                                }],
                            })(
                                <Input
                                    prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}placeholder="Organisation"
                                />,
                            )}
                        </Form.Item>
                    </Col>
                    
                    <Col span={24} style={{ padding: '5px' }}>
                        <Form.Item label="Address" hasFeedback>
                        {getFieldDecorator('location', {
                            rules: [{ required: true, message: 'Please input your location' }],
                        })(
                            <Input
                                prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Address"
                            />,
                        )}
                        </Form.Item>
                    </Col>
                    
                    {/* Resume */}
                    <Col span={24}>
                        <Form.Item label="Upload Resume">
                        {getFieldDecorator('resume', {
                            rules: [{ required: true, message: 'Please upload your resume' }],
                        })(
                            <Upload 
                                {...uploadProps}
                                onRemove={this.changeResume}
                                onSuccess={this.changeResume}
                            >
                                <Button>
                                    <Icon type="upload" /> 
                                        Upload
                                    </Button>
                                </Upload>,
                            )}
                        </Form.Item>
                    </Col>
                    
                    <Col span={24} style={{ paddingTop: '33px' }}>
                        <Form.Item>
                            <Button 
                                style={{ width: '100%' }}
                                type="primary" 
                                htmlType="submit" 
                                className="btn"
                            >
                                Save & Next
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
                </Form>
                </div>
                </div>
            </Fragment>
        );
    };
};

const TraineeRegister = Form.create({ name: 'Trainee Registration' })(BasicForm);
export default TraineeRegister;
