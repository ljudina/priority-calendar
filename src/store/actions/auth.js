import {firebaseAuth} from '../../shared/firebase';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (userId, userEmailVerified) => {
    return {
        userId: userId,
        userEmailVerified: userEmailVerified,
        type: actionTypes.AUTH_SUCCESS
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const authCreated = () => {
    return {
        type: actionTypes.AUTH_CREATED
    };
};

export const sendingEmailStart = () => {
    return {
        type: actionTypes.SENDING_EMAIL_START
    };
};

export const sendingEmailSuccess = (message) => {
    return {
        type: actionTypes.SENDING_EMAIL_SUCCESS,
        successMessage: message
    };
};

export const logout = (errorMessage) => {
    //Remove local storage user information
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmailVerified');
    return {
        type: actionTypes.AUTH_LOGOUT,
        logoutErrorMessage: errorMessage
    };
};

export const signOut = (message) => {
    return dispatch => {
        //Dispatch logout action
        dispatch(logout(message));        
        //Sign in user
        firebaseAuth.signOut()
        .catch(function(requestError) {
            //Set error
            let error = { field: null, message: requestError.message };
            //Dispatch action
            dispatch(authFail(error));
        });
    };
};

export const signIn = (email, password) => {
    return dispatch => {
        //Start auth
        dispatch(authStart());
        //Sign in user
        firebaseAuth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            //Set local storage user information
            localStorage.setItem('userId', userCredential.user.uid);
            localStorage.setItem('userEmailVerified', userCredential.user.emailVerified);
            //Load user credential
            dispatch(authSuccess(userCredential.user.uid, userCredential.user.emailVerified));
        })
        .catch(function(requestError) {
            let error = { field: null, message: '' };
            switch (requestError.code) {
                case 'auth/invalid-email':
                    error.field = 'email';   
                    break;
                case 'auth/user-not-found':
                    error.field = 'email';
                    break;   
                case 'auth/user-disabled':
                    error.field = 'email';
                    break;            
                case 'auth/wrong-password':
                    error.field = 'password';
                    break;                                                                          
                default:
                    break;
            }
            //Set error message
            error.message = requestError.message;
            //Dispatch action
            dispatch(authFail(error));
        });
    };
};

export const sendVerificationEmail = () => {
    return dispatch => {
        //Set sending flag
        dispatch(sendingEmailStart());
        const user = firebaseAuth.currentUser;
        //Sign in user
        user.sendEmailVerification()
        .then(() => {
            //Email sent successfully
            dispatch(sendingEmailSuccess("Verification email send successfully!"));
        })
        .catch(function(responseError) {
            //Init error
            let error = { field: null, message: '' };
            //Set error message
            error.message = responseError.message;
            //Dispatch action
            dispatch(authFail(error));
        }); 
    }   
};

export const sendPasswordEmail = (email) => {
    return dispatch => {
        //Set sending flag
        dispatch(sendingEmailStart());
        //Send password reset email
        firebaseAuth.sendPasswordResetEmail(email)
        .then(() => {
            //Email sent successfully
            dispatch(sendingEmailSuccess("Password reset email send successfully!"));
        })
        .catch(function(responseError) {
            //Init error
            let error = { field: 'email', message: '' };
            //Set error message
            error.message = responseError.message;
            //Dispatch action
            dispatch(authFail(error));
        }); 
    }   
};

export const signUp = (email, password) => {
    return dispatch => {
        //Start auth
        dispatch(authStart());
        //Sign in user
        firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            //Set user created
            dispatch(authCreated());
            //Dispatch action
            dispatch(authSuccess(userCredential.user.uid, userCredential.user.emailVerified));
           //Send verification email
           const user = userCredential.user;
           //Sign in user
           user.sendEmailVerification()
           .catch(function(responseError) {
               //Init error
               let error = { field: null, message: '' };
               //Set error message
               error.message = "Send verification email failed! "+responseError.message;
               //Dispatch action
               dispatch(authFail(error));
           });
        })
        .catch(function(requestError) {
            let error = { field: null, message: '' };
            switch (requestError.code) {
                case 'auth/email-already-in-use':
                    error.field = 'email';   
                    break;
                case 'auth/invalid-email':
                    error.field = 'email';   
                    break;
                case 'auth/operation-not-allowed':
                    error.field = 'email';   
                    break;                      
                case 'auth/weak-password':
                    error.field = 'password';   
                    break;                                                                                                   
                default:
                    break;
            }
            //Set error message
            error.message = requestError.message;
            //Dispatch action
            dispatch(authFail(error));
        });
    };    
};    

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    return dispatch => {        
        //Check if user is logged in 
        firebaseAuth.onAuthStateChanged(user => {                                    
            if (!user) {
                //Not logged in
                dispatch(logout(''));
            } else {
                //Dispatch action
                dispatch(authSuccess(user.uid, user.emailVerified));
            }
        });
        const userId = localStorage.getItem('userId');
        if(!userId){
            //Not logged in
            dispatch(logout(''));
        }else{
            const userEmailVerified = localStorage.getItem('userEmailVerified') === 'true';
            //Dispatch action
            dispatch(authSuccess(userId, userEmailVerified));
        }
    };
};