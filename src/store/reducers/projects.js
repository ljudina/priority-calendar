import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    projects: [],
    loading: false,
    error: ''
};

const projectsLoadingStart = ( state, action ) => {
    return updateObject( state, { loading: true } );
};

const projectsLoadingSuccess = (state, action) => {
    return updateObject(state, { 
        projects: action.projects,
        error: '',
        loading: false
     });
};

const projectsLoadingFail = (state, action) => {
    return updateObject( state, {   
        error: action.error,
        loading: false
    });
};

const projectsRemoveDeleted = (state, action) => {
    //Remove id from project list
    const updatedProjects = state.projects.filter(project => project.id !== action.deletedProjectId );    
    //Update state
    return updateObject( state, {   
        projects: updatedProjects
    });
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.PROJECTS_LOADING_START: return projectsLoadingStart(state, action);
        case actionTypes.PROJECTS_LOADING_SUCCESS: return projectsLoadingSuccess(state, action);
        case actionTypes.PROJECTS_LOADING_FAIL: return projectsLoadingFail(state, action);
        case actionTypes.PROJECTS_REMOVE_DELETED: return projectsRemoveDeleted(state, action);        
        default:
            return state;
    }
};

export default reducer;