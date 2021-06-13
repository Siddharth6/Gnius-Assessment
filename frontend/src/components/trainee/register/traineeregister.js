import React, { Component } from 'react';
import {Row, Col, Form, Icon, Input, Button, Select,Typography, Layout, Spin } from 'antd';
import queryString from 'query-string';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import { Helmet } from "react-helmet";
import {
    Chip,
    Paper
} from "@material-ui/core";

import {
    FacebookShareButton,
    TelegramShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    TelegramIcon,
    WhatsappIcon,
    FacebookShareCount,
    WhatsappShareButton,
    LinkedinShareButton
} from "react-share";

import renderHTML from 'react-render-html';
import { FormBuilder, FormRenderer } from 'react-ant-form-builder';

import apis from '../../../services/Apis';
import { Post } from '../../../services/axiosCall';
import Alert from '../../common/alert';

import '../../../Layout.css';
import './trainerRegister.css';
import logo from '../../basic/header/logo.png';

import { Fragment } from 'react';

const { Option } = Select;
const { Title } = Typography;
const { Header, Footer, Sider, Content } = Layout;

class TraineeRegisterForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            inform:true,
            testid:null,
            user:null,
            jobstatus: false,
            jobData: {}
        };
    };
    
    getJobDetails = () => {
        let params = queryString.parse(this.props.location.search);

        Post({
            url : apis.GET_JOB_DETAILS,
            data: {
                testid: params.testid
            }
        })
        .then((data) => {
            if (data.data.success) {
                this.setState({
                    jobstatus: true,
                    jobData: data.data.job
                });
            }
            else{
                this.setState({
                    jobstatus: false
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    };

    componentDidMount(){
        let params = queryString.parse(this.props.location.search)
        // console.log(params);
        this.setState({
            testid:params.testid
        });

        this.getJobDetails();

        console.log(this.state.jobData);
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                // console.log(this.state.testid);

                Post({
                    url: apis.REGISTER_TRAINEE_FOR_TEST,
                    data: {
                        name: values.name,
                        emailid: values.email,
                        contact: `${values.prefix}${values.contact}`,
                        organisation: values.organisation,
                        testid: this.state.testid,
                        location: values.location
                    }
                }).then((data) => {
                    // console.log(data.data);

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

    resendMail = () => {
        Post({
            url: apis.RESEND_TRAINER_REGISTRATION_LINK,
            data: {
                id: this.state.user._id
            }
        })
        .then((response) => {
            if (response.data.success) {
                Alert('success', 'Success!', "Email has been sent to your email");
            }
            else {
                Alert('error', 'Error!', response.data.message);
            }
        })
        .catch((error) => {
            // console.log(error);
            Alert('error', 'Error!', "Server Error");
        });
    };


    renderJob = () => (
        <Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{this.state.jobData.jobtitle} - gnius Assessment - where talent meets opportunities</title>
            </Helmet>

            <div className="container-fluid" style={{padding: '0', overflow: 'hidden'}}>
                <div className="row">
                    <div className="col-lg-12">
                        <Layout>
                            <Header style={{ height: '100px' }}>
                                <Title style={{ color: '#fff', marginTop: '20px' }} level={4}>
                                    {this.state.jobData.jobtitle}
                                </Title>
                            </Header>
                        </Layout>
                    </div>
                </div>
            </div>

            <div className="container-fluid" style={{padding: '0', overflow: 'hidden'}}>
                <div className="row">
                    <div className="col-lg-12">
                        <div style={{ marginTop: '10px'}}></div>
                    </div>
                </div>
            </div>
            
          <div className="container">
            <div className="row">
              {/* Left */}
              <div className="col-lg-6">
                <div
                    style={{
                      margin: '5px',
                      textAlign: 'justify',
                      padding: '5px',
                      justifyContent: 'center',
                      alignItems: 'start'
                    }}
                >
                    {renderHTML(this.state.jobData.jobdescription)}
                </div>
                  
              </div>


              {/* Right */}
              <div className="col-lg-6">
                  <div
                    style={{
                      margin: '5px',
                      justifyContent: 'center',
                      alignItems: 'start',
                      outline: 'none'
                    }}
                  >
                    <ul style={{ listStyle: 'none' }}>
                        <li style={{ padding: '5px' }}>
                            <b>Posted on:</b> {moment(this.state.jobData.dateOfPosting).format('MMMM Do YYYY')} / {moment(this.state.jobData.dateOfPosting, "YYYYMMDD").fromNow()} 
                        </li>

                        <li style={{ padding: '5px' }}>
                            <Icon type="environment" /> {this.state.jobData.joblocation}
                        </li>

                        <li style={{ padding: '5px' }}>
                            <Button href="#apply" type="primary" shape="round" size='large'>
                                Apply
                            </Button>
                        </li>


                    </ul>

                  </div>
              </div>
            </div>
          </div>

        </Fragment>
    );


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
        
        const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

        return (
            <Fragment>
                <div className="header-container">
                    <img src={logo} alt="company logo" className="logo" />
                </div>

                {
                    this.state.jobstatus ? this.renderJob() : null
                }

                <div id="apply"></div>

                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <Title level={2} style={{ textAlign: 'center'}}>Application</Title>
                        </div>
                    </div>
                </div>

                {/* <Spin indicator={antIcon} /> */}

                <div className="registration-form-container">    
                {this.state.inform ?
                    <div className="registration-form-inner">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
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
                                                            required: true,
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
                                                            prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Organisation"
                                                        />,
                                                    )}
                                                </Form.Item>
                                            </Col>

                                            <Col span={24} style={{ padding: '5px' }}>
                                                <Form.Item label="Address" hasFeedback>
                                                    {getFieldDecorator('location', {
                                                        rules: [{ required: true, message: 'Please input your name' }],
                                                    })(
                                                        <Input
                                                            prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                            placeholder="Address"
                                                        />,
                                                    )}
                                                </Form.Item>
                                            </Col>
                                
                                            <Col span={24} style={{ paddingTop: '33px' }}>
                                                <Form.Item>
                                                    <Button style={{ width: '100%' }} type="primary" htmlType="submit" className="btn">
                                                        Register
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </div>
                        </div>
                        
                    </div> :
                    <div className="reasendmail-container-register">
                        <Title style={{ color: '#fff' }} level={4}>
                            Thank You, You have successfully registered !!!
                            An email containing your assessment link will be sent to {this.state.user.emailid}, one day before the assessment date.

                            All the Best !!!
                        </Title>
                    </div>
                }
            </div>

            <div 
                className="container-fluid" 
                style={{padding: '0', overflow: 'hidden', marginTop: '50px',}}
            >
                <div className="row">
                    <div className="col-lg-12">
                        <Layout>
                            <Footer style={{ textAlign: 'center'}}>
                                Footer
                            </Footer>
                        </Layout>     
                    </div>
                </div>
            </div>
            </Fragment>
        );
    };
};

const TraineeRegister = Form.create({ name: 'Trainee Registration' })(TraineeRegisterForm);
export default TraineeRegister;