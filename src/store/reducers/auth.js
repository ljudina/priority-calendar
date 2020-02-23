import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    userId: null,
    userEmailVerified: false,
    error: {
        field: null,
        message: ''
    },
    loading: false,
    sending: false,
    created: false,
    success: '',
    authRedirectPath: '/'
};

const authStart = ( state, action ) => {
    return updateObject( state, { error: {field: null, message: ''}, loading: true } );
};

const authSuccess = (state, action) => {
    return updateObject( state, { 
        userId: action.userId,
        userEmailVerified: action.userEmailVerified,
        error: {
            field: null,
            message: ''            
        },
        loading: false
     } );
};

const authFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false,
        sending:false
    });
};

const authCreated = ( state, action ) => {
    return updateObject( state, { error: {field: null, message: ''}, created: true } );
};

const authSendingEmailStart = ( state, action ) => {
    return updateObject( state, { error: {field: null, message: ''}, sending: true } );
};

const authSendingEmailSuccess = ( state, action ) => {
    return updateObject( state, { error: {field: null, message: ''}, sending: false, success: action.successMessage } );
};

const authLogout = (state, action) => {
    return updateObject(state, { userId: null, userEmailVerified: false, error: { field: null, message: action.logoutErrorMessage } });
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path })
}

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.AUTH_CREATED: return authCreated(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state,action);
        case actionTypes.SENDING_EMAIL_START: return authSendingEmailStart(state,action);
        case actionTypes.SENDING_EMAIL_SUCCESS: return authSendingEmailSuccess(state,action);
        default:
            return state;
    }
};

export default reducer;