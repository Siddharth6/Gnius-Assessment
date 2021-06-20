import React, { Fragment } from 'react';
import { Result } from 'antd';

export default function ErrorPage() {
    return (
        <Fragment>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
            />
        </Fragment>
    )
};