import React, { Fragment } from 'react';
import MaterialTable from 'material-table';
import { connect } from 'react-redux';
import { Input, Button, Typography, Tabs, Icon } from 'antd';

const JobApplications = () => {
    return (
        <Fragment>
            <MaterialTable
              title="Job Applications"
              columns={[]}
              options={{
                exportButton: true,
                headerStyle: {
                  backgroundColor: '#3f51b5',
                  color: '#FFFF'
                },
              }}
            />
        </Fragment>
    );
};

export default JobApplications;