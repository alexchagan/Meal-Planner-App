import React from 'react';
import {GoogleLogin, useGoogleLogin} from '@react-oauth/google';
import { Button } from '@mui/material';
import axios from 'axios';


function SignIn() {
 
    const googleLogin = useGoogleLogin({
        onSuccess: async tokenResponse => {
          console.log(tokenResponse);
          // fetching userinfo can be done on the client or the server
          const userInfo = await axios
            .get('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            })
            .then(res => res.data);
        
          console.log(userInfo);
        },
      });

    const handleSignInClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {     
        event.preventDefault();  
        googleLogin();
    };

    return (
          <Button onClick={handleSignInClick} > Sign in with Google</Button>)}

export default SignIn