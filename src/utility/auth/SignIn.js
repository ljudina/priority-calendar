import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import {validateData} from '../validation';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import Copyright from '../Copyright';
import PopUpMessage from '../../shared/popUpMessage';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/flRm0z3MEoA)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -8,
    marginLeft: -12,
  }
}));

const SignIn = props => {
  //Set classes
  const classes = useStyles();
  //Init demo user
  const demoUser = {
    email: {
        value: 'demo@pricld.com',
        notValid: false, 
        helperText: '',
        validation: { 
          required: {errorMessage: 'Your email is required!'},
          isEmail: {errorMessage: 'Entered email is not valid!'}
        }      
    },
    password: {
        value: 'demo@pricld.com',
        notValid: false, 
        helperText: '',
        validation: { 
          required: {errorMessage: 'Password is required!'},
        }      
    }      
  }
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
    }    
  };

  const [user, setUser] = useState(initUser);  
  const { authRedirectPath, onSetAuthRedirectPath } = props;

  useEffect(() => {
    if (authRedirectPath !== '/') {
      onSetAuthRedirectPath();
    }
  }, [authRedirectPath, onSetAuthRedirectPath]);

  useEffect(() => {
    //Check for error field
    if(props.error.field){
      //Set error message for specific field
      setUser(prevUser => {
        const updatedUser = {...prevUser};
        updatedUser[props.error.field] = {...prevUser[props.error.field], notValid: true, helperText: props.error.message};
        return updatedUser;
      })
    }
  }, [props.error]);  

  const emailChangeHandler = event => {
    setUser({...user, email: {...user.email, value: event.target.value}});
  };

  const passwordChangeHandler = event => {
    setUser({...user, password: {...user.password, value: event.target.value}});
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
      //Set redux action in order to send request
      props.onSignIn(user.email.value, user.password.value);
    }
  };

  const demoAccountHandler = event => {
    //Prevent form from submitting
    event.preventDefault();
    //Set demo user data
    setUser(demoUser);    
    //Set redux action in order to send request
    props.onSignIn(demoUser.email.value, demoUser.password.value);    
  };

  let authRedirect = null;
  if (props.isAuthenticated) {
    authRedirect = <Redirect to={props.authRedirectPath} />;
  }
  
  return (
    <Grid container component="main" className={classes.root}>
      {authRedirect}
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h2" variant="h5">
            Sign in
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
            <div className={classes.wrapper}>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={props.loading}
                >
                Sign In
                </Button>            
                {props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>          
            <Grid container>
              <Grid item xs>
                <Link href="/forgot-password" variant="body2">
                  {/* Implement forgot password logic */}
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={demoAccountHandler}>
                    {"Demo account"}
                </Link>                                  
              </Grid>              
              <Grid item>
                <Link href="/sign-up" variant="body2">
                    {"Don't have an account? Sign Up"}
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
      error: state.auth.error,
      isAuthenticated: state.auth.userId !== null,
      authRedirectPath: state.auth.authRedirectPath
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      onSignIn: (email, password) => dispatch(actions.signIn(email, password)),
      onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
  };

  export default connect(mapStateToProps, mapDispatchToProps)(SignIn);