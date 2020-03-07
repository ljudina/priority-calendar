import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PopUpMessage from '../../shared/popUpMessage';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { statuses } from '../Task/TaskAtributes';
import { formatDate } from '../../shared/utility';

const useStyles = makeStyles(theme => ({
    table: {
      minWidth: 650,
    },
    title: {
      backgroundColor: theme.palette.secondary.main,
      color: 'white'
    },
    columns: {
      backgroundColor: '#eaeaea'
    }
}));

export const Tasks = (props) => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [taskDeletingId, setTaskDeleting] = useState(null);
  
  const { projectId, onTasksLoad, onTaskDelete, tasks, deletedTaskId, onRemoveDeletedTask } = props;

  useEffect(() => {
    //Check if project is set
    if(projectId !== null){
      onTasksLoad(projectId);
    }    
  }, [onTasksLoad, projectId]);

  useEffect(() => {
    onRemoveDeletedTask(deletedTaskId);
  }, [onRemoveDeletedTask, deletedTaskId]);

  const deleteTaskHandler = (taskId) => {
    setTaskDeleting(taskId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = () => {
    onTaskDelete(taskDeletingId);
    setTaskDeleting(null);
    setOpenDialog(false);
  }

  let tableContent = (
    <TableRow>
      <TableCell colSpan={6} align="center" padding="none">
        <Typography style={{padding: '5px', fontSize: 'inherit'}}>
            No tasks defined!
        </Typography>                
      </TableCell>      
    </TableRow>      
  );
  let loadingRow = (
    <TableRow>
      <TableCell colSpan={6} align="center" padding="none">
        <CircularProgress size={20} style={{marginTop: '5px'}}/>
      </TableCell>
    </TableRow>
  );
  tableContent = props.loading ? loadingRow : tableContent;

  if(tasks.length > 0){
    tableContent = tasks.map(task => {
      const editTaskLink = "/edit-task/"+task.id;
      return (
        <TableRow key={task.id}>
          <TableCell component="th" scope="row">{task.name}</TableCell>
          <TableCell>{formatDate(task.deadline)}</TableCell>
          <TableCell>{statuses[task.status]}</TableCell>
          <TableCell align="right">
            <Button
                style={{ marginRight: '5px'}}
                variant="contained"
                color="primary"
                size="small"
                startIcon={<EditIcon />}
                href={editTaskLink}
                title="Edit Task"
            >
                Edit
            </Button>
            <Button
                variant="contained"
                size="small"
                startIcon={<DeleteIcon />}
                title="Delete Task"
                onClick={() => deleteTaskHandler(task.id)}
            >
                Delete
            </Button>                    
          </TableCell>
        </TableRow>
      )      
    });   
  }
  const addTaskLink = "/add-task/"+projectId;
  return (
    <TableContainer component={Paper}>      
        <Table className={classes.table} aria-label="simple table" size="small">
            <TableHead>                  
                <TableRow className={classes.columns}>
                    <TableCell>Name</TableCell>
                    <TableCell>Deadline</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            startIcon={<AddIcon />}
                            href={addTaskLink}
                            title="Add Task"
                        >
                            Add
                        </Button>       
                    </TableCell>
                </TableRow>
            </TableHead>    
            <TableBody>
                {tableContent}
            </TableBody>                                    
        </Table>     
        {props.error ? <PopUpMessage message={props.error} type="error" open /> : null}
        <Dialog
            open={openDialog}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Delete task?"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure that you want to delete this task? Confirming this action
                is not reversable.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDialogConfirm} color="primary">
                Yes
            </Button>
            <Button onClick={handleDialogClose} color="primary" autoFocus>
                No
            </Button>
            </DialogActions>
        </Dialog>      
    </TableContainer>
  );
}

const mapStateToProps = state => {
  return {    
    loading: state.tasks.loading,
    tasks: state.tasks.tasks,
    userId: state.auth.userId,
    error: state.tasks.error,
    deletedTaskId: state.task.deletedTaskId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTasksLoad: (userId) => dispatch(actions.loadTasks(userId)),
    onTaskDelete: (taskId, userId) => dispatch(actions.taskDelete(taskId, userId)),
    onRemoveDeletedTask: (taskId) => dispatch(actions.removeTaskOnDelete(taskId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);