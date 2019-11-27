import React from 'react';
import AuthUserContext from './context';
import FirebaseService, { withFirebase } from '../firebase';
import firebase from 'firebase/app';

interface WithAuthenticationProps {
  props: Readonly<WithAuthenticationProps>;
  firebase: FirebaseService | undefined;
}

interface WithAuthenticationState {
  authUser: firebase.User | null;
}

// Provides a context with a authUser, which is a firebase.User or it's null
const withAuthentication = (Component: any): any => {
  class WithAuthentication extends React.Component<WithAuthenticationProps, WithAuthenticationState> {
    listener: any;
    constructor(props: Readonly<WithAuthenticationProps>) {
      super(props);
      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      if (this.props && this.props.firebase && this.props.firebase.auth) {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
          (authUser) => {
            authUser
              ? this.setState({ authUser })
              : this.setState({ authUser: null });
          },
        );
      }
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props}/>
        </AuthUserContext.Provider>
      );
    }
  }
  return withFirebase(WithAuthentication);
};

export default withAuthentication;