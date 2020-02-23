import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    data: {
        id: null,
        userId: null,
        name: '',
        description: '',
        deadline: '',
        type: '',
        priority: '',
        status: ''
    },
    saving: false,
    loading: false,
    success: '',
    error: '',
    deletedProjectId: null
};

const projectStart = ( state, action ) => {
    return updateObject( state, { saving: true, success: '', error: '' } );
};

const projectLoad = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const projectSuccess = (state, action) => {
    return updateObject(state, {
        data: {
            id: action.project.id,
            userId: action.project.userId,
            name: action.project.name,
            description: action.project.description,
            deadline: action.project.deadline,
            type: action.project.type,
            priority: action.project.priority,
            status: action.project.status
        },
        error: '',
        success: action.success,
        saving: false,
        loading: false
     });
};

const projectFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        saving: false,
        loading: false,
        success: ''
    });
};

const projectDeleteSuccess = (state, action) => {
    return updateObject( state, { deletedProjectId: action.projectId } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.PROJECT_START: return projectStart(state, action);
        case actionTypes.PROJECT_LOAD: return projectLoad(state, action);
        case actionTypes.PROJECT_SUCCESS: return projectSuccess(state, action);
        case actionTypes.PROJECT_FAIL: return projectFail(state, action);
        case actionTypes.PROJECT_DELETE_SUCCESS: return projectDeleteSuccess(state, action);
        default:
            return state;
    }
};

export default reducer;