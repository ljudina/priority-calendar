import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    tasks: [],
    loading: false,
    error: ''
};

const tasksLoadingStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const tasksLoadingSuccess = (state, action) => {
    return updateObject(state, { 
        tasks: action.tasks,
        error: '',
        loading: false
     });
};

const tasksLoadingFail = (state, action) => {
    return updateObject( state, {   
        error: action.error,
        loading: false
    });
};

const tasksRemoveDeleted = (state, action) => {
    //Remove id from task list
    const updatedTasks = state.tasks.filter(task => task.id !== action.deletedTaskId);    
    //Update state
    return updateObject( state, {   
        tasks: updatedTasks
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.TASKS_LOADING_START: return tasksLoadingStart(state, action);
        case actionTypes.TASKS_LOADING_SUCCESS: return tasksLoadingSuccess(state, action);
        case actionTypes.TASKS_LOADING_FAIL: return tasksLoadingFail(state, action);
        case actionTypes.TASKS_REMOVE_DELETED: return tasksRemoveDeleted(state, action);        
        default:
            return state;
    }
};

export default reducer;