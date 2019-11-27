import React from 'react';
import App from 'next/app';
import FirebaseService, { FirebaseContext } from '../services/firebase';

import '../styles/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlayCircle, faSearch, faArrowLeft, faPowerOff, faArrowRight, faPlus} from '@fortawesome/free-solid-svg-icons'
library.add(faPlayCircle, faSearch, faArrowLeft, faPowerOff, faArrowRight, faPlus);

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        return (
            <FirebaseContext.Provider value={FirebaseService.getInstance()}>
                {<Component {...pageProps} />}
            </FirebaseContext.Provider>
        );
    }
}

export default MyApp;