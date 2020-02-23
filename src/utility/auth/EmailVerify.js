import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import PopUpMessage from '../../shared/popUpMessage';

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

const EmailVerify = (props) => {
  //Set classes
  const classes = makeStyles(styles);  
  const logoutHandler = () => {
    props.onSignOut();
  }
  const sendVerificationHandler = () => {
    props.onSendVerificationEmail();
  }  
  return (
    <div>
      <Dialog aria-labelledby="customized-dialog-title" open>
        <DialogTitle id="customized-dialog-title">
          Your email address is not verified!
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            When you first sign up, we send a welcome message to the email address you used to sign up your account from Priority Calendar.
            Message contains a unique verification link. To verify your email address, click the link and sign into your account.
          </Typography>
          <Typography gutterBottom>
            You may have not received a verification message due to filtering by your email admin or due to a mistake in your email address.
            Also, you can also re-send the verification message by clicking on "Send verification email" button.
          </Typography>                    
        </DialogContent>
        <DialogActions>
            {props.sending && <CircularProgress size={22} />}
            <Button
                variant="contained"
                color="secondary"
                className={classes.submit}
                disabled={props.sending}
                onClick={sendVerificationHandler}
            >
            Send verification email
            </Button>                        
            <Button onClick={logoutHandler} variant="contained">
            Exit
            </Button>
        </DialogActions>
      </Dialog>
      {props.error.message ? <PopUpMessage message={props.error.message} type="error" open /> : null}
      {props.success ? <PopUpMessage message={props.success} type="success" open /> : null}
    </div>
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
        onSignOut: () => dispatch(actions.signOut()),
        onSendVerificationEmail: () => dispatch(actions.sendVerificationEmail())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(EmailVerify);