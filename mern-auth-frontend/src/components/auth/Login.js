import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import UserContext from '../../context/UserContext';
import errorNotice from '../mscer/errorNotice';

export default function Login() {
   
  const { email, setEmail} = useState();
  const { password, setPassword} = useState();
  const { error, setError } = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    try{
    const LoginUser = {email, password, };
    
    const loginRes = await Axios.post('http://localhost:5000/users/login', 
    LoginUser);
    
    setUserData({
    token: loginRes.data.token,
    user:  loginRes.data.user,
    });
    localStorage.setItem("auth-token", loginRes.data.token );
    history.push("/");

    }catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    
    <div className="login">
     <h1>Login</h1>
     {error && (
     <errorNotice message={error} clearError={()=> setError(undefined)} />)}
     <form className="regi-log-form"  onSubmit={submit}>
       <label htmlFor="email-login">Email</label>
       <input id="email-login" type="email" onChange={(e) => setEmail(e.target.value)}></input>
       <label htmlFor="password-login">Password</label>
       <input id="password-login" type="password" onChange={(e) => setPassword(e.target.value)} ></input>
       
       <input type="submit" value="login"  onChange={(e) => setEmail(e.target.value)}/> 

     </form>
    </div>
  )
}
