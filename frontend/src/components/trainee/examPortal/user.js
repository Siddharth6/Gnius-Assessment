import React from 'react';
import { connect } from 'react-redux';
import './portal.css';

const user_icon = 'https://res.cloudinary.com/gniusedu/image/upload/v1616994666/gnius-jpg_aspibu.jpg';

function Trainee(props) {
    return (
        <div className="loggedin-trainee-container">
            <div className="loggedin-trainee-inner">
                <img alt="User Icon" src={user_icon} className="loggedin-trainee-logo"/>
                <div className="loggedin-trainee-details-container">
                    <p>{props.trainee.traineeDetails.name}</p>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    trainee : state.trainee
});




export default connect(mapStateToProps,null)(Trainee);