import React, { Component, Fragment } from 'react';
import { 
    Button, 
    Skeleton, 
    Modal, 
    Form, 
    InputNumber, 
    Transfer, 
    Row, 
    Col,
    Input,
    Checkbox,
    Typography, 
} from 'antd';
import { connect } from 'react-redux';

import { 
    changeStep,
    pushCodingQuestionToQueue,
    removeCodingQuestionFromMainQueue,
    checkcode,
    codingDuration
} from '../../../actions/testAction';

import {
    ChangeCodingQuestionData
} from '../../../actions/codingAction';

import Markdown from '../../../utils/Markdown';

const { Title } = Typography;

class AddCoding extends Component {
    constructor(props){
        super(props);
        this.state = {
            checked: false,
            generating:false,
            autogenerate:true,
            ActiveQuestionId:null,
            Mvisible:false
        }
    };

    componentDidMount(){
        this.props.ChangeCodingQuestionData();
    };

    handleSubmit = e => {
        e.preventDefault();
    };

    // Checked Handler
    onCheck = (e) => {
        this.props.checkcode(e.target.checked);
        this.setState({ checked: e.target.checked });
    };

    // Push Questions
    handleChange = (targetKeys, direction, moveKeys) => {
        this.props.pushCodingQuestionToQueue(targetKeys);
    };

    // ...
    renderItem = item => {
        const customLabel = (
          <span className="custom-item">
                <Button 
                    shape="circle" 
                    onClick={()=>{this.OpenModel(item._id)}}
                    style={{background:'linear-gradient(to right,rgb(80,190,189),rgb(0,153,153),rgb(0,153,203))',color:'greenblue'}}
                    icon="info"
                    size="small" 
                ></Button>
                {item.title}
          </span>
        )

        return {
            label: customLabel, 
            value: item._id, 
        }
    };

    OpenModel = (qid) => {
        this.setState({
            ActiveQuestionId:qid,
            Mvisible:true
        });
    };

    handleCancel=()=>{
        this.setState({
            Mvisible:false
        })
    };

    // Handle Submit
    handleFinal = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);

                this.props.codingDuration(values.duration);
                
                this.props.changeStep(4);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Fragment>
                <div style={{ padding: '0px auto 5px auto', width: '100%', textAlign: 'center' }}>
                    <Title level={3}>Add Programming Questions</Title>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <Checkbox onChange={this.onCheck}>
                                Do you want to add Programming Questions with this assessment ?
                            </Checkbox>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                        {this.state.checked ?  
                            <div>
                                <Transfer
                                    rowKey={record => record._id}
                                    dataSource={this.props.coding.QuestionTableData}
                                    listStyle={{
                                        width: '45%',
                                        height: 500,
                                    }}
                                    targetKeys={this.props.test.codingtData.testQuestions}
                                    render={this.renderItem}
                                    onChange={this.handleChange}  
                                />

                                <Form
                                    onSubmit={this.handleFinal}
                                    autoComplete="off"
                                >
                                    <Form.Item label="Coding Assessment Duration (min. 10 mins)"  hasFeedback>
                                        {getFieldDecorator('duration', {
                                            initialValue : this.props.test.codingtData.testDuration,
                                            rules: [{ required: true, message: 'Please enter assessment duration' }],
                                        })(
                                            <InputNumber min={10} style={{width:'100%'}} placeholder="Assessment Duration" />
                                        )}
                                    </Form.Item>

                                    <Form.Item>
                                        <div style={{ width: '100%', padding: '10px' }}>
                                            <Button 
                                                style={{ float: 'right' }} 
                                                type="primary" 
                                                htmlType="submit" 
                                                block
                                            >
                                                Next
                                            </Button>      
                                        </div>
                                    </Form.Item>
                                </Form>
                            </div> :

                            <div>
                            {'      '}
                            <br />

                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <Button 
                                            onClick={() => this.props.changeStep(4)} 
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

                <Modal
                    destroyOnClose={true}
                    width="70%"
                    style={{top:'30px'}}
                    title="Question details"
                    visible={this.state.Mvisible}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    
                </Modal>

            </Fragment>
        );
    }
};

const CodingForm = Form.create({ name: 'Basic Form' })(AddCoding);

const mapStateToProps = state => ({
    test: state.test,
    coding: state.coding
});

export default connect(mapStateToProps, {
    changeStep,
    checkcode,
    ChangeCodingQuestionData,
    pushCodingQuestionToQueue,
    removeCodingQuestionFromMainQueue,
    codingDuration
})(CodingForm);