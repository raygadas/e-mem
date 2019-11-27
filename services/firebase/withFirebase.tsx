import React from "react"
import { NextPageContext } from "next";
import { FirebaseContext } from ".";

const withFirebase = (WrappedComponent: any) => {
    const withFirebaseWrapper = (props: any) => {
        return (
            <FirebaseContext.Consumer>
                {firebase_service => {
                    return (<WrappedComponent {...props} firebase={firebase_service} />)
                }}
            </FirebaseContext.Consumer>
        )
    };

    withFirebaseWrapper.getInitialProps = async (ctx: NextPageContext) => {
        console.log("@withFirebase getInitialProps");

        const componentProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx));

        return { ...componentProps }

    };

    return withFirebaseWrapper;
};

export default withFirebase;