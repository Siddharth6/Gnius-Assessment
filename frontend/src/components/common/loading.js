import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

const Loading = () => {
    return (
        <Fragment>
            <Spin size="large" indicator={antIcon} />
        </Fragment>
    );
};

export default Loading;