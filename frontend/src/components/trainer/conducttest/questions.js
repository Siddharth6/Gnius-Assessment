import React, { Component } from 'react'
import apis from '../../../services/Apis';
import { SecurePost } from '../../../services/axiosCall';
import Alert from '../../common/alert';
import { Button, Row, Col, Typography } from 'antd';
import Markdown from '../../../utils/Markdown';
import './conducttes.css';

const { Title } = Typography;

export default class Questions extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            total: 0
        }
    }

    componentDidMount(){
        this.refreshquestionList();
    }   

    refreshquestionList = ()=>{
        this.setState({
            loading: true
        });
        
        SecurePost({
            url: `${apis.GET_TEST_QUESTIONS}`,
            data: {
                id: this.props.id
            }
        }).then((response) => {
            // console.log(response);
            if (response.data.success) {
                this.props.updateQuestiosnTest(response.data.data);
            }
            else {
                Alert('error', 'Error!', response.data.message)
            }
            this.setState({
                loading: false
            })
        }).catch((error) => {
            // console.log(error);
            Alert('error', 'Error!', 'Server Error')
            this.setState({
                loading: false
            });
        });
    }

    render() {
        const aMap = ['A', 'B', 'C', 'D', 'E'];
        var sum = 0;

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <h6 style={{fontSize: '14px'}}>
                            Total Marks: {'  '}
                            {
                                this.props.questionsOfTest.reduce((accumulator, current) => accumulator + current.weightage, 0)
                            }
                        </h6>
                    </Col>
                </Row>
                
                {
                    this.props.questionsOfTest.map((d, i) => {
                        
                        return(
                            <div key={i} style={{ paddingBottom: '50px' }}>
                                
                                <Row>
                                    <Col span={1}>
                                        <Button type="primary" shape="circle" >{i+1}</Button>
                                    </Col>
                                    <Col span={d.quesimg?6:0}>
                                        <img alt="unable to load" src={d.quesimg} style={{width:'100%'}}/>
                                    </Col>
                                    <Col span={d.quesimg?16:22} style={{padding:'10px'}}>
                                        <Markdown>{d.body}</Markdown>
                                    </Col>
                                    <Col span={1}>
                                        Marks:{d.weightage}
                                    </Col>
                                    <Col offset={1} span={23}>
                                        <Row>
                                            {d.options.map((dd,ii)=>{
                                                return(
                                                    <Col key={ii} span={12} style={{paddingBottom:'30px'}}>
                                                        <Row>
                                                            <Col span={1}>
                                                            {
                                                                dd.isAnswer?<Button className="green" shape="circle">{aMap[ii]}</Button>:<Button type="primary" shape="circle">{aMap[ii]}</Button>
                                                            }
                                                            </Col>
                                                            <Col offset={1} span={dd.optimg?8:0}>
                                                                <img alt="unable to load" src={dd.optimg} style={{width:'100%'}} />
                                                            </Col>
                                                            <Col offset={1} span={dd.optimg?12:21}>
                                                                <p>{dd.optbody}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </Col>
                                </Row>

                            </div> 
                        )
                    })
                }
                

            </div>
        )
    }
}



