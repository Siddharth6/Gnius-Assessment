import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { 
  Statistic, 
  Row, Col, 
  Button, Typography, 
  Divider, Spin,
  Card, Icon, List, Avatar
} from 'antd';

import { SecurePost } from '../../services/axiosCall';
import apis from '../../services/Apis';
import Alert from '../common/alert';
import Refer from './Refer';
import AddRefer from './AddRefer';

import './welcome.css';

const { Title, Text } = Typography;

const Welcome = (props) => {
  const [state, setstate] = useState({
    questat: [],
    loading: false,
  });

  const [teststat, setteststat] = useState([]);
  const [cantotal, setcantotal] = useState(0);
  const [graphlabel, setgraphlabel] = useState([]);
  const [graphdata, setgraphdata] = useState([]);

  // Get Question Stat
  const getQueStat = () => {
    setstate({
      loading: true,
    });

    SecurePost({
      url: `${apis.GET_QUESTION_STAT}`
    })
    .then((response) => {
        if (response.data.success) {
          setstate({
            questat: response.data.data,
            loading: false
          });
        }
        else {
          return Alert('warning', 'Warning!', response.data.message);
        }
    })
    .catch((error) => {
        return Alert('error', 'Error!', 'Server Error');
    });
  };

  const getTestStat = () => {
    SecurePost({
      url: `${apis.GET_TEST_STAT}`
    })
    .then((response) => {
        if (response.data.success) {
          setteststat(response.data.data);
          setcantotal(response.data.total);
        }
        else {
          return Alert('warning', 'Warning!', response.data.message);
        }
    })
    .catch((error) => {
      return Alert('error', 'Error!', 'Server Error');
    });
  };

  useEffect(async () => {
    await getQueStat();
    await getTestStat();
  }, []);


  return (
    <Fragment>
      
      <Title level={4}>
        Welcome {props.user.userDetails.name}
      </Title>

      <Divider />

      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <Card>
              <Statistic
                title="Total Assessments Created"
                value={teststat.length}
              />
            </Card>
          </div>

          <div className="col-md-4">
              <Card>
                <Statistic
                  title="Total Candidates Applied"
                  value={cantotal}
                />
              </Card>
          </div>

          <div className="col-md-4">
              <Card>
                <Statistic
                  title="Plan Expires in (days)"
                  value={30}
                />
              </Card>
          </div>
        </div>
      </div>

      <Divider />
      

      <div className="container">
        <div className="row">
          <div className="col-lg-12" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
            <Title level={4}>Number of Candidates by Assessment</Title>
            {state.loading ? <Spin />
              : 
              <List
                itemLayout="horizontal"
                dataSource={teststat}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={<div>Number of Candidates : <strong>{item.cnt}</strong></div>}
                    />
                  </List.Item>
                )}
              />
            }
          </div>
        </div>
      </div>

      <Divider />

      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <AddRefer />
          </div>
          <div className="col-lg-6">
            
          </div>
        </div>
      </div>

      <br />

      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Refer />
          </div>
        </div>
      </div>      

      <Divider />

      <Title level={4}>Question Bank Details</Title>

      <div className="container">
        <div className="row">
          <div className="col-lg-12" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
            <Title level={4}>Number of Questions by Category</Title>

            {state.loading ? <Spin />
              : 
              <List
              itemLayout="horizontal"
              dataSource={state.questat}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                    <Avatar src={item._id.pic} />}
                    title={item._id.topic}
                    description={<div>Number of Questions : <strong>{item.cnt}</strong></div>}
                  />
                </List.Item>
              )}
            />
          }

            
          </div>
        </div>
      </div>

      

    </Fragment>
  );
};

const mapStateToProps = state => ({
  user : state.user
});

export default connect(mapStateToProps, null)(Welcome);