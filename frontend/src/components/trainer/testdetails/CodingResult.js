import React, { Fragment, useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { connect } from 'react-redux';
import moment from 'moment';
import { Input, Button, Typography, Tabs, Icon, Modal } from 'antd';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import { SecurePost } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import  Alert  from '../../common/alert';

const CodingResult = (props) => {
  const [state, setstate] = useState({});
  const [loading, setloading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    Prism.highlightAll();

    setloading(true);

    SecurePost({
      url: apis.CODING_SUBMISSION_GET,
      data: {
        testId: props.id
      }
    })
    .then((response) => {
      if(response.data.success){
        setstate({
          result: response.data.result,
          submission: response.data.submission
        });
        setloading(false);
      }
    })
    .catch((error)=>{
      console.log(error);
      return Alert('error','Error!','Server Error');
    });
  }, []);

  // Show Code
  const showcode = (data, lang) => {
    let language = '';

    if (lang === '48') {
      language = "c_cpp"
    }

    if (lang === '52') {
      language = "c_cpp"
    }

    else if (lang ==='62') {
      language = "java"
    }

    else if (lang === '70') {
      language = "python"
    }

    else if (lang ==='71') {
      language = "python"
    }

    return <AceEditor
        mode={language}
        theme="monokai"
        readOnly="true"
        name="editor"
        fontSize="14"
        editorProps={{ $blockScrolling: Infinity }}        
        value={data}
      />
  };

  return (
    <Fragment>
      <MaterialTable
        title="Coding Assessment Result"
        columns={[
          { title: 'Id', field: 'user._id' },
          { title: 'Name', field: 'user.name' },
          { title: 'Email', field: 'user.emailid' },
          { title: 'Question Id', field: 'question' },
          {
            title: 'Language',
            render: rowData => {
              let lang = rowData.lang;
              
              let language = "c_cpp";
    
              if (lang === '48') {
                language = "c_cpp"
              }
              else if (lang === '52') {
                language = "c_cpp"
              }
              else if (lang ==='62') {
                language = "java"
              }
              else if (lang === '70') {
                language = "python"
              }
              else if (lang ==='71') {
                language = "python"
              }
              return language
            }
          },
          { title: 'Score', field: 'score' },
          { 
            title: 'Time Taken (in mins.)',
            render: rowData => {
              var a = moment(rowData.startTime);
              var b = moment(rowData.submit_time);
              return b.diff(a, 'minutes')
            }
          },
          { 
            title: 'Start Time', 
            field: 'startTime',
            render: rowData => moment(rowData.startTime).format('MMMM Do YYYY, h:mm:ss a')
          },
          { 
            title: 'Submit Time', 
            field: 'submit_time',
            render: rowData => moment(rowData.submit_time).format('MMMM Do YYYY, h:mm:ss a')
          },
          { 
            title: 'Result', 
            field: 'result.str'
          },

          { title: 'Exceution Time', field: 'result.time' },
          { title: 'Memory Used', field: 'result.memory' },
        ]}

        data={state.result}

        detailPanel={[
          {
            tooltip: 'Show Code',
            render: rowData => {
              return (
                <div
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'black',
                    backgroundColor: '#fff',
                  }}
                >
                  {showcode(rowData.sourcecode, rowData.lang)}
                </div>
              )
            },
          }
        ]}
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
