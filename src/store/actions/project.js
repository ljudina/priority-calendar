import {firebaseDb, firebaseAuth} from '../../shared/firebase';

import * as actionTypes from './actionTypes';

export const projectStart = () => {
    return {
        type: actionTypes.PROJECT_START
    };
};

export const projectLoad = () => {
    return {
        type: actionTypes.PROJECT_LOAD
    };
};

export const projectSuccess = (projectData, message = '') => {
    return {
        type: actionTypes.PROJECT_SUCCESS,
        success: message,
        project: { ...projectData }
    };
};

export const projectFail = (error) => {
    return {
        type: actionTypes.PROJECT_FAIL,
        error: error
    };
};

export const projectDeleteSuccess = (projectId) => {
    return {
        type: actionTypes.PROJECT_DELETE_SUCCESS,
        projectId: projectId
    };
};

export const projectSave = (projectData) => {
    return dispatch => {
        //Start saving
        dispatch(projectStart());
        //Init success message
        let success_message = "Project saved!";        
        //Init url
        const projectsRef = firebaseDb.ref('/projects/');
        //Check for update
        if(projectData.id){
            //Set userID
            const userId = firebaseAuth.currentUser.uid || null;
            //Check user id
            if(userId === projectData.userId){
                //Get project reference
                var projectRef = projectsRef.child(projectData.id);
                //Update project data with user entry
                projectRef.update(projectData)
                .then(updateResponse => {            
                    dispatch(projectSuccess(projectData, success_message));
                })
                .catch(error => {
                    dispatch(projectFail(error.message));
                });
            }else{
                dispatch(projectFail("You are not authorized to update this project!"));
            }
        }else{           
            //Remove id
            delete projectData.id;
            //Create new project
            projectsRef.push().then(pushResponse => {
                //Set newly created project id and link to project ref
                var projectRef = projectsRef.child(pushResponse.key);
                //Update project data with user entry
                projectRef.update(projectData)
                .then(updateResponse => {            
                    projectData.id = pushResponse.key; //Set id
                    dispatch(projectSuccess(projectData, success_message));
                })
                .catch(error => {
                    dispatch(projectFail(error.message));
                });              
            });
        }
    };
}

export const projectRead = (projectId, userId) => {
    return dispatch => {
        //Start loading
        dispatch(projectLoad());
        //Set projects reference
        const projectsRef = firebaseDb.ref('/projects/');
        //Send request
        projectsRef.orderByKey().equalTo(projectId).once('value')
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
            //Check for project data
            if(projectData.length > 0){
                //Check if user is authorized to edit project
                if(projectData[0].userId !== userId){
                    dispatch(projectFail("You are not authorized to edit this project!"));
                }else{
                    //Set project success
                    dispatch(projectSuccess(projectData[0]));
                }
            }else{
                dispatch(projectFail("The selected project can not be found!"));
            }      
        })
        .catch(error => {
            dispatch(projectFail(error.message));
        });
    };
};

export const projectDelete = (projectId, userId) => {
    return dispatch => {
        //Set projects reference
        const projectRef = firebaseDb.ref('/projects/' + projectId);
        //Send request
        projectRef.remove()
        .then(snapshot => {
            //Set tasks reference
            const tasksRef = firebaseDb.ref('/tasks/')
            //Send request
            tasksRef.orderByChild('projectId').equalTo(projectId).once('value')
            .then(snapshot => {
                //Set resource value
                const res = snapshot.val();            
                //Init promises
                const promises = [];
                //Set task data
                for ( let key in res ) {
                    //Set task reference
                    const taskRef = firebaseDb.ref('/tasks/' + key);
                    promises.push(taskRef.remove());
                }   
                //Return promise
                return Promise.all(promises);
            })
            .then(() => {
                //Set project success
                dispatch(projectDeleteSuccess(projectId));
            })
            .catch(error => {
                dispatch(projectFail("Project deleted but tasks are not!" + error.message));
            });
        })
        .catch(error => {
            dispatch(projectFail(error.message));
        });
    };    
};