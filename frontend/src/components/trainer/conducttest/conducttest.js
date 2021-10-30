import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input,Button, Typography,Tabs, Icon } from 'antd';
import './conducttes.css';

import { 
    changeConducttestId, 
    updateCandidatesTest, 
    updateQuestiosnTest 
} from '../../../actions/conductTest';
import { changeStep } from '../../../actions/testAction';

import TestDetails from './details';
import Candidates from './candidates';
import Questions from './questions';
import JobApplications from './JobApplications';

const { Title } = Typography;
const { TabPane } = Tabs;

class ConductTestS extends Component {
    constructor(props){
        super(props);
        this.props.changeConducttestId(this.props.testid);
        this.state={
            localTestId:null,
            needRedirect:false
        }
    }

    componentDidMount() {
        this.props.changeStep(0);
    };

    ChangeLocalTestId = (d) => {
        this.setState({
            localTestId: d.target.value
        })
    };

    ChangetestId = (d) => {
        this.setState({
            needRedirect: true
        })
    };

    render() {
        if(this.state.needRedirect){
            return window.location.href=`/user/conducttest?testid=${this.state.localTestId}`
        }
        else{
            return (
                <div className="conduct-test-main-wrapper">
                    {!this.props.conduct.id ? 
                        <div>
                            <Title 
                                style={{ width:'100%', textAlign:'center'}} 
                                level={4}
                            >
                                Enter Assessment Id
                            </Title>

                            <div className="test-conduct-testid-form">
                                <Input 
                                    placeholder="Enter Assessment Id" 
                                    onChange={this.ChangeLocalTestId} 
                                    value={this.state.localTestId}
                                />
                                <Button 
                                    onClick={this.ChangetestId}  
                                    type="primary" 
                                    style={{marginTop:'30px'}}
                                >
                                    Proceed
                                </Button>
                            </div>
                        </div>:
                        <div>
                            <CC key={this.props.conduct.basictestdetails.testconducted} />
                        </div>
                    }
                </div>
            )
        }
    }
};

// ...
class C extends Component {
    render() {
        return (
                <div>
                    <TestDetails/>

                    {/* Bottom Tabs */}
                    <Tabs defaultActiveKey="1" style={{marginTop:'20px'}}>
                        
                        <TabPane tab={<span><Icon type="user" />Registered Candidates</span>} key="1">
                            <Candidates />
                        </TabPane>

                        <TabPane tab={<span><Icon type="question-circle" />Questions</span>} key="2">
                            <Questions id={this.props.conduct.id} questionsOfTest={this.props.conduct.questionsOfTest} updateQuestiosnTest={this.props.updateQuestiosnTest}  />
                        </TabPane>

                        <TabPane tab={<span><Icon type="solution" />Job Applications</span>} key="3">
                            <JobApplications />
                        </TabPane>

                    </Tabs>
                </div>
        )
    }
};


const mapStateToProps = state => ({
    trainer : state.trainer,
    conduct : state.conduct
});


let CC=connect(mapStateToProps,{
    changeConducttestId,
    updateCandidatesTest,
    updateQuestiosnTest
})(C);

export default connect(mapStateToProps, {
    changeStep,
    changeConducttestId,
    updateCandidatesTest,
    updateQuestiosnTest
})(ConductTestS);