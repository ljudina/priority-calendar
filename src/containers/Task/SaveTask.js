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
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import CircularProgress from '@material-ui/core/CircularProgress';

import saveTaskStyles from './SaveTaskStyles';
import {statuses} from '../Task/TaskAtributes';

import Dashboard from '../../Dashboard';
import PopUpMessage from '../../shared/popUpMessage';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';

import {validateData} from '../../utility/validation';

export const SaveTask = (props) => {
  const classes = saveTaskStyles();

  const initTask = {
    name: {
      value: '',
      notValid: false, 
      helperText: '',
      validation: { 
        required: {errorMessage: 'Task name is required!'}
      }      
    },
    deadline: {
        value: '',
        notValid: false, 
        helperText: '',
        validation: { 
          required: {errorMessage: 'Task deadline is required!'},
          isDate: {errorMessage: 'Task deadline date is not valid!'}
        }
    },  
    status: {
        value: '',
        notValid: false, 
        helperText: '',
        validation: { 
            required: {errorMessage: 'Task status is required!'},
            isFixedValue: {
                validValues: Object.keys(statuses),
                errorMessage: 'Task status is not valid!'
            }
        }
    }
  }  
  
  const [task, setTask] = useState(initTask);
  const [redirectToProject, setRedirectToProject] = useState(false);
  const [projectId, setProjectId] = useState(props.history.location.pathname.replace('/add-task/', ''));
  
  const taskId = props.history.location.pathname.replace('/edit-task/', '') || '';
  
  const { loadedTask, success, onTaskRead, onTaskSave } = props;

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {    
    //Check if task id is set
    if(taskId !== '' && !taskId.includes('add-task')){
      onTaskRead(taskId);
    }
  }, [taskId, onTaskRead]);

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  //Load task form data
  useEffect(() => {
    if(loadedTask !== undefined){
      if(loadedTask.id !== null){
        //Set project id
        setProjectId(loadedTask.projectId);
        //Set task id
        setTask(prevTask => {
          return {
            id: loadedTask.id,
            projectId: loadedTask.projectId,
            name: {...prevTask.name, value: loadedTask.name},
            deadline: {...prevTask.deadline, value: loadedTask.deadline},
            status: {...prevTask.status, value: loadedTask.status}
          };
        });
      }
    }
  }, [loadedTask]);

  //Listen for success message
  useEffect(() => {
    //Check for success message
    if(success !== ''){
      setRedirectToProject(true);
    }
  }, [success, setRedirectToProject]);

  //Check for home redirect
  if(redirectToProject && projectId){
    const link = "/view-project/"+projectId;
    return <Redirect to={link} />;
  }

  const nameChangeHandler = event => {
    setTask({...task, name: {...task.name, value: event.target.value}});
  };

  const deadlineChangeHandler = event => {
    setTask({...task, deadline: {...task.deadline, value: event.target.value}});
  };  

  const statusChangeHandler = event => {
    setTask({...task, status: {...task.status, value: event.target.value}});
  };

  const submitHandler = event => {
    //Prevent form from submitting
    event.preventDefault();       
    //Validate data
    const [isValid, taskUpdate] = validateData(task);
    //Set task data
    setTask(taskUpdate);
    //If form is valid send request
    if(isValid){
      //Set task data for submitting request
      const taskData = {
        id: loadedTask.id !== undefined ? loadedTask.id : null,
        projectId: projectId,
        name: task.name.value,
        deadline: task.deadline.value,
        status: task.status.value
      }
      //Set redux action in order to send request
      onTaskSave(taskData);
    }else{
      //Set new task data
      setTask(taskUpdate);
    }
  };

  //Set menu lists
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
            name="taskName"
            variant="outlined"
            fullWidth
            id="taskName"
            label="Task Name"
            value={task.name.value}
            onChange={nameChangeHandler}
            error={task.name.notValid}
            helperText={task.name.helperText}
            disabled={props.saving}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            type="date"
            autoComplete="off"
            name="taskDeadline"
            variant="outlined"
            fullWidth
            id="taskDeadline"
            label="Task Deadline"
            value={task.deadline.value}
            onChange={deadlineChangeHandler}
            error={task.deadline.notValid}
            helperText={task.deadline.helperText}
            disabled={props.saving}
            InputLabelProps={{
                shrink: true,
            }}
          />            
        </Grid>   
        <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth error={task.status.notValid}>
                <InputLabel ref={inputLabel} id="status-label" required>
                    Status
                </InputLabel>
                <Select
                    labelId="status-label"
                    id="status"
                    value={task.status.value}
                    onChange={statusChangeHandler}
                    labelWidth={labelWidth}
                    disabled={props.saving}                
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {statusMenuList}
                </Select>
                {task.status.notValid ? <FormHelperText>{task.status.helperText}</FormHelperText> : null}
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
          Save Task
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
            <AssignmentTurnedInIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Task
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
    success: state.task.success,
    error: state.task.error,
    loading: state.task.loading,
    saving: state.task.saving,
    loadedTask: state.task.data,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTaskRead: (taskId) => dispatch(actions.taskRead(taskId)),
    onTaskSave: (taskData) => dispatch(actions.taskSave(taskData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveTask);