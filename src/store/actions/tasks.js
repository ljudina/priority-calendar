import {firebaseDb} from '../../shared/firebase';

import * as actionTypes from './actionTypes';

export const taskLoadingStart = () => {
    return {
        type: actionTypes.TASKS_LOADING_START
    };
};

export const tasksLoadingSuccess = (tasks) => {
    return {
        type: actionTypes.TASKS_LOADING_SUCCESS,
        tasks: tasks
    };
};

export const tasksLoadingFail = (error) => {
    return {
        type: actionTypes.TASKS_LOADING_FAIL,
        error: error
    };
};

export const tasksRemoveDeleted = (taskId) => {
    return {
        type: actionTypes.TASKS_REMOVE_DELETED,
        deletedTaskId: taskId
    };
};

export const loadTasks = (projectId) => {
    return dispatch => {        
        //Check if projectId is set
        if(projectId !== null){
            //Start loading
            dispatch(taskLoadingStart());
            //Set tasks reference
            const tasksRef = firebaseDb.ref('/tasks/')
            //Send request
            tasksRef.orderByChild('projectId').equalTo(projectId).once('value')
            .then(snapshot => {
                //Set resource value
                const res = snapshot.val();            
                //Set task data
                const taskData = [];
                for ( let key in res ) {
                    taskData.push( {
                        ...res[key],
                        projectId: projectId,
                        id: key
                    } );
                }      
                //Set tasks loading success
                dispatch(tasksLoadingSuccess(taskData));
            })
            .catch(error => {
                dispatch(tasksLoadingFail(error.message));
            });
        }else{
            dispatch(tasksLoadingFail("Tasks not loaded! Project is not defined."));
        }
    };
};

export const removeTaskOnDelete = (taskId) => {
    return dispatch => {
        //Update tasks list
        dispatch(tasksRemoveDeleted(taskId));
    }
};