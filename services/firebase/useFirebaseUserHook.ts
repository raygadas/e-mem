import { useEffect, useState } from "react";

const useFirebaseUserHook = (firebase : any) => {
    const [authUser, setAuthUser] = useState();

    useEffect(() =>{
       const unlisten = firebase.auth.onAuthStateChanged(
          (authUser:any) => {
            authUser
              ? setAuthUser(authUser)
              : setAuthUser(null);
          },
       );
       return () => {
           unlisten();
       }
    });

    return authUser
}

export default useFirebaseUserHook;