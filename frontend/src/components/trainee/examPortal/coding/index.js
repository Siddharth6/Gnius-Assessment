import React, { Fragment } from 'react';
import { Tabs, Skeleton } from 'antd';
import queryString from 'query-string';
import { connect } from 'react-redux';

import CodeEditor from './CodeEditor';
import CodeMenu from '../codemenu';
import { SecurePost } from '../../../../services/axiosCall';
import apis from '../../../../services/Apis';
import Alert from '../../../../components/common/alert';
import {
    LoadCodingQuestion,
} from '../../../../actions/traineeAction';

const { TabPane } = Tabs;

class Index extends React.Component {
    constructor(props) {
      super(props);

      let params = {
        testid: this.props.trainee.testid,
        traineeid: this.props.trainee.traineeid
      }
      
      this.state = {
        mode: 'left',
        testDetails: params
      };
    }

    // On Page Load
    componentDidMount(){
        const testId = this.props.trainee.testid;
        const traineeId = this.props.trainee.traineeid;

        this.setState({loading: true})

        SecurePost({
            url:apis.GET_CODING_QUESTION_DATA,
            data:{
                testId: testId,
            }
        })
        .then((response) => {
            if(response.data.success){
                this.props.LoadCodingQuestion(false,response.data.questions);
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
      const { mode } = this.state;

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
                            
                            <CodeMenu />

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
    LoadCodingQuestion
})(Index);



