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

import Link from '@material-ui/core/Link';

import { types, priorities, statuses} from '../Project/ProjectAtributes';
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

export const Projects = (props) => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [projectDeletingId, setProjectDeleting] = useState(null);
  
  const { onProjectsLoad, onProjectDelete, userId, projects, deletedProjectId, onRemoveDeletedProject } = props;

  useEffect(() => {
    onProjectsLoad(userId);
  }, [onProjectsLoad, userId]);

  useEffect(() => {
    onRemoveDeletedProject(deletedProjectId);
  }, [onRemoveDeletedProject, deletedProjectId]);

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

  let tableContent = (
    <TableRow>
      <TableCell colSpan={6} align="center" padding="none">
        <Typography style={{padding: '5px', fontSize: 'inherit'}}>
            No projects defined!
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

  if(projects.length > 0){
    tableContent = projects.map(project => {
      const editProjectLink = "/edit-project/"+project.id;
      const viewProjectLink = "/view-project/"+project.id;
      return (
        <TableRow key={project.id}>
          <TableCell component="th" scope="row">
            <Link href={viewProjectLink} underline="none">
              {project.name}
            </Link>
          </TableCell>              
          <TableCell>{formatDate(project.deadline)}</TableCell>
          <TableCell>{types[project.type]}</TableCell>
          <TableCell>{priorities[project.priority]}</TableCell>
          <TableCell>{statuses[project.status]}</TableCell>
          <TableCell align="right">
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
                onClick={() => deleteProjectHandler(project.id)}
            >
                Delete
            </Button>                    
          </TableCell>
        </TableRow>
      )      
    });   
  }
  return (
    <TableContainer component={Paper}>      
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>          
          <TableRow>
            <TableCell colSpan={6} align="center" className={classes.title}>Projects</TableCell>            
          </TableRow>          
          <TableRow className={classes.columns}>
            <TableCell>Name</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<AddIcon />}
                    href="/add-project"
                    title="Add Project"
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
  );
}

const mapStateToProps = state => {
  return {    
    loading: state.projects.loading,
    projects: state.projects.projects,
    userId: state.auth.userId,
    error: state.project.error,
    deletedProjectId: state.project.deletedProjectId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onProjectsLoad: (userId) => dispatch(actions.loadProjects(userId)),
    onProjectDelete: (projectId) => dispatch(actions.projectDelete(projectId)),
    onRemoveDeletedProject: (projectId) => dispatch(actions.removeProjectOnDelete(projectId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);