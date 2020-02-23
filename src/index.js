import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import theme from './theme';

import authReducer from './store/reducers/auth';
import profileReducer from './store/reducers/profile';
import projectsReducer from './store/reducers/projects';
import projectReducer from './store/reducers/project';
import tasksReducer from './store/reducers/tasks';
import taskReducer from './store/reducers/task';

const composeEnhancers = (process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  projects: projectsReducer,
  project: projectReducer,
  tasks: tasksReducer,
  task: taskReducer
});

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

const app = (
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ThemeProvider>
);

ReactDOM.render(app, document.querySelector('#root'));