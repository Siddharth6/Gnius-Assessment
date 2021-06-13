import React, { Component } from 'react';
import { Rate, Input, Button, Col, Row, Typography, Divider } from 'antd';
import { connect } from 'react-redux';

import { Post } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import Alert from '../../common/alert';
import { FeedbackStatus } from '../../../actions/traineeAction';
import './answer.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

class Feedback extends Component {
    constructor(props){
        super(props);
        this.state = {
            star: 0,
            comment: "excellent",
            loading: false
        }
    }

    handleStarChange=(star)=>{
        // console.log(star);
        this.setState({ star:star });
    } 
    onCommentChange=(comment)=>{
        this.setState({ comment:comment.target.value });
    }

    submitFeedback=()=>{
        this.setState({ loading: true });
        let { star, comment } = this.state;
        
        if(star!==0 && comment.length>0){
            Post({
                url: apis.GIVE_FEEDBACK,
                data: {
                    testid: this.props.trainee.testid,
                    userid: this.props.trainee.traineeid,
                    rating: star,
                    feedback: comment
                }
            })
            .then((response) => {
                if (response.data.success) {
                    this.setState({ loading: false })
                    Alert('success', 'Success', 'Thanks for your feedback');
                    this.props.FeedbackStatus(true)
                }
                else {
                    this.setState({ loading: false })
                    Alert('error', 'Failed', response.data.message);
                }
            }).catch((error) => {
                // console.log(error);
                Alert('error', 'Failed', 'Server Error');
                this.setState({ loading: false })
            });
        }
        else {
            // ...
        }
    }

    render() {
        const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
        return (
            <Row>
                <Col span={24}>
                    <div
                        style={{ width: '40%', margin: '25px', textAlign: 'left', padding: '10px' }}
                    >
                        <Title level={3}>Feedback Form</Title>
                        <div className="pp">
                            <span>
                                <Text>Please rate your experience</Text> <br />
                                <Rate tooltips={desc} onChange={this.handleStarChange} value={this.state.star} />
                                {this.state.star ? <span className="ant-rate-text">{desc[this.state.star - 1]}</span> : ''}
                            </span>
                        </div>
                        
                        <Divider />

                        <div className="pp">
                            <TextArea rows={2} onChange={this.onCommentChange} value={this.state.comment} />
                        </div>
                        
                        <Divider />

                        <div className="pp">
                            <Button type="primary" onClick={this.submitFeedback} loading={this.state.loading}>Submit</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}


const mapStateToProps = state => ({
    trainee : state.trainee
});

export default connect(mapStateToProps,{
    FeedbackStatus
})(Feedback);