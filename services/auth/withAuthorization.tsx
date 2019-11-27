import React from 'react';
import Router from 'next/router';
import FirebaseService, { withFirebase } from '../firebase';
import AuthUserContext from './context';
import withAuthentication from './withAuthentication';

interface withAuthorizationProps {
    props: Readonly<withAuthorizationProps>;
    firebase: FirebaseService | undefined;
}
interface withAuthorizationState {}

// Consumes de authUser passed by withAuthentication.
const withAuthorization = (WrappedComponent: any) => {
    class WithAuthorization extends React.Component<withAuthorizationProps, withAuthorizationState> {
        listener: any;

        componentDidMount() {
            if (this.props && this.props.firebase && this.props.firebase.auth) {
                this.listener = this.props.firebase.auth.onAuthStateChanged(
                    (authUser: firebase.User | null) => {
                        if (!authUser) {
                            Router.replace('/signin');
                        }
                    },
                );
            }
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser => {
                        return (
                            authUser
                                ? <WrappedComponent {...this.props} authUser={authUser}/>
                                : null
                        )
                    }}
                </AuthUserContext.Consumer>
            );
        }
    }

    WithAuthorization.getInitialProps = async ctx => {
        const componentProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx));

        return { ...componentProps }
    }

    return withAuthentication(WithAuthorization);
};
export default withAuthorization;