import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const UserCreated = (props) => {
  //Set redirect to home
  const [redirectToHome, setRedirectToHome] = useState(false);
  //Set logout handler
  const logoutHandler = () => {
    //Redirect to home
    setRedirectToHome(true);
  }
  //Check for redirect to home
  if(redirectToHome){
    //Sign out user
    props.onSignOut();
    //Redirect to home
    return <Redirect to="/" />;
  }
  return (
    <div>
      <Dialog aria-labelledby="customized-dialog-title" open>
        <DialogTitle id="customized-dialog-title">
            Account successfully created!
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            We have sent a welcome message to the email address you used to sign up your account from Priority Calendar.
            Message contains a unique verification link. To verify your email address, click the link and sign into your account.
            You may have not received a verification message due to filtering by your email admin or due to a mistake in your email address.
          </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={logoutHandler} variant="contained" color="primary">
                OK
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
    return {
        onSignOut: () => dispatch(actions.signOut())        
    };
};
export default connect(null, mapDispatchToProps)(UserCreated);