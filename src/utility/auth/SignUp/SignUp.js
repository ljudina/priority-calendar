import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import {validateData} from '../../validation';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Typography from '@material-ui/core/Typography';

import Copyright from '../../Copyright';
import signUpStyles from './SignUpStyles';
import PopUpMessage from '../../../shared/popUpMessage';

const SignUp = props => {
  //Set classes
  const classes = signUpStyles();
  //Init user
  const initUser = {
    email: {
      value: '',
      notValid: false, 
      helperText: '',
      validation: { 
        required: {errorMessage: 'Your email is required!'},
        isEmail: {errorMessage: 'Entered email is not valid!'}
      }      
    },
    password: {
      value: '',
      notValid: false, 
      helperText: '',
      validation: { 
        required: {errorMessage: 'Password is required!'},
      }      
    },
    confirmPassword: {
      value: '',
      notValid: false, 
      helperText: '',
      validation: { 
        required: {errorMessage: 'Confirm password is required!'},
      }      
    }
  };

  const [user, setUser] = useState(initUser);

  useEffect(() => {
    //Check for email error field
    if(props.error.field === 'email'){
      //Set error message for email field
      setUser(prevUser => ({...prevUser, email: {...prevUser.email, notValid: true, helperText: props.error.message}}))
    }
  }, [props.error]);

  const emailChangeHandler = event => {
    setUser({...user, email: {...user.email, value: event.target.value}});
  };

  const passwordChangeHandler = event => {
    setUser({...user, password: {...user.password, value: event.target.value}});
  };
  
  const confirmPasswordChangeHandler = event => {
    setUser({...user, confirmPassword: {...user.confirmPassword, value: event.target.value}});
  };  

  const submitHandler = event => {
    //Prevent form from submitting
    event.preventDefault();
    //Validate data
    const [isValid, userUpdate] = validateData(user);
    //Set new user data
    setUser(userUpdate);
    //If form is valid send request
    if(isValid){
      //Set redux action in order to send sign up request
      props.onSignUp(user.email.value, user.password.value);
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AssignmentIndIcon />
          </Avatar>
          <Typography component="h2" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate onSubmit={submitHandler}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="off"
              autoFocus
              value={user.email.value}
              onChange={emailChangeHandler}
              error={user.email.notValid}
              helperText={user.email.helperText}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={user.password.value}
              onChange={passwordChangeHandler}
              error={user.password.notValid}
              helperText={user.password.helperText}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              value={user.confirmPassword.value}
              onChange={confirmPasswordChangeHandler}
              error={user.confirmPassword.notValid}
              helperText={user.confirmPassword.helperText}
            />           
            <div className={classes.wrapper}>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={props.loading}
                >
                Sign Up
                </Button>            
                {props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>          
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
        {props.error.message ? <PopUpMessage message={props.error.message} type="error" open /> : null}
      </Grid>
    </Grid>    
  );
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    created: state.auth.created,
    error: state.auth.error,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSignUp: (email, password) => dispatch(actions.signUp(email, password)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);