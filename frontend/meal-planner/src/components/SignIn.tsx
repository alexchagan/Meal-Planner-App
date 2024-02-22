import React from 'react';
import { GoogleLogin } from '@react-oauth/google';


interface CredentialResponse {
  credential: any;
  clientId: string;
  select_by: string;
}

function SignIn() {
  const sendCredentialToBackend = async (credential: any, clientId: any) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/create_session', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential, clientId }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Credential sent to backend successfully');
        console.log('User ID:', responseData.user_id);
      } else {
        console.error('Failed to send credential to backend');
      }
    } catch (error) {
      console.error('Error sending credential to backend:', error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          sendCredentialToBackend(credentialResponse.credential, credentialResponse.clientId);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
}

export default SignIn;