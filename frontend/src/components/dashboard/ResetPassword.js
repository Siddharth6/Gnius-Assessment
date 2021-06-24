import React, { Fragment } from 'react';
import {
    Form,
    Input,
    Divider,
    Button,
    Typography,
    Row,
    Col
} from 'antd';
  
  
class ResetPassword extends React.Component {
    state = {
      confirmDirty: false
    };
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    };
  
    handleConfirmBlur = e => {
      const { value } = e.target;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
  
    compareToFirstPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };
  
    validateToNextPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };
  
    render() {
      const { getFieldDecorator } = this.props.form;
      const { Title } = Typography;

      return (
        <Fragment>
            <Title level={4}> Reset Password </Title>
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={24}>
                        <Form.Item label="Enter Current Password" hasFeedback>
                            {getFieldDecorator('current', {
                            rules: [
                                {
                                required: true,
                                message: 'Please input your current password!',
                                },
                                {
                                validator: this.validateToNextPassword,
                                },
                            ],
                            })(<Input.Password />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item label="Enter New Password" hasFeedback>
                            {getFieldDecorator('password', {
                            rules: [
                                {
                                required: true,
                                message: 'Please input your password!',
                                },
                                {
                                validator: this.validateToNextPassword,
                                },
                            ],
                            })(<Input.Password />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item label="Confirm Password" hasFeedback>
                            {getFieldDecorator('confirm', {
                            rules: [
                                {
                                required: true,
                                message: 'Please confirm your password!',
                                },
                                {
                                validator: this.compareToFirstPassword,
                                },
                            ],
                            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Update Password
                            </Button>
                        </Form.Item>
                    </Col>
                </Row> 
                
            </Form>

            <Divider />
        </Fragment>
      );
    }
  }
  
  const ResetPasswordForm = Form.create({ name: 'register' })(ResetPassword);
  
  export default ResetPasswordForm;