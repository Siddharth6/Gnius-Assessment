import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { 
    Form, 
    InputNumber, 
    Input, 
    Button, 
    Select, 
    DatePicker, 
    Row, Col, 
    Typography, 
    Checkbox, 
    Modal,
    Collapse,
    Divider
} from 'antd';
import moment from 'moment';
import ReactQuill from 'react-quill';
import { FormBuilder, FormRenderer } from 'react-ant-form-builder';
import { 
    changeStep,
    addJobData 
} from '../../../actions/testAction';

import './newtest.css';
import 'react-quill/dist/quill.snow.css';
import { QuillModules, QuillFormats } from '../../../utils/Editor';


const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

class AddJobPost extends Component {
    constructor(props){
        super(props);
        this.state = {
            checked: false,
            editor: null,
            formSchema: {},
            data: {},
            visible: false
        }
    };

    onCheck = (e) => {
        this.setState({ checked: e.target.checked });
    };

    onChangeEditor = (value) => {
        console.log(value);
        this.setState({ editor: value });
    };

    // Handle Submit
    handleFinal = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                this.props.addJobData(this.state.checked,{
                    title: values.jobtitle,
                    description: this.state.editor,
                    skillsets: [],
                    location: values.joblocation,
                    type: values.jobtype,
                    customdata: this.state.formSchema
                });
                
                this.props.changeStep(2);
            }
        });
    };

    // Modal
    showModal = () => {
        this.setState({ visible: true });
    };
    
    handleOk = e => {
        this.setState({ visible: false });
    };

    handleCancel = e => {
        this.setState({ visible: false });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Fragment>
                <div style={{ padding: '0px auto 5px auto', width: '100%', textAlign: 'center' }}>
                    <Title level={3}>Add Job Post</Title>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <Checkbox onChange={this.onCheck}>
                                Do you want to add a job post with this assessment ?
                            </Checkbox>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                        {this.state.checked ?  
                            <div>
                                <Title style={{textAlign: 'center'}} level={3}>Add Job Post Details</Title>
                                <Form
                                    onSubmit={this.handleFinal}
                                    autoComplete="off"
                                >
                                    <Form.Item label="Job Title"  hasFeedback>
                                        {getFieldDecorator('jobtitle', {
                                            initialValue : this.props.test.jobPostData.title,
                                            rules: [{ required: true, message: 'Please select a Job title' }],
                                        })(
                                            <Input placeholder="Job Title" />
                                        )}
                                    </Form.Item>
                                    
                                    {/* Description Form Editor */}
                                    <Form.Item label="Job Description"  hasFeedback>
                                        <ReactQuill
                                            modules={QuillModules}
                                            formats={QuillFormats}
                                            value={this.state.editor}
                                            placeholder="Write job description ..."
                                            onChange={this.onChangeEditor}
                                        />
                                    </Form.Item>

                                    <Form.Item label="Job Type"  hasFeedback>
                                        {getFieldDecorator('jobtype', {
                                            initialValue : this.props.test.jobPostData.jobtype,
                                            rules: [{ required: true, message: 'Please select a Job type' }],
                                        })(
                                            <Select placeholder="Job Type">
                                                <Option value="Full Time">Full Time</Option>
                                                <Option value="Part Time">Part Time</Option>
                                                <Option value="Internship">Internship</Option>
                                                <Option value="Work From Home">Work From Home</Option>
                                            </Select>
                                        )}
                                    </Form.Item>

                                    <Form.Item label="Job Location"  hasFeedback>
                                        {getFieldDecorator('joblocation', {
                                            initialValue : this.props.test.jobPostData.location,
                                            rules: [{ required: true, message: 'Please select a Job Location' }],
                                        })(
                                            <Input placeholder="Job Location" />
                                        )}
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block>
                                            Next
                                        </Button>
                                    </Form.Item>
                                </Form>

                                <Collapse defaultActiveKey={['1']}>
                                    <Panel header="Add Custom Questions" key="1">
                                        <FormBuilder
                                            formStructure={this.state.formSchema}
                                            onSave={schema => {
                                                this.setState({ formSchema: schema });
                                                // props.setCustomJobDetails(schema);
                                                console.log(schema);
                                            }}
                                            onError={error => console.log(error)}    
                                        />
                                        
                                        <Divider />
                                        
                                        {'      '}
                                        <p>* Save the form to see the changes everytime</p>
                                        
                                        <Button type="primary" onClick={this.showModal}>
                                            Preview
                                        </Button>
                                    </Panel>
                                </Collapse>

                                {/* Custom Form Modal */}
                                <Modal
                                    title="Preview"
                                    visible={this.state.visible}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                >
                                    <h1>Preview</h1>
                                    <FormRenderer
                                        allowDraft={false}
                                        formStructure={this.state.formSchema}
                                        data={this.state.data}
                                        onSave={changedData => {
                                            // onSave for data received here.
                                            this.setState({ data: changedData });
                                        }}
                                        onError={error => console.log(error)}
                                    />
                                </Modal>

                            </div> : 
                            <div>
                                <br />
                                <br />
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <Button 
                                                onClick={()=>this.props.changeStep(2)} 
                                                type="primary" 
                                                htmlType="submit" block
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
};

const JobForm = Form.create({ name: 'Basic Form' })(AddJobPost);

const mapStateToProps = state => ({
    test : state.test
});

export default connect(mapStateToProps, {
    changeStep,
    addJobData
})(JobForm);
