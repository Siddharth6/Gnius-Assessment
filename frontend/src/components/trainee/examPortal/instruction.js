import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux';
import { Button, Checkbox } from 'antd';
import { ProceedtoTest, fetchTestdata } from '../../../actions/traineeAction';
import './portal.css';
import logo from '../../basic/header/logo.png';

function Instruction(props) {
    const [state, setstate] = useState(false);

    function onChange(e) {
        // console.log(e.target.checked);
        setstate(e.target.checked);
    }

    return (
        <Fragment>
            <div className="header-container">
                <img src={logo} alt="company logo" className="logo" />
            </div>

            <div className="instaruction-page-wrapper">
                <div className="instruction-page-inner">
                    <h1>Instructions:</h1>
                    <p>Please read the instructions carefully</p>
                    <h4>1. All questions are compulsory.</h4>
                    <h4>
                        2. Please save the question before you proceed to the next question.
                        <b>NOTE :</b>To save answers, click on the 'Save & Next' button.
                    </h4>
                    <h4>3. Please don't leave the window before you submit.</h4>
                    <h4>4. Click on 'End Test' button to submit the assessment. </h4>
                    <h4>5. The test will be automatically submitted when the time ends.</h4>
                    <h4>
                        <Checkbox onChange={onChange}>I have read and understood all the instructions</Checkbox>
                    </h4>
                    <div className="proceed-to-test-button">
                        {state ? 
                            <Button
                            style={{ float: 'right' }}
                            type="primary" icon="caret-right"
                            onClick={() => { props.ProceedtoTest(props.trainee.testid, props.trainee.traineeid, () => { props.fetchTestdata(props.trainee.testid, props.trainee.traineeid) }) }} loading={props.trainee.proceedingToTest}
                        >
                            Proceed
                        </Button> : null
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

const mapStateToProps = state => ({
    trainee : state.trainee
});

export default connect(mapStateToProps,{
    ProceedtoTest,
    fetchTestdata
})(Instruction);