import React from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import { Button } from "@mui/material";
import { postRequestGoogleLogin } from "~/utils/googleAuthServices";

export function GoogleRegister({ hanldeAuthInfo }) {
  //const handleLoginSuccess = postRequestGoogleLogin;

  async function handleLoginSuccess(credentialResponse) {
    const res = await postRequestGoogleLogin(credentialResponse);
    await hanldeAuthInfo(res);
  }
  // console.log(handleLoginSuccess);
  const id =
    "585906774881-ngbaaqsrej1640q06krlbic8u3f1j5d9.apps.googleusercontent.com";
  //  thay id bang auth client id
  return (
    <GoogleOAuthProvider clientId={id}>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log("Login Failed")}
          locale="en"
        />
      </div>
    </GoogleOAuthProvider>
  );
}

function LoginButton() {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <button
      onClick={() => login()}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#fffeee",
      }}
    >
      Login with Google
    </button>
  );
}
