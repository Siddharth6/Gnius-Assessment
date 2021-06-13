// Coding Redux Action
import apis from '../services/Apis';
import Alert from '../components/common/alert';
import { SecurePost } from '../services/axiosCall';

// 1 - 
export const ChangeCodingQuestionModalState = (data) => dispatch => {
    dispatch({
        type: 'CHANGE_CODING_QUESTION_MODAL_STATE',
        payload: data
    });
};

// 2 - 
export const ChangeCodingQuestionData = () => dispatch => {
    dispatch({
        type: 'CHANGE_CODING_QUESTION_TABLE_LOADING_STATUS',
        payload1: true,
        payload2: []
    });

    SecurePost({
        url: `${apis.LIST_CODING_QUESTION}`
    })
    .then((response) => {
        if (response.data.success) {
            dispatch({
                type: 'CHANGE_CODING_QUESTION_TABLE_LOADING_STATUS',
                payload1: false,
                payload2: response.data.questions
            });
        }
        else {
            Alert('error', 'Error!', response.data.message);
            dispatch({
                type: 'CHANGE_CODING_QUESTION_TABLE_LOADING_STATUS',
                payload1: false,
                payload2: []
            });
        }
    })
    .catch((error) => {
        Alert('error', 'Error!', 'Server Error');
        dispatch({
            type: 'CHANGE_CODING_QUESTION_TABLE_LOADING_STATUS',
            payload1: false,
            payload2: []
        });
    });
};