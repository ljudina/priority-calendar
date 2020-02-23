import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    data: {
        id: null,
        projectId: null,
        name: '',
        deadline: '',
        status: ''
    },
    saving: false,
    loading: false,
    success: '',
    error: '',
    deletedTaskId: null
};

const taskStart = ( state, action ) => {
    return updateObject( state, { saving: true, success: '', error: '' } );
};

const taskLoad = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const taskSuccess = (state, action) => {
    return updateObject(state, {
        data: {
            id: action.task.id,
            projectId: action.task.projectId,
            name: action.task.name,
            deadline: action.task.deadline,
            status: action.task.status
        },
        error: '',
        success: action.success,
        saving: false,
        loading: false
     });
};

const taskFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        saving: false,
        loading: false,
        success: ''
    });
};

const taskDeleteSuccess = (state, action) => {
    return updateObject( state, { deletedTaskId: action.taskId } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.TASK_START: return taskStart(state, action);
        case actionTypes.TASK_LOAD: return taskLoad(state, action);
        case actionTypes.TASK_SUCCESS: return taskSuccess(state, action);
        case actionTypes.TASK_FAIL: return taskFail(state, action);
        case actionTypes.TASK_DELETE_SUCCESS: return taskDeleteSuccess(state, action);
        default:
            return state;
    }
};

export default reducer;