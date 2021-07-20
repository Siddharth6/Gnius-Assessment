import React, { Component } from 'react'
import { changeConducttestId, updateCandidatesTest } from '../../../actions/conductTest';
import { connect } from 'react-redux';
import apis from '../../../services/Apis';
import { SecurePost } from '../../../services/axiosCall';
import Alert from '../../common/alert';
import { Table, Input, Button, Icon, message, Typography, Modal, Progress } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Highlighter from 'react-highlight-words';
import CSVReader from "react-csv-reader";
import './conducttes.css';

const { Title } = Typography;

// csv papaparse
const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};

class Candidates extends Component {

    constructor(props){
        super(props);
        this.state={
            loading:false,
            searchText: '',
            mainlink: '',
            visible: false,
            progress: 0,
        }
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ),
    });


    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };
    
    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    componentDidMount(){
      var link = window.location.href.split('/').splice(0,3);
      var mainlink="";
      link.forEach((d,i)=>{
          mainlink=mainlink+d+"/"
      });
      this.setState({mainlink});
      this.refreshUserList(); 
  }
  
  // Modal
  showModal = () => {
      this.setState({
        visible: true,
      });
  };

  handleOk = e => {
      // console.log(e);
      this.setState({
        visible: false,
      });
  };

  handleCancel = e => {
      // console.log(e);
      this.setState({
        visible: false,
      });
  };

  // csv parser
  handleForce = (data, fileInfo) => {

    // console.log(data);
    
  SecurePost({
      url: `${apis.IMPORT_CANDIDATES}`,
      data: {
        testid: this.props.conduct.id,
        data: data,
      }
    })
    .then((response) => {
      if (response.data.success) {
          this.setState({progress: 100});
          this.props.updateCandidatesTest(response.data.data);
      }
      else {
          Alert('error', 'Error!', response.data.message)
      }
        this.setState({
          loading: false
        });
    })
    .catch((error) => {
      Alert('error', 'Error!', 'Server Error')
        this.setState({loading: false});
  });
};


  refreshUserList = () => {
    this.setState({
      loading: true
    });
        
    SecurePost({
      url: `${apis.GET_TEST_CANDIDATES}`,
      data: {
        id: this.props.conduct.id
      }
    })
      .then((response) => {
        //console.log(response);
        if (response.data.success) {
          this.props.updateCandidatesTest(response.data.data);
        }
        else {
          Alert('error', 'Error!', response.data.message)
        }
        this.setState({
          loading: false
        });
      }).catch((error) => {
        //console.log(error);
        Alert('error', 'Error!', 'Server Error')
        this.setState({
          loading: false
        });
      });
  };

  getResume = (file) => {
    window.open(file);
  };

    render() {
        const columns = [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              ...this.getColumnSearchProps('name'),
            },
            {
              title: 'Email Id',
              dataIndex: 'emailid',
              key: 'emailid',
              ...this.getColumnSearchProps('emailid'),
            },
            {
                title: 'Contact No',
                dataIndex: 'contact',
                key: 'contact',
                ...this.getColumnSearchProps('contact'),
            },
            {
              title: 'Resume',
              dataIndex: 'resume',
              key: 'resume',
              render: id => (
                <Button
                  color="primary"
                  onClick={() => this.getResume(id)}
                >
                  Download Resume
                </Button>
              ),
            },
            {
                title: 'Links',
                key: '_id',
                dataIndex: '_id',
                render: id => (
                  <Input disabled={true} value={`${this.state.mainlink}candidate/taketest?testid=${this.props.conduct.id}&traineeid=${id}`} addonAfter={<CopyToClipboard text={`${this.state.mainlink}candidate/taketest?testid=${this.props.conduct.id}&traineeid=${id}`} onCopy={()=>message.success('Link Copied to clipboard')}><Icon type="copy"/></CopyToClipboard>}/>
                ),
            }
        ];

      return (
        <div className="candidate-list-header-container">
          <Button 
            className="reload-button" 
            type="primary" 
            icon="reload" 
            loading={this.state.loading} 
            onClick={this.refreshUserList}
          >
            Reload
          </Button>

          <div className="register-trainer-form-header">
            <Title level={4} style={{ color: '#fff', textAlign: 'center' }}>List of Registered Candidates</Title>
          </div>
          <Table
            columns={columns}
            bordered={true}
            dataSource={this.props.conduct.registeredCandidates}
            rowKey="_id"
            loading={this.state.loading}
          />

        <Modal
          title="Import Candidates"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[ ]}
        >
          <p><b>Note :</b> Upload csv file to import candidates data-</p>
          <p>CSV file header should contain - name, emailid, contact</p>
          <CSVReader
            cssClass="react-csv-input"
            label=""
            onFileLoaded={this.handleForce}
            parserOptions={papaparseOptions}
          />
          <Progress percent={this.state.progress} />
        </Modal>
        </div>
      );
  };
};

const mapStateToProps = state => ({
    conduct : state.conduct
});

export default connect(mapStateToProps,{
    changeConducttestId,
    updateCandidatesTest
})(Candidates);