import { createContext } from 'react';
import firebase from 'firebase/app';

const AuthUserContext = createContext<firebase.User | null>(null);
export default AuthUserContext;