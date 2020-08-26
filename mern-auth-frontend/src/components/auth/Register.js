import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import UserContext from '../../context/UserContext';
import errorNotice from '../mscer/errorNotice';


export default function Register() {
  
  const { email, setEmail} = useState();
  const { password, setPassword} = useState();
  const { passwordCheck, setPasswordCheck} = useState();
  const { displayName, setDisplayName} = useState();
  const { error, setError } = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();
  
  
  const submit = async (e) => {
    e.preventDefault();
    try{
    const newUser = {email, password, passwordCheck, displayName };
    const registerRes = await Axios.post('http://localhost:5000/users/register', 
    newUser);
    const loginRes = await Axios.post('http://localhost:5000/users/login', {
    email, password});
    
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
    
    <div className="regi">
     <h1>Register </h1>
     {error && (
     <errorNotice message={error} clearError={()=> setError(undefined)} />)}
     <form  className="regi-log-form" onSubmit={submit}>
       <label htmlFor="email-register">Email</label>
       <input id="email-register" type="email" onChange={(e) => setEmail(e.target.value)}></input>
       <label htmlFor="password-register">Password</label>
       <input id="password-register" type="password" onChange={(e) => setPassword(e.target.value)} ></input>
       <input   type="password" placeholder="Password verify" ></input>
       <label htmlFor="display-name-register">Display Name</label>
       <input id="display-name-register" type="text"onChange={(e) => setDisplayName(e.target.value)} ></input>
       <input type="submit" value="Register"  onChange={(e) => setEmail(e.target.value)}/> 

     </form>
    </div>
  )
}
