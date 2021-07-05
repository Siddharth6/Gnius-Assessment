import React, { Fragment, useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { connect } from 'react-redux';

import { SecurePost } from '../../services/axiosCall';
import apis from '../../services/Apis';
import  Alert  from '../common/alert';
import { UpdateReferTable } from '../../actions/trainerAction';

const Refer = (props) => {
    
    useEffect(() => {
        props.UpdateReferTable();
    }, []);

    return (
        <Fragment>
            <MaterialTable
                title="Referrer List"
                columns={[
                    { title: 'Referrer Code', field: '_id' },
                    { title: 'Name', field: 'name' },
                    { title: 'Email', field: 'email' },
                ]}

                data={props.trainer.referTable}

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

const mapStateToProps = state => ({
    trainer : state.trainer
});

export default connect(mapStateToProps,{
    UpdateReferTable
})(Refer);