import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import CircularProgress from '@material-ui/core/CircularProgress';
import PopUpMessage from '../../shared/popUpMessage';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Dashboard from '../../Dashboard';
import Aux from '../../hoc/Aux/Aux';

import { types, priorities, statuses} from '../Project/ProjectAtributes';
import { formatDate } from '../../shared/utility';
import Tasks from '../Tasks/Tasks';

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
    },
    titleColumn: {
      fontWeight: 'bold',
      backgroundColor: '#eaeaea'
    }
}));

const Project = (props) => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [projectDeletingId, setProjectDeleting] = useState(null);

  const projectId = props.history.location.pathname.replace('/view-project/', '') || '';
  const { loadedProject, userId, onProjectRead, onProjectDelete, deletedProjectId } = props;
  
  useEffect(() => {    
    //Check if project id is set
    if(projectId !== ''){
      onProjectRead(projectId, userId);
    }
  }, [projectId, userId, onProjectRead]);

  const deleteProjectHandler = (projectId) => {   
    setProjectDeleting(projectId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = () => {
    onProjectDelete(projectDeletingId);
    setProjectDeleting(null);
    setOpenDialog(false);
  }

  let projectRow = (
    <TableRow>
      <TableCell colSpan={4} align="center" padding="none">
        <CircularProgress size={20} style={{marginTop: '5px'}}/>
      </TableCell>              
    </TableRow>
  );
  let projectButtons = null;

  //Check if project is loaded
  if(loadedProject.id !== null){
    projectRow = (
      <Aux>
          <TableRow>
              <TableCell className={classes.titleColumn}>Name</TableCell>
              <TableCell colSpan={3}>{loadedProject.name}</TableCell>
          </TableRow> 
          <TableRow>
              <TableCell className={classes.titleColumn}>Description</TableCell>
              <TableCell colSpan={3}>{loadedProject.description}</TableCell>                            
          </TableRow>
          <TableRow>
              <TableCell className={classes.titleColumn}>Deadline</TableCell>
              <TableCell>{formatDate(loadedProject.deadline)}</TableCell>
              <TableCell className={classes.titleColumn}>Type</TableCell>
              <TableCell>{types[loadedProject.type]}</TableCell>        
          </TableRow> 
          <TableRow>
              <TableCell className={classes.titleColumn}>Priority</TableCell>
              <TableCell>{priorities[loadedProject.priority]}</TableCell>
              <TableCell className={classes.titleColumn}>Status</TableCell>
              <TableCell>{statuses[loadedProject.status]}</TableCell>        
          </TableRow>                  
      </Aux>
    );
    const editProjectLink = "/edit-project/"+loadedProject.id;
    projectButtons = (
      <Aux>
        <Button
            style={{ marginRight: '5px'}}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditIcon />}
            href={editProjectLink}
            title="Edit Project"
        >
            Edit
        </Button>
        <Button
            variant="contained"
            size="small"
            startIcon={<DeleteIcon />}
            title="Delete Project"
            onClick={() => deleteProjectHandler(loadedProject.id)}
        >
            Delete
        </Button>
      </Aux>
    );
  }
  //Check for deleted project
  if(deletedProjectId){
    return <Redirect to="/" />;
  }
  return (
    <Dashboard>
        {projectButtons}        
        <TableContainer component={Paper}>      
        <Table className={classes.table} aria-label="simple table" size="small" style={{marginTop: '10px'}}>
            <TableHead>                         
                <TableRow>
                    <TableCell colSpan={4} align="center" className={classes.title}>Project</TableCell>            
                </TableRow>          
            </TableHead>
            <TableBody>
                {projectRow}                             
                <TableRow>
                    <TableCell colSpan={4} align="center" className={classes.title}>Tasks</TableCell>
                </TableRow>                                                    
                <TableRow>
                    <TableCell colSpan={4} style={{padding:0}}>
                      <Tasks projectId={loadedProject.id} />
                    </TableCell>                                
                </TableRow>
            </TableBody>
        </Table>      
        {props.error ? <PopUpMessage message={props.error} type="error" open /> : null}   
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete project?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure that you want to delete this project? Confirming this action
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
    </Dashboard>
  );
}

const mapStateToProps = state => {
  return {    
    success: state.project.success,
    error: state.project.error,
    loading: state.project.loading,
    saving: state.project.saving,
    loadedProject: state.project.data,
    userId: state.auth.userId,
    deletedProjectId: state.project.deletedProjectId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onProjectRead: (projectId, userId) => dispatch(actions.projectRead(projectId, userId)),
    onProjectDelete: (projectId) => dispatch(actions.projectDelete(projectId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);