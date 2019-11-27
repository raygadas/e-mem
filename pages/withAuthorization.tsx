import React from 'react'
import FirebaseService, { withFirebase } from "../services/firebase";
import Router from 'next/router';
import { AuthUserContext } from '../services/auth';
import { NextPageContext, NextPage } from 'next';

interface wrapperProps {
    firebase: FirebaseService | null;
}
  
interface wrapperState {
    
}

const withAuthorization = <P extends object>(WrappedComponent : NextPage<any, any>) => {
    class Wrapper extends React.Component<P & wrapperProps, wrapperState> {
        listener: any;
    
        static async getInitialProps(ctx: NextPageContext) {
            console.log("@dummyWrapper getInitialProps");
            const componentProps =
                WrappedComponent.getInitialProps &&
                (await WrappedComponent.getInitialProps(ctx));
            return { ...componentProps }
        };

        state = {
            authUser: null
        };

        
        // const [user, setUser] = useState();

        componentDidMount() {
            if (this.props.firebase && this.props.firebase.auth) {
                this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
                    this.setState({ authUser });
                    if (!authUser) {
                        Router.push("/signin")
                    }
                });
            }
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            const { authUser } = this.state;
            return (
                <AuthUserContext.Provider value={authUser}>
                    {!authUser ? null : (
                        <AuthUserContext.Provider value={authUser}>
                            <WrappedComponent {...this.props} user={authUser} />
                        </AuthUserContext.Provider>
                    )}
                </AuthUserContext.Provider>
            );
        }
    }
    return withFirebase(Wrapper);
};

export default withAuthorization;