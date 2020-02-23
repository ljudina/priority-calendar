import {firebaseDb} from '../../shared/firebase';

import * as actionTypes from './actionTypes';

export const taskStart = () => {
    return {
        type: actionTypes.TASK_START
    };
};

export const taskLoad = () => {
    return {
        type: actionTypes.TASK_LOAD
    };
};

export const taskSuccess = (taskData, message = '') => {
    return {
        type: actionTypes.TASK_SUCCESS,
        success: message,
        task: { ...taskData }
    };
};

export const taskFail = (error) => {
    return {
        type: actionTypes.TASK_FAIL,
        error: error
    };
};

export const taskDeleteSuccess = (taskId) => {
    return {
        type: actionTypes.TASK_DELETE_SUCCESS,
        taskId: taskId
    };
};

export const taskSave = (taskData) => {
    return dispatch => {
        //Start saving
        dispatch(taskStart());
        //Init success message
        let success_message = "Task saved!";        
        //Init url
        const tasksRef = firebaseDb.ref('/tasks/');
        //Check for update
        if(taskData.id){
            //Get task reference
            var taskRef = tasksRef.child(taskData.id);
            //Update task data with user entry
            taskRef.update(taskData)
            .then(updateResponse => {
                dispatch(taskSuccess(taskData, success_message));
            })
            .catch(error => {
                dispatch(taskFail(error.message));
            });
        }else{
            //Remove id
            delete taskData.id;
            //Create new task
            tasksRef.push().then(pushResponse => {
                //Set newly created task id and link to task ref
                var taskRef = tasksRef.child(pushResponse.key);
                //Update task data with user entry
                taskRef.update(taskData)
                .then(updateResponse => {            
                    taskData.id = pushResponse.key; //Set id
                    dispatch(taskSuccess(taskData, success_message));
                })
                .catch(error => {
                    dispatch(taskFail(error.message));
                });              
            });
        }
    };
}

export const taskRead = (taskId) => {
    return dispatch => {
        //Start loading
        dispatch(taskLoad());
        //Set tasks reference
        const tasksRef = firebaseDb.ref('/tasks/');
        //Send request
        tasksRef.orderByKey().equalTo(taskId).once('value')
        .then(snapshot => {
            //Set resource value
            const res = snapshot.val();                        
            //Set task data
            const taskData = [];
            for ( let key in res ) {
                taskData.push( {
                    ...res[key],
                    id: key
                } );
            }           
            //Check for task data
            if(taskData.length > 0){
                //Set task success
                dispatch(taskSuccess(taskData[0]));                
            }else{
                dispatch(taskFail("The selected task can not be found!"));
            }      
        })
        .catch(error => {
            dispatch(taskFail(error.message));
        });
    };
};

export const taskDelete = (taskId) => {
    return dispatch => {
        //Set tasks reference
        const taskRef = firebaseDb.ref('/tasks/' + taskId);
        //Send request
        taskRef.remove()
        .then(snapshot => {
            //Set task success
            dispatch(taskDeleteSuccess(taskId));
        })
        .catch(error => {
            dispatch(taskFail(error.message));
        });
    };    
};    