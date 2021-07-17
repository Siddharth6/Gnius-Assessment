import React, { Component, Fragment } from 'react'
import {
    Form,
    Input,
    Button,
    Select,
    Row,
    Col,
    Checkbox,
    Typography,
    Modal,
    Upload,
    Icon,
    InputNumber,
    Divider
} from 'antd';
import { connect } from 'react-redux';

import { SecurePost } from '../../services/axiosCall';
import apis from '../../services/Apis';
import Alert from '../common/alert';
import auth from '../../services/AuthServices';

const { Title, Text } = Typography;

class Profile extends Component {
    constructor(props){
        super(props);
        this.state={
            logo: this.props.user.userDetails.avatar,
            adding:false,
            submitDisabled:false,
        }        
    }

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                SecurePost({
                    url: `${apis.UPDATE_USER}`,
                    data: {
                        _id: this.props.user.userDetails._id,
                        organisation: values.organisation,
                        avatar: this.state.logo,
                        bio: values.about
                    }
                })
                .then((response) => {
                    if (response.data.success) {
                        Alert('success', 'Success', response.data.message);
                    }
                    else {
                        return Alert('warning', 'Warning!', response.data.message);
                    }
                })
                .catch((error) => {
                    return Alert('error', 'Error!', 'Server Error');
                });
            }
        });
    };

    // Upload Image Prop
    changeqImage = (f)=>{
        this.setState((ps,pp)=>{
            return({
                logo: (f.link ?`${f.link}`:null),
                submitDisabled:false
            });
        });
    };

    upl = () =>{
        this.setState({
            submitDisabled:true
        })
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
                <Text>Profile Settings</Text>
                <Divider />

                <img src={this.props.user.userDetails.avatar} alt="logo" />

                <Divider />
                    <Form  onSubmit={this.handleSubmit}>
                        <div>
                            <Row>
                                <Col span={24}>
                                    <Form.Item label="Organisation Name"  hasFeedback>
                                        {getFieldDecorator('organisation', {
                                            initialValue : this.props.user.userDetails.organisation,
                                            rules: [{ whitespace: true }],
                                        })(<Input />)}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24}>
                                    <Form.Item label="Write About Your Organisation" hasFeedback>
                                        {getFieldDecorator('about', {
                                            initialValue : this.props.user.userDetails.bio,
                                        })(
                                            <TextArea rows={5} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24} style={{padding : '0px 20px'}}>
                                    <Form.Item label="Organisation Logo">
                                    {getFieldDecorator('resume')(
                                        <Upload 
                                            {...QuestionImageprops} 
                                            beforeUpload={this.upl} 
                                            onRemove={this.changeqImage} 
                                            onSuccess={this.changeqImage}
                                        >
                                            <Button>
                                                <Icon type="upload" /> Upload
                                            </Button>
                                        </Upload>,
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
                                            Update
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    </Form>

                    <Divider />

            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    admin : state.admin,
    user: state.user
});

const NewForm = Form.create({ name: 'newQuestion' })(Profile);

export default connect(mapStateToProps, null)(NewForm);