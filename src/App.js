import React, { Suspense, useEffect } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import Aux from './hoc/Aux/Aux';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

import LinearProgress from '@material-ui/core/LinearProgress';
import SignOut from './utility/auth/SignOut';

const SignIn = React.lazy(() => {
  return import('./utility/auth/SignIn');
});
const SignUp = React.lazy(() => {
  return import('./utility/auth/SignUp/SignUp');
});

const Dashboard = React.lazy(() => {
  return import('./Dashboard');
});

const Profile = React.lazy(() => {
  return import('./containers/Profile/Profile');
});

const SaveProject = React.lazy(() => {
  return import('./containers/Project/SaveProject');
});

const Project = React.lazy(() => {
  return import('./containers/Project/Project');
});

const SaveTask = React.lazy(() => {
  return import('./containers/Task/SaveTask');
});

const EmailVerify = React.lazy(() => {
  return import('./utility/auth/EmailVerify');
});

const UserCreated = React.lazy(() => {
  return import('./utility/auth/UserCreated');
});

const ForgotPassword = React.lazy(() => {
  return import('./utility/auth/ForgotPassword');
});

const App = props => {
  const { onTryAutoSignup } = props;

  const pathList = ['/', '/sign-out', '/sign-up', '/add-project', '/profile', '/edit-project', '/view-project', '/add-task', '/forgot-password'];

  useEffect(() => {
    onTryAutoSignup();
  }, [onTryAutoSignup]);  

  let routes = (
    <Switch>
      <Route path="/sign-out" exact component={SignOut} />
      <Route path="/forgot-password" exact component={(props) => <ForgotPassword {...props} />} />
      <Route path="/sign-up" exact component={(props) => <SignUp {...props} />} />
      <Route path="/" exact component={(props) => <SignIn {...props} />} />
    </Switch>    
  );

  //Check if authenticated
  if (props.isAuthenticated) {    
    //Check if email is verified
    if(props.isEmailVerified){
      routes = (
        <Switch>
          <Route path="/edit-task" component={(props) => <SaveTask {...props} />} />
          <Route path="/add-task" component={(props) => <SaveTask {...props} />} />
          <Route path="/view-project" component={(props) => <Project {...props} />} />
          <Route path="/edit-project" component={(props) => <SaveProject {...props} />} />
          <Route path="/add-project" exact component={(props) => <SaveProject {...props} />} />
          <Route path="/profile" exact component={(props) => <Profile {...props} />} />
          <Route path="/" exact component={(props) => <Dashboard {...props} />} />
        </Switch>    
      );      
    }else{
      if(props.isCreated){
        routes = <UserCreated />;
      }else{
        routes = <EmailVerify />;
      }      
    }
  }
  //If wrong link redirect to home page
  if(pathList.filter(path => props.location.pathname.includes(path)).length === 0){
    return <Redirect to="/" />;
  }
  return (
    <Aux>
      <Suspense fallback={<LinearProgress />}>{routes}</Suspense>
    </Aux>
  );  
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.userId !== null,
    isEmailVerified: state.auth.userEmailVerified,
    isCreated: state.auth.created
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));