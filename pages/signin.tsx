import { NextPage } from 'next';
import FirebaseService, { withFirebase, FirebaseContext } from '../services/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import React, { useState, useContext } from 'react';
import firebase from 'firebase';
import Router from 'next/router';

type SignInPage = {
    firebase: FirebaseService | undefined;
}

const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
};

const SignInPage: NextPage<SignInPage> = ({firebase}) => {    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    var onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (firebase) {
            firebase.doSignInWithEmailAndPassword(email, password)
                .then(() => {
                    setEmail('');
                    Router.push('/');
                })
                .catch((error: any) => {
                    setError(error.message);
                });
        }
    };

    return firebase ? (
        <React.Fragment>
            <form onSubmit={onSubmit} className="hidden">
                <input
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                />
                <button disabled={password === '' || email === ''} type="submit">
                    Sign In
                </button>
                {error && <p>{error}</p>}
            </form>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth} />
        </React.Fragment>

    )
        : (null);
}

export default withFirebase(SignInPage)