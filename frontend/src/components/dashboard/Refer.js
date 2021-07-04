import React, { Fragment, useState, useEffect } from 'react';
import MaterialTable from 'material-table';

import { SecurePost } from '../../services/axiosCall';
import apis from '../../services/Apis';
import  Alert  from '../common/alert';

const Refer = () => {
    const [state, setstate] = useState([]);
    const [loading, setloading] = useState(false);
    
    useEffect(() => {
        setloading(true);

        SecurePost({
            url: apis.LIST_REFER
        })
        .then((response) => {
            if(response.data.success){
                setstate(response.data.data);
                setloading(false);
            }
        })
        .catch((error) => {
            return Alert('error','Error!','Server Error');
        });
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

export default Refer;