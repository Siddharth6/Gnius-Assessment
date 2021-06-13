import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Steps, Typography } from 'antd';
import { steps } from '../../../services/steps';
import { changeStep } from '../../../actions/testAction';

import { 
    ChangeSubjectTableData
} from '../../../actions/adminAction';

import BasicTestForm from './basicForm';
import AddJobPost from './AddJobPost';
import SelectQuestion from './selectQuestion';
import FinalQuestionView from './questionview';

import './newtest.css';

const { Step } = Steps;
const { Title } = Typography;

class  NewTest extends Component {
    componentDidMount(){
        this.props.ChangeSubjectTableData();
    }
    render(){
        var torender = "";

        if (this.props.test.currentStep === 1) {
            torender=<AddJobPost />;
        }
        else if (this.props.test.currentStep === 2) {
            torender=<SelectQuestion />;
        }
        else if (this.props.test.currentStep === 3) {
            torender=<FinalQuestionView />;
        }
        else{
            torender=<BasicTestForm />;
        }

        return (
            <div>
                <div style={{padding:'0px auto 5px auto',width:'100%',textAlign:'center'}}>
                    <Title level={3}>Create New Assessment</Title>
                </div>
                <Steps className="newtest-steps-holder" current={this.props.test.currentStep}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="new-test-form-holder">
                    {torender}
                </div>
            </div>
        )
    }  
}

const mapStateToProps = state => ({
    test : state.test
});

export default connect(mapStateToProps,{
    changeStep,
    ChangeSubjectTableData
})(NewTest);