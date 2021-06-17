import React, { Fragment } from 'react';
import { Tabs, Skeleton, Button, Popconfirm, Icon } from 'antd';
import CountDown from 'ant-design-pro/lib/CountDown';
import queryString from 'query-string';
import { connect } from 'react-redux';

import CodeEditor from './CodeEditor';
import { SecurePost } from '../../../../services/axiosCall';
import apis from '../../../../services/Apis';
import Alert from '../../../../components/common/alert';
import {
    LoadCodingQuestion,
    submitCoding
} from '../../../../actions/traineeAction';
import './code.css';

const { TabPane } = Tabs;
var time = 0;

class Index extends React.Component {
    constructor(props) {
      super(props);

      let params = {
        testid: this.props.trainee.testid,
        traineeid: this.props.trainee.traineeid
      }
      
      this.state = {
        mode: 'left',
        testDetails: params,
        testTime: 0,
      };
    }

    // On Page Load
    componentDidMount(){
        const testId = this.props.trainee.testid;
        const traineeId = this.props.trainee.traineeid;

        this.setState({loading: true});

        if(localStorage.getItem('time') === null){
            localStorage.setItem('time', new Date());
        }
        else {
            time = localStorage.getItem('time');
            
        }

        SecurePost({
            url:apis.GET_CODING_QUESTION_DATA,
            data:{
                testId: testId,
            }
        })
        .then((response) => {
            if(response.data.success){
                this.props.LoadCodingQuestion(false,response.data.questions);
                this.setState({testTime: response.data.time});
            }
            else{
                return Alert('warning','Warning!',response.data.message);
            }
        })
        .catch((error) => {
            return Alert('error','Error!','Server Error');
        });
    };

    handleModeChange = e => {
        const mode = e.target.value;
        this.setState({ mode });
    };
  
    render() {
      const { mode, testTime } = this.state;

      let targetTime = 0;

      time = localStorage.getItem('time');
      
      if (time === 0) targetTime = new Date().getTime() + testTime*60000;
      else targetTime = new Date(time).getTime()+ testTime*60000;

      return (
        <Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div style={{marginTop: '20px'}}></div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <Skeleton loading={this.props.trainee.loadcoding} active avatar>
                            
                        <div style={{height: '80px'}} >
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <ul id="menu">
                                            <li>
                                                <Icon style={{fontSize: '40px'}} type="code" />
                                            </li>

                                            <li>
                                                
                                            </li>
                                                
                                            <li>
                                                Timer :
                                            </li>

                                            <li>
                                                <CountDown 
                                                    style={{ fontSize: 30 }} 
                                                    target={targetTime}
                                                    onEnd={() => this.props.submitCoding(this.props.trainee.testid,this.props.trainee.traineeid)}
                                                />
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="col-lg-6">
                                        <Popconfirm
                                            title="Are you sure to end the test"
                                            onConfirm={() => {
                                                this.props.submitCoding(this.props.trainee.testid,this.props.trainee.traineeid);
                                                localStorage.removeItem('time');
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="primary">
                                                Submit Section
                                            </Button>
                                        </Popconfirm>
                                    </div>

                                </div>
                            </div>
                        </div>

                            <div style={{marginBottom: '50px'}} ></div>
                            
                            <Tabs defaultActiveKey="0" tabPosition={mode} style={{ height: '100%' }}>
                                {[...Array.from({ length: this.props.trainee.codingData.length }, (v, i) => i)].map(i => (
                                    <TabPane tab={`Problem-${i+1}`} key={i}>

                                        Problem {i+1}
                                        
                                        <br />

                                        <CodeEditor 
                                            key={i} 
                                            data={this.props.trainee.codingData[i]} 
                                            test={this.state.testDetails} 
                                        />
                                    </TabPane>
                                ))}
                            </Tabs>
                        </Skeleton>
                    </div>
                </div>
            </div>

        </Fragment>
      );
    }
};

const mapStateToProps = state => ({
    trainee: state.trainee
});

export default connect(mapStateToProps, {
    LoadCodingQuestion,
    submitCoding
})(Index);



