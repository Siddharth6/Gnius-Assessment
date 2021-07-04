import React, { Fragment, useState, useEffect } from 'react';
import { Table, Input, Button, Icon, Typography, Popconfirm, Divider, Modal, Select, Row, Col } from 'antd';
import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';

import NewQuestion from './AddQuestion';
import QuestionDetails from './QuestionDetails';

import { 
    ChangeCodingQuestionModalState,
    ChangeCodingQuestionData,
} from "../../../actions/codingAction";

const AllQuestions = (props) => {

    const [state, setstate] = useState({
        questiondetailsId : null,
        questiondetailsModelVisible:false
    });

    // Action Modal
    const OpendetailsModal = (id) => {
        setstate((previousState,previousProps)=>{
          return{
            questiondetailsId:id,
            questiondetailsModelVisible:true
          }
        });
    };

    const ClosedetailsModal = () => {
        setstate((previousState,previousProps)=>{
          return{
            questiondetailsId:null,
            questiondetailsModelVisible:false
          }
        });
    };

    useEffect(() => {
        props.ChangeCodingQuestionData();
    }, []);

    const showModal = (mode) => {
        props.ChangeCodingQuestionModalState(true);
    };

    const handleOk = e => {
        props.ChangeCodingQuestionModalState(false);
    };

    const handleCancel = e => {
        props.ChangeCodingQuestionModalState(false);
    };


    const columns = [
        {
            title: 'Problem Title',
            dataIndex: 'title',
            key: 'title',
            width: '15%',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: '15%',
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
            width: '15%',
        },
        {
            title: 'Action',
            key: '_id',
            dataIndex: '_id',
            width: '15%',
            render: (key) => (
                <Button 
                    type="primary" 
                    shape="circle" 
                    onClick={()=>OpendetailsModal(key)} 
                    icon="info-circle" 
                />
            ),
        },
    ];

    return (
        <Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <Button 
                            type="primary" 
                            icon="code" 
                            style={{marginBottom:'10px'}} 
                            onClick={showModal}
                        >
                            Add New Coding Question
                        </Button>
                    </div>

                    <div className="col-lg-6"></div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <Table 
                            bordered={true} 
                            columns={columns} 
                            dataSource={props.coding.QuestionTableData} 
                            size="medium" 
                            pagination={{ pageSize: 5 }}
                            loading={props.coding.QuestionTableLoading}
                            rowKey="_id" 
                        />
                    </div>
                </div>
            </div>

            {/* New Question Form */}
            <Modal
                title="New Coding Question"
                style={{top :'20px',padding:'0px',backgroundColor:'rgb(155,175,190)'}}
                width="70%"
                visible={props.coding.NewQuestionModalState}
                onOk={() => handleOk}
                onCancel={handleCancel}
                footer={[]}
                destroyOnClose={true}
            >
                <NewQuestion />
            </Modal>

            {/* Question Details */}
            <Modal
                visible={state.questiondetailsModelVisible}
                title="Question Details"
                onCancel={ClosedetailsModal}
                style={{top :'20px',padding:'0px',backgroundColor:'rgb(155,175,190)'}}
                width="70%"
                destroyOnClose={true}
                footer={[]}
            >
                <QuestionDetails id={state.questiondetailsId} / >
            </Modal>

        </Fragment>
    );
};

const mapStateToProps = state => ({
    trainer: state.trainer,
    admin: state.admin,
    coding: state.coding 
});

export default connect(mapStateToProps,{
    ChangeCodingQuestionModalState,
    ChangeCodingQuestionData
})(AllQuestions);