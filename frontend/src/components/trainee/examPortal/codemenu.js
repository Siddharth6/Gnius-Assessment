import React, { Fragment } from 'react'
import { connect } from 'react-redux';
import { Button, Popconfirm } from 'antd';

import Alert from '../../common/alert';
import apis from '../../../services/Apis';
import { Post } from '../../../services/axiosCall';
import { submitCoding } from '../../../actions/traineeAction'

class Sidepanel extends React.Component {
    render(){
        return (
            <Fragment>
                <div style={{height: '80px'}} >
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                Menu
                            </div>

                            <div className="col-lg-6">
                                <Button
                                    type="primary"
                                    onClick={() => this.props.submitCoding(true)}
                                >
                                    Submit Section
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
    };
};

const mapStateToProps = state => ({
    trainee : state.trainee
});

export default connect(mapStateToProps,{
    submitCoding
})(Sidepanel);