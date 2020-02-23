import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';

const SignOut = props => {
  const { onSignOut } = props;
  useEffect(() => {    
    onSignOut();
  }, [onSignOut]);

  return <Redirect to="/" />;
};

const mapDispatchToProps = dispatch => {
  return {
    onSignOut: () => dispatch(actions.signOut())
  };
};

export default connect(null,mapDispatchToProps)(SignOut);