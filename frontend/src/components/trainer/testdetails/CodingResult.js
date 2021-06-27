import React, { Fragment, useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { connect } from 'react-redux';
import { Input, Button, Typography, Tabs, Icon } from 'antd';

import { SecurePost } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import  Alert  from '../../common/alert';

const CodingResult = (props) => {
  const [state, setstate] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);

    SecurePost({
      url: apis.CODING_SUBMISSION_GET,
      data: {
        testId: props.id
      }
    })
    .then((response) => {
      if(response.data.success){
        setstate(response.data.result);
        setloading(false);
      }
    })
    .catch((error)=>{
      console.log(error);
      return Alert('error','Error!','Server Error');
    });
  }, []);


  return (
    <Fragment>
      <MaterialTable
        title="Coding Assessment Result"
        columns={[
          { title: 'Id', field: 'user._id' },
          { title: 'Name', field: 'user.name' },
          { title: 'Email', field: 'user.emailid' },
          { title: 'Question Id', field: 'question' },
          { title: 'Score', field: 'score' },
          { 
            title: 'Result', 
            field: 'result.str'
          },
          { title: 'Time', field: 'result.time' },
          { title: 'Memory', field: 'result.memory' },
        ]}

        data={state}

        options={{
          filtering: true,
          exportButton: true,
          headerStyle: {
            backgroundColor: '#01579b',
            color: '#FFF'
          }
        }}
      />
    </Fragment>
  );
};

export default CodingResult;
