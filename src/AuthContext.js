import { useContext, useState, useEffect, createContext } from "react"
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const AuthContext = createContext()
const firebaseConfig = {
    apiKey: "AIzaSyC8gcLnkEkvZ4osnSoUcBY1ZoizleHSLsw",
    authDomain: "adtv-64129.firebaseapp.com",
    projectId: "adtv-64129",
    storageBucket: "adtv-64129.appspot.com",
    messagingSenderId: "1051852504406",
    appId: "1:1051852504406:web:cfa882fc070b7de844aaf7"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            console.log(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    async function getToken() {
        return await getAuth().currentUser?.getIdToken()
    }

    const value = {
        currentUser,
        loading,
        getToken
    }

    return (
        <AuthContext.Provider value={value}>
            {
                loading ? <h1>Trying to log you in...</h1> : 
                currentUser ? children : 
                <h1 onClick={() => signInWithGoogle()}>Log in to continue</h1>
            }
        </AuthContext.Provider>
    )
}

function signInWithGoogle() {
    var provider = new GoogleAuthProvider();  
    signInWithPopup(auth, provider)
        .then(function (result) {
            var user = result.user;
            console.log('Signed in as: ' + user.displayName);
        })
        .catch(function (error) {
            console.error('Google Sign-In Error:', error);
        });
}