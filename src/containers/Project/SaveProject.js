import React, {useState, useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import { Redirect } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import Avatar from '@material-ui/core/Avatar';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CircularProgress from '@material-ui/core/CircularProgress';

import projectStyles from './SaveProjectStyles';
import Dashboard from '../../Dashboard';
import PopUpMessage from '../../shared/popUpMessage';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';

import {validateData} from '../../utility/validation';


import {types, priorities, statuses} from '../Project/ProjectAtributes';

const Project = (props) => {
  const classes = projectStyles();

  const initProject = {
    name: {
      value: '',
      notValid: false, 
      helperText: '',
      validation: { 
        required: {errorMessage: 'Project name is required!'}
      }      
    },
    description: {
        value: '',
        notValid: false, 
        helperText: '',
        validation: { 
          required: {errorMessage: 'Project description is required!'}
        }
    },
    deadline: {
        value: '',
        notValid: false, 
        helperText: '',
        validation: { 
          required: {errorMessage: 'Project deadline is required!'},
          isDate: {errorMessage: 'Project deadline date is not valid!'}
        }
    },  
    type: {
        value: '',
        notValid: false, 
        helperText: '',
        validation: { 
            required: {errorMessage: 'Project type is required!'},
            isFixedValue: {
                validValues: Object.keys(types),
                errorMessage: 'Project type is not valid!'                
            }          
        }
    },  
    priority: {
        value: '',
        notValid: false, 
        helperText: '',
        validation: { 
            isFixedValue: {
                validValues: Object.keys(priorities),
                errorMessage: 'Project priority is not valid!'
            }
        }
    },  
    status: {
        value: '',
        notValid: false, 
        helperText: '',
        validation: { 
            required: {errorMessage: 'Project status is required!'},
            isFixedValue: {
                validValues: Object.keys(statuses),
                errorMessage: 'Project status is not valid!'
            }
        }
    }
  }  

  const [project, setProject] = useState(initProject);
  const [homeRedirect, setHomeRedirect] = useState(false);
  
  const projectId = props.history.location.pathname.replace('/edit-project/', '') || '';

  const { loadedProject, success, userId, onProjectRead } = props;

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {    
    //Check if project id is set
    if(projectId !== '' && !projectId.includes('add-project')){
      onProjectRead(projectId, userId);
    }
  }, [projectId, userId, onProjectRead]);

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  //Listen for success message
  useEffect(() => {
    //Check for success message
    if(success !== ''){
      setHomeRedirect(true);
    }
  }, [success, setHomeRedirect]);

  //Load project form data
  useEffect(() => {
    if(loadedProject.id !== null){
      setProject(prevProject => {
        return {
          id: loadedProject.id,
          name: {...prevProject.name, value: loadedProject.name},
          description: {...prevProject.description, value: loadedProject.description},
          deadline: {...prevProject.deadline, value: loadedProject.deadline},
          type: {...prevProject.type, value: loadedProject.type},
          priority: {...prevProject.priority, value: loadedProject.priority},
          status: {...prevProject.status, value: loadedProject.status}
        };
      });
    }
  }, [loadedProject]);

  //Check for home redirect
  if(homeRedirect){
    const link = "/view-project/"+loadedProject.id;
    return <Redirect to={link} />;
  }

  const nameChangeHandler = event => {
    setProject({...project, name: {...project.name, value: event.target.value}});
  };

  const descriptionChangeHandler = event => {
    setProject({...project, description: {...project.description, value: event.target.value}});
  };  

  const deadlineChangeHandler = event => {
    setProject({...project, deadline: {...project.deadline, value: event.target.value}});
  };  

  const typeChangeHandler = event => {
    setProject({...project, type: {...project.type, value: event.target.value}});
  };  

  const priorityChangeHandler = event => {
    setProject({...project, priority: {...project.priority, value: event.target.value}});
  };  

  const statusChangeHandler = event => {
    setProject({...project, status: {...project.status, value: event.target.value}});
  };

  const submitHandler = event => {
    //Prevent form from submitting
    event.preventDefault();       
    //Validate data
    const [isValid, projectUpdate] = validateData(project);
    //Set project data
    setProject(projectUpdate);    
    //If form is valid send request
    if(isValid){
      //Set project data for submitting request
      const projectData = {
        id: loadedProject.id,
        userId: props.userId,
        name: project.name.value,
        description: project.description.value,
        deadline: project.deadline.value,
        type: project.type.value,
        priority: project.priority.value,
        status: project.status.value
      }
      //Set redux action in order to send request
      props.onProjectSave(projectData);
    }else{
      //Set new project data
      setProject(projectUpdate);
    }
  };

  //Set menu lists
  const typeMenuList = Object.keys(types).map(
    type => {
      return(<MenuItem value={type} key={type}>{types[type]}</MenuItem>);
    }
  );
  const priorityMenuList = Object.keys(priorities).map(
    priority => {
      return(<MenuItem value={priority} key={priority}>{priorities[priority]}</MenuItem>);
    }
  );
  const statusMenuList = Object.keys(statuses).map(
    status => {
      return(<MenuItem value={status} key={status}>{statuses[status]}</MenuItem>);
    }
  );  

  const form = (
    <form className={classes.form} noValidate onSubmit={submitHandler}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            autoComplete="off"
            name="projectName"
            variant="outlined"
            fullWidth
            id="projectName"
            label="Project Name"
            value={project.name.value}
            onChange={nameChangeHandler}
            error={project.name.notValid}
            helperText={project.name.helperText}
            disabled={props.saving}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            autoComplete="off"
            name="projectDescription"
            variant="outlined"
            fullWidth
            id="projectDescription"
            label="Project Description"
            value={project.description.value}
            onChange={descriptionChangeHandler}
            error={project.description.notValid}
            helperText={project.description.helperText}
            disabled={props.saving}
            multiline
            rows="3"            
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            type="date"
            autoComplete="off"
            name="projectDeadline"
            variant="outlined"
            fullWidth
            id="projectDeadline"
            label="Project Deadline"
            value={project.deadline.value}
            onChange={deadlineChangeHandler}
            error={project.deadline.notValid}
            helperText={project.deadline.helperText}
            disabled={props.saving}
            InputLabelProps={{
                shrink: true,
            }}
          />            
        </Grid>   
        <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth error={project.type.notValid} required>
                <InputLabel ref={inputLabel} id="type-label">
                    Type
                </InputLabel>
                <Select
                labelId="type-label"
                id="type"
                value={project.type.value}
                onChange={typeChangeHandler}
                labelWidth={labelWidth}      
                disabled={props.saving}          
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {typeMenuList}
                </Select>
                {project.type.notValid ? <FormHelperText>{project.type.helperText}</FormHelperText> : null}
            </FormControl>             
        </Grid>
        <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth error={project.priority.notValid}>
                <InputLabel ref={inputLabel} id="priority-label">
                    Priority
                </InputLabel>
                <Select
                    labelId="priority-label"
                    id="priority"
                    value={project.priority.value}
                    onChange={priorityChangeHandler}
                    labelWidth={labelWidth}
                    disabled={props.saving}                
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {priorityMenuList}
                </Select>
                {project.priority.notValid ? <FormHelperText>{project.priority.helperText}</FormHelperText> : null}
            </FormControl>
        </Grid> 
        <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth error={project.status.notValid}>
                <InputLabel ref={inputLabel} id="status-label">
                    Status
                </InputLabel>
                <Select
                    labelId="status-label"
                    id="status"
                    value={project.status.value}
                    onChange={statusChangeHandler}
                    labelWidth={labelWidth}
                    disabled={props.saving}                
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {statusMenuList}
                </Select>
                {project.status.notValid ? <FormHelperText>{project.status.helperText}</FormHelperText> : null}
            </FormControl>
        </Grid>               
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
          Save Project
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
            <AssignmentIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Project
          </Typography>                    
          {props.loading ? <CircularProgress className={classes.loading} /> : form}        
        </div>
      </Container>    
      {props.error ? <PopUpMessage message={props.error} type="error" open /> : null}
      {success ? <PopUpMessage message={success} type="success" open /> : null}
    </Dashboard>
  );
  return content;
}

const mapStateToProps = state => {
  return {    
    success: state.project.success,
    error: state.project.error,
    loading: state.project.loading,
    saving: state.project.saving,
    loadedProject: state.project.data,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onProjectRead: (projectId, userId) => dispatch(actions.projectRead(projectId, userId)),
    onProjectSave: (projectData) => dispatch(actions.projectSave(projectData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);