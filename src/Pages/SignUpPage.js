import React, { useState } from 'react';
import Header from '../Components/Common/Header';
import SignupForm from '../Components/SignupComponents/SignupForm';
import LoginForm from '../Components/SignupComponents/LoginForm';


const SignUpPage = () => {

  const [flag, setFlag] = useState(false);

  return (
    <div>
      <Header />
      <div className='input-wrapper'>
        {!flag ? <h1>Signup</h1> : <h1>Login</h1>}
        {!flag ? <SignupForm /> : <LoginForm />}
        {!flag ? <p onClick={() => setFlag(!flag)}>Click here if you already have an Account. Click here to Login.</p> : <p onClick={() => setFlag(!flag)}>Don't have an Account. Click here to Signup.</p>}
      </div>
    </div>
  )
}

export default SignUpPage;