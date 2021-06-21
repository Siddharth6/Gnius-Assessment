import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Statistic, Row, Col, Button, Typography, Divider, Card, Icon } from 'antd';
import { Line } from 'react-chartjs-2';

import './welcome.css';

const { Title, Text } = Typography;

const data = {
  labels: ['1', '2', '3', '4', '5', '6'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const welcome = (props) => {  
  return (
    <Fragment>
      
      <Title level={4}>
        Welcome {props.user.userDetails.name}
      </Title>

      <Divider />

      <Row gutter={16}>

        <Col className="gutter-row" span={6}>
          <Card>
            <Statistic
              title="Total Assessments Taken"
              value={112893}
            />
          </Card>
        </Col>

        <Col className="gutter-row" span={6}>
          <Card>
              <Statistic
                title="Account Balance (CNY)"
                value={112893}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
        </Col>

        <Col className="gutter-row" span={6}>
            <Card>
              <Statistic
                title="No. of assessments left"
                value={9.3}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={<Icon type="arrow-down" />}
                suffix="%"
              />
            </Card>
        </Col>

        <Col className="gutter-row" span={6}>
            <Card>
              <Statistic
                title="Active"
                value={11.28}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<Icon type="arrow-up" />}
                suffix="%"
              />
            </Card>
        </Col>
      </Row>

      <Divider />

      <Line data={data} options={options} />

    </Fragment>
  );
};

const mapStateToProps = state => ({
  user : state.user
});

export default connect(mapStateToProps, null)(welcome);