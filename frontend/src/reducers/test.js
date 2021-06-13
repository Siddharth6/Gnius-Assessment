const initialState = {
    greet: 'Hi',
    currentStep: 0,
    mode: "random",
    newtestFormData: {
        testType: null,
        testTitle: '',
        testDuration: 60,
        OrganisationName: null,
        testSubject: [],
        testQuestions: [],
        startTime: null,
        endTime: null
    },
    addjobpost: false,
    jobPostData: {
        title: '',
        description: null,
        maxApplicants: 100,
        maxPositions: 30,
        skillsets: [],
        location: null,
        type: "Full Time",
        customdata: {},
    },
    questionsAvailablebasedonSubject: []
};


export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_ACTIVE_STEP':
            return {
                ...state,
                currentStep: action.payload
            }
        case 'CHANGE_BASIC_NEW_TEST_DETAILS':
            return {
                ...state,
                newtestFormData: {
                    ...state.newtestFormData,
                    ...action.payload
                }
            }
        case 'FETCH_QUESTIONS_BASED_ON_SUBJECT':
            return {
                ...state,
                questionsAvailablebasedonSubject: action.payload
            }
        case 'ADD_QUESTION_TO_QUESTION_QUEUSE':
            return {
                ...state,
                newtestFormData: {
                    ...state.newtestFormData,
                    testQuestions: action.payload
                }
            }
        case 'REMOVE_QUESTION_FROM_MAIN_QUEUE':
            return {
                ...state,
                questionsAvailablebasedonSubject: action.payload
            }
        case 'CHANGE_MODE_QUESTION_SELECT':
            return {
                ...state,
                mode: action.payload
            }
        case 'ADD_JOB_DATA':
            return{
                ...state,
                addjobpost:  action.payload1,
                jobPostData: action.payload2,
            }
        
        default:
            return state;
    };
};