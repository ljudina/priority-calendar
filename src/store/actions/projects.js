import {firebaseDb} from '../../shared/firebase';

import * as actionTypes from './actionTypes';

export const projectLoadingStart = () => {
    return {
        type: actionTypes.PROJECTS_LOADING_START
    };
};

export const projectsLoadingSuccess = (projects) => {
    return {
        type: actionTypes.PROJECTS_LOADING_SUCCESS,
        projects: projects
    };
};

export const projectsLoadingFail = (error) => {
    return {
        type: actionTypes.PROJECTS_LOADING_FAIL,
        error: error
    };
};

export const projectsRemoveDeleted = (projectId) => {
    return {
        type: actionTypes.PROJECTS_REMOVE_DELETED,
        deletedProjectId: projectId
    };
};

export const loadProjects = (userId) => {
    return dispatch => {        
        //Start loading
        dispatch(projectLoadingStart());
        //Set projects reference
        const projectsRef = firebaseDb.ref('/projects/')
        //Send request
        projectsRef.orderByChild('userId').equalTo(userId).once('value')
        .then(snapshot => {
            //Set resource value
            const res = snapshot.val();            
            //Set project data
            const projectData = [];
            for ( let key in res ) {
                projectData.push( {
                    ...res[key],
                    userId: userId,
                    id: key
                } );
            }      
            //Set projects loading success
            dispatch(projectsLoadingSuccess(projectData));
        })
        .catch(error => {
            dispatch(projectsLoadingFail(error.message));
        });
    };
};

export const removeProjectOnDelete = (projectId) => {
    return dispatch => {
        //Update project list
        dispatch(projectsRemoveDeleted(projectId));
    }
};