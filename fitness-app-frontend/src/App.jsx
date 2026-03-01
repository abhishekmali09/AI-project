import { Button } from "@mui/material";
import { useContext } from "react";
import { BrowserRouter as Router,Navigate, Route,Routes,useLocation} from "react-router";
import { useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
function App() {
  const {token,tokenData , logIn,logOut, isAuthenticated} = useContext(AuthContext);
  const dispatch = useDispatch();
  const[authReady,setAuthReady]= useState(false);
  useEffect(()=> {
   if (token){
     dispatch(setCredentials({token,user: tokenData}));
    setAuthReady(true);
    } 
  },[token,tokenData,dispatch]);
return(
  <Router>
    {!token ?(

    <Button variant="contained" color="#dcc004e"
            onClick={() => {
               logIn();
            }}>LOGIN </Button>
          ): (
            <div>
              <pre>{JSON.stringify(tokenData, null, 2)}</pre>
              <Button variant="contained" color="#dcc004e"
                      onClick={() => {
                        logOut();
                      }}>LOGOUT </Button>
            </div>
          )}

  </Router>
)

}

export default App