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
            data:{
                image:null,
                body: null, 
            },
            adding:false,
            submitDisabled:false,
        }        
    }

    handleSubmit = e => {
        e.preventDefault();
    };

    changeqImage = (f)=>{
        this.setState((ps,pp)=>{
            return({
                data:{
                    ...ps.questionDetails,
                    questionimage:(f.link ?`${apis.BASE}/${f.link}`:null)
                },
                submitDisabled:false
            })
        })
    }

    upl=()=>{
        this.setState({
            submitDisabled:true
        })
    }

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
                    <Form  onSubmit={this.handleSubmit}>
                        <div>
                            <Row>
                                <Col span={24}>
                                    <Form.Item label="Write About Your Organisation" hasFeedback>
                                        {getFieldDecorator('about', {
                                            rules: [{ required: true, message: 'Please Enter Company Details or About!' }],
                                        })(
                                            <TextArea rows={5} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={24} style={{padding : '0px 20px'}}>
                                    <Form.Item label="Organisation Logo">
                                    {getFieldDecorator('resume', {
                                        rules: [{ required: true, message: 'Please upload your resume' }],
                                    })(
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
    admin : state.admin
});

const NewForm = Form.create({ name: 'newQuestion' })(Profile);

export default connect(mapStateToProps, null)(NewForm);