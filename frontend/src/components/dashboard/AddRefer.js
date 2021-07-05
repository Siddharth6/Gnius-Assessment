import React from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import { connect } from 'react-redux';

import { SecurePost } from '../../services/axiosCall';
import apis from '../../services/Apis';
import  Alert  from '../common/alert';
import { UpdateReferTable } from '../../actions/trainerAction';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Add a new Referrer"
          okText="Add"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Name" hasFeedback>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input the name!' }],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="Email" hasFeedback>
              {getFieldDecorator('email', {
                rules: [
                    { 
                        required: true, 
                        message: 'Please input the email!' 
                    },
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                ],
              })(<Input />)}
            </Form.Item>

          </Form>
        </Modal>
      );
    }
  },
);

class CollectionsPage extends React.Component {
  constructor(props){
    super(props);
    this.state={
      visible: false,
    }
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  // Submit Form
  handleCreate = () => {
    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      if (!err) {
        SecurePost({
            url: apis.ADD_REFER,
            data: {
                name: values.name,
                email: values.email
            }
        })
        .then((response) => {
            if(response.data.success){
              Alert('success', 'Success', response.data.message);
              form.resetFields();
              this.props.UpdateReferTable();
              this.setState({ visible: false });
            }
        })
        .catch((error) => {
            return Alert('error','Error!','Server Error');
        });
      }
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Add New Referrer
        </Button>

        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
        
      </div>
    );
  }
};

export default connect(null,{
  UpdateReferTable
})(CollectionsPage);