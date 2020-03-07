import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CircularProgress from '@material-ui/core/CircularProgress';

import profileStyles from './ProfileStyles';
import Dashboard from '../../Dashboard';
import PopUpMessage from '../../shared/popUpMessage';

import {validateData} from '../../utility/validation';

export const Profile = (props) => {
  const classes = profileStyles();

  const initProfile = {
    name: {
      value: '',
      notValid: false, 
      helperText: '',
      validation: { 
        required: {errorMessage: 'Your name is required!'}
      }      
    },
    occupation: {
      value: '',
      notValid: false, 
      helperText: '',
      validation: null
    },
    userType: {
      value: 'individual',
      validation: null
    },
    company: {
      value: '',
      notValid: false, 
      helperText: '',
      validation: { 
        dependency: { key: 'userType', value: 'company' },
        required: {errorMessage: 'Company name is required!'},
      }      
    }
  }  

  const [profile, setProfile] = useState(initProfile);

  const { onProfileRead, loadedProfile, userId } = props;

  useEffect(() => {
    onProfileRead(userId);
  }, [onProfileRead, userId]);

  useEffect(() => {    
    if(loadedProfile.id){
      //Set loaded data
      setProfile(
        prevProfile => {
          return {
            ...prevProfile, 
            id: loadedProfile.id,
            name: {...prevProfile.name, value: loadedProfile.name},      
            occupation: {...prevProfile.occupation, value: loadedProfile.occupation},      
            userType: {...prevProfile.userType, value: loadedProfile.userType},      
            company: {...prevProfile.company, value: loadedProfile.company},          
          };
        }
      );
    }
  }, [loadedProfile]);

  const nameChangeHandler = event => {
    setProfile({...profile, name: {...profile.name, value: event.target.value}});
  };

  const occupationChangeHandler = event => {
    setProfile({...profile, occupation: {...profile.occupation, value: event.target.value}});
  };

  const userTypeChangeHandler = event => {
    const currentCompanyName = event.target.value === 'company' ? profile.company.value : '';
    let profileUpdate = {...profile};
    profileUpdate.userType = {...profile.userType, value: event.target.value};
    profileUpdate.company = {...profile.company, value: currentCompanyName};
    setProfile(profileUpdate);
  };

  const companyChangeHandler = event => {
    setProfile({...profile, company: {...profile.company, value: event.target.value}});
  };

  const submitHandler = event => {
    //Prevent form from submitting
    event.preventDefault();
    //Validate data
    const [isValid, profileUpdate] = validateData(profile);    
    //Set new profile data
    setProfile(profileUpdate);
    //If form is valid send request
    if(isValid){
      //Set profile data for submitting request
      const profileData = {
        id: loadedProfile.id,
        userId: props.userId,
        name: profile.name.value,
        occupation: profile.occupation.value,
        userType: profile.userType.value,
        company: profile.company.value
      }
      //Set redux action in order to send request
      props.onProfileSave(profileData);
    }else{
      //Set new profile data
      setProfile(profileUpdate);
    }
  };

  const form = (
    <form className={classes.form} noValidate onSubmit={submitHandler}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            autoComplete="off"
            name="yourName"
            variant="outlined"
            fullWidth
            id="yourName"
            label="Full Name"
            value={profile.name.value}
            onChange={nameChangeHandler}
            error={profile.name.notValid}
            helperText={profile.name.helperText}
            disabled={props.saving}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            autoComplete="off"
            name="yourOccupation"
            variant="outlined"
            fullWidth
            id="yourOccupation"
            label="Occupation"
            value={profile.occupation.value}
            onChange={occupationChangeHandler}
            error={profile.occupation.notValid}
            helperText={profile.occupation.helperText}
            disabled={props.saving}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" disabled={props.saving}>
            <FormLabel component="legend">I'm</FormLabel>
            <RadioGroup aria-label="userType" name="userType1" value={profile.userType.value} onChange={userTypeChangeHandler} row>
              <FormControlLabel value="individual" control={<Radio />} label="Individual" />
              <FormControlLabel value="company" control={<Radio />} label="Company" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {
          //Show field if company
          profile.userType.value !== 'company' ? null :
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              name="company"
              label="Company name"
              id="company"
              autoComplete="off"
              value={profile.company.value}
              onChange={companyChangeHandler}
              error={profile.company.notValid}
              helperText={profile.company.helperText}
              disabled={props.saving}
            />
          </Grid>                                             
        }                            
      </Grid>
      <div className={classes.wrapper}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={props.saving}
        >
          Save
        </Button>            
        {props.saving && <CircularProgress size={24} className={classes.buttonProgress} />}              
      </div>            
    </form>    
  );

  const content = (
    <Dashboard>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AccountCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profile
          </Typography>                    
          {props.loading ? <CircularProgress className={classes.loading} /> : form}        
        </div>
      </Container>    
      {props.error ? <PopUpMessage message={props.error} type="error" open /> : null}
      {props.success ? <PopUpMessage message={props.success} type="success" open /> : null}
    </Dashboard>
  );
  return content;
}

const mapStateToProps = state => {
  return {    
    success: state.profile.success,
    error: state.profile.error,
    loading: state.profile.loading,
    saving: state.profile.saving,
    loadedProfile: state.profile.data,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onProfileRead: (userId) => dispatch(actions.profileRead(userId)),
    onProfileSave: (profileData) => dispatch(actions.profileSave(profileData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);