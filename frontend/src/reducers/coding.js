const initialState = {
    NewQuestionModalState: false,
    QuestionTableLoading : false, 
    QuestionTableData : []
};

export default (state = initialState, action) => {
    switch(action.type){
        case 'CHANGE_CODING_QUESTION_MODAL_STATE':
            return {
                ...state,
                NewQuestionModalState : action.payload,
            }
        case 'CHANGE_CODING_QUESTION_TABLE_LOADING_STATUS':
            return {
                ...state,
                QuestionTableLoading : action.payload1,
                QuestionTableData : action.payload2
            }
        default:
            return state;
    }
};