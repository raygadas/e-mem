import { createContext } from 'react';
import FirebaseService from './firebaseService'

const FirebaseContext = createContext<FirebaseService | null>(null);
export default FirebaseContext;