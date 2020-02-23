import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

const profileStyles = makeStyles(theme => ({
    paper: {
      marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    loading: {
      margin: theme.spacing(10)
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    buttonProgress: {
      color: blue[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -8,
      marginLeft: -12,
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    error: {
      backgroundColor: theme.palette.error.dark,
      margin: theme.spacing(1)
    },
    errorMessage: {
      display: 'flex',
      alignItems: 'center'      
    }
}));

export default profileStyles;