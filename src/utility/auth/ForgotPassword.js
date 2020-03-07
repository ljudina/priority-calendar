import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
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
import HelpIcon from '@material-ui/icons/Help';
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
    backgroundImage: 'url(https://source.unsplash.com/n205UbNhy7E)',
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

export const ForgotPassword = props => {
  //Set classes
  const classes = useStyles();
  //Init email
  const initEmail = {
    email: {
      value: '',
      notValid: false, 
      helperText: '',
      validation: { 
        required: {errorMessage: 'Your email is required!'},
        isEmail: {errorMessage: 'Entered email is not valid!'}
      }      
    }    
  };
  //
  const [userEmail, setUserEmail] = useState(initEmail);  
  const { success } = props;

  useEffect(() => {
    //Check for error field
    if(props.error.field){
      //Set error message for specific field
      setUserEmail(prevUserEmail => {
        const updatedUserEmail = {...prevUserEmail};
        updatedUserEmail[props.error.field] = {...updatedUserEmail[props.error.field], notValid: true, helperText: props.error.message};
        return updatedUserEmail;
      })
    }
  }, [props.error]);  

  useEffect(() => {
    //Check for success message
    if(success !== ''){
      //Clear error message and email value
      setUserEmail(prevUserEmail => {
        const updatedUserEmail = {...prevUserEmail};
        updatedUserEmail['email'] = {...updatedUserEmail['email'], notValid: false, helperText: '', value: ''};
        return updatedUserEmail;
      })
    }
  }, [success]);
  
  const emailChangeHandler = event => {
    setUserEmail({...userEmail, email: {...userEmail.email, value: event.target.value}});
  };

  const submitHandler = event => {
    //Prevent form from submitting
    event.preventDefault();
    //Validate data
    const [isValid, userEmailUpdate] = validateData(userEmail);
    //Set new user data
    setUserEmail(userEmailUpdate);
    //If form is valid send request
    if(isValid){
      //Set redux action in order to send request
      props.onSendPasswordEmail(userEmail.email.value);
    }
  };
 
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <HelpIcon />
          </Avatar>
          <Typography component="h2" variant="h5">
            Forgot password
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
                value={userEmail.email.value}
                onChange={emailChangeHandler}
                error={userEmail.email.notValid}
                helperText={userEmail.email.helperText}
            />
            <div className={classes.wrapper}>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={props.sending}
                >
                Send a password reset email
                </Button>            
                {props.sending && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>          
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  You have remembered your password? Sign in
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
        {props.error.message ? <PopUpMessage message={props.error.message} type="error" open /> : null}
        {success ? <PopUpMessage message={success} type="success" open /> : null}
      </Grid>
    </Grid>
  );
}

const mapStateToProps = state => {
    return {
        success: state.auth.success,
        sending: state.auth.sending,
        error: state.auth.error
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        onSendPasswordEmail: (email) => dispatch(actions.sendPasswordEmail(email))
    };
  };

  export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);