import React, { Fragment } from 'react';

import Profile from './Profile';
import ResetPassword from './ResetPassword';

const Settings = () => {
    return (
        <Fragment>
            <Profile />
            <ResetPassword />
        </Fragment>
    );
};

export default Settings;
