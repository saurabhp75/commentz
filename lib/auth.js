import React, { useState, useEffect, useContext, createContext } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { app, provider, auth } from './firebase';

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signinWithGitHub = () => {
    return signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        // const credential = GithubAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;

        // console.log(result);
        console.log('Signing In');

        // The signed-in user info.
        const user = result.user;
        setUser(user);
        return user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const { errorCode, errorMessage, email } = error;
        console.log(errorMessage);
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The AuthCredential type that was used.
        // const credential = GithubAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const signout = () => {
    return signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('Signing Out');
        setUser(false);
      })
      .catch((error) => {
        // An error happened.
        console.log(err.errorMessage);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log(user);
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setUser(user);
        // ...
      } else {
        // User is signed out
        setUser(false);
        // ...
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    signinWithGitHub,
    signout
  };
}
