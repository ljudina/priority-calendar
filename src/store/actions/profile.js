import {firebaseDb} from '../../shared/firebase';

import * as actionTypes from './actionTypes';

export const profileStart = () => {
    return {
        type: actionTypes.PROFILE_START
    };
};

export const profileLoad = () => {
    return {
        type: actionTypes.PROFILE_LOAD
    };
};

export const profileSuccess = (profileData, message = '') => {
    return {
        type: actionTypes.PROFILE_SUCCESS,
        success: message,
        ...profileData
    };
};

export const profileFail = (error) => {
    return {
        type: actionTypes.PROFILE_FAIL,
        error: error
    };
};

export const profileSave = (profileData) => {
    return dispatch => {
        //Start saving
        dispatch(profileStart());
        //Init success message
        let success_message = "Profile saved!";        
        //Init url
        const profilesRef = firebaseDb.ref('/profiles/')        
        //Check for update
        if(profileData.id){
            //Set newly created profile id and link to profile ref
            var profileRef = profilesRef.child(profileData.id);
            //Update profile data with user entry
            profileRef.update(profileData)
            .then(updateResponse => {            
                dispatch(profileSuccess(profileData, success_message));
            })
            .catch(error => {
                dispatch(profileFail(error.message));
            });
        }else{            
            //Remove id
            delete profileData.id;
            //Create new profile
            profilesRef.push().then(pushResponse => {
                //Set newly created profile id and link to profile ref
                var profileRef = profilesRef.child(pushResponse.key);
                //Update profile data with user entry
                profileRef.update(profileData)
                .then(updateResponse => {            
                    profileData.id = pushResponse.key; //Set id
                    dispatch(profileSuccess(profileData, success_message));
                })
                .catch(error => {
                    dispatch(profileFail(error.message));
                });              
            });            
        }
    };
}

export const profileRead = (userId) => {
    return dispatch => {
        //Start loading
        dispatch(profileLoad());
        //Set profiles reference
        const profilesRef = firebaseDb.ref('/profiles/')
        //Send request
        profilesRef.orderByChild('userId').equalTo(userId).once('value')
        .then(snapshot => {
            //Set resource value
            const res = snapshot.val();            
            //Set profile data
            const profileData = [];
            for ( let key in res ) {
                profileData.push( {
                    ...res[key],
                    userId: userId,
                    id: key
                } );
            }            
            //Set profile success
            dispatch(profileSuccess(profileData[0]));
        })
        .catch(error => {
            dispatch(profileFail(error.message));
        });
    };
};