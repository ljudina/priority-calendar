import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    data: {
        id: null,
        userId: null,
        name: '',
        occupation: '',
        userType: 'individual',
        company: ''        
    },
    saving: false,
    loading: false,
    success: '',
    error: ''
};

const profileStart = ( state, action ) => {
    return updateObject( state, { saving: true, success: '', error: '' } );
};

const profileLoad = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const profileSuccess = (state, action) => {
    return updateObject(state, { 
        data: {
            id: action.id,
            userId: action.userId,
            name: action.name,
            occupation: action.occupation,
            userType: action.userType,
            company: action.company
        },
        error: '',
        success: action.success,
        saving: false,
        loading: false
     });
};

const profileFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        saving: false,
        loading: false,
        success: ''
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.PROFILE_START: return profileStart(state, action);
        case actionTypes.PROFILE_LOAD: return profileLoad(state, action);
        case actionTypes.PROFILE_SUCCESS: return profileSuccess(state, action);
        case actionTypes.PROFILE_FAIL: return profileFail(state, action);
        default:
            return state;
    }
};

export default reducer;