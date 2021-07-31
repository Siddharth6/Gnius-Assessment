import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Steps, Typography, Button } from 'antd';
import { steps } from '../../../services/steps';
import { changeStep } from '../../../actions/testAction';

import { 
    ChangeSubjectTableData
} from '../../../actions/adminAction';

import BasicTestForm from './basicForm';
import AddJobPost from './AddJobPost';
import SelectQuestion from './selectQuestion';
import AddCodingQuestion from './AddCoding';
import FinalQuestionView from './questionview';

import './newtest.css';

const { Step } = Steps;
const { Title } = Typography;

class  NewTest extends Component {
    componentDidMount(){
        this.props.ChangeSubjectTableData();
    }

    prev() {
        const current = this.props.test.currentStep - 1;
        this.props.changeStep(current);
    };

    render(){
        var torender = "";

        if (this.props.test.currentStep === 1) {
            torender=<AddJobPost />;
        }
        else if (this.props.test.currentStep === 2) {
            torender=<SelectQuestion />;
        }
        else if (this.props.test.currentStep === 3) {
            torender = <AddCodingQuestion />;
        }
        else if (this.props.test.currentStep === 4) {
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
                    <br />
                    {this.props.test.currentStep > 0 && (
                        <div className="steps-action">
                            <Button onClick={() => this.prev()}>
                                Previous
                            </Button>
                        </div>
                    )}
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