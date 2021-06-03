import React, { createContext, useContext, useEffect, useState } from "react";

import firebase, { auth } from "../firebase";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [currentUser, setCurrentUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [cap, setCap] = useState();
  let history = useHistory();
  let recaptchaVerifier;

  let captcha;

  function recaptchaShow(phone) {
    setLoading(true);
    setError("");
    if (!recaptchaVerifier) {
      console.log("phone");
      recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha", {
        size: "normal",
        callback: (response) => {
          onSignIn(phone, recaptchaVerifier);
        },
        "expired-callback": () => {
          setError("Timeout please try again");
        },
      });
      recaptchaVerifier.render();
      captcha = recaptchaVerifier;

      return recaptchaVerifier;
    }
    setCap(captcha);

    return captcha;
  }
  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged(function (user) {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
        history.push("/");
      } else {
        // No user is signed in.
        setCurrentUser(null);
        history.push("/signin");
      }
    });

    return unsubscribe;
  }, [currentUser, history, cap]);

  function showCaptch(phone) {
    console.log(phone);
    recaptchaShow(phone);
  }
  function onSignIn(phoneNumber, recaptchaVerifier) {
    // onSignIn(phone, recaptchaVerifier);
    // recaptchaVerifier = recaptchaShow();
    // -------To mimick verification------------
    // let phoneNumbe = "+911234567890";
    // let testVerificationOtp = "123456";
    // auth.settings.appVerificationDisabledForTesting = true;
    // console.log("sign In called");
    // // ------------------------------

    auth
      .signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setLoading(false);
        setError("");
        const code = prompt("Please Enter The OTP");
        confirmationResult
          // .confirm(testVerificationOtp)
          .confirm(code)
          .then((result) => {
            setCurrentUser(result.user);
          })
          .catch((error) => {
            setLoading(false);
            setError("OTP is wrong");
            if (recaptchaVerifier) {
              recaptchaVerifier.clear();
              setCap();
            }
          });
      })
      // Error in Captcha when otp is cancelled or wrong
      .catch((error) => {
        setLoading(false);
        setError("Sms not sent");
        if (recaptchaVerifier) {
          recaptchaVerifier.clear();
          setCap();
        }
      });
  }

  function signOut() {
    return auth
      .signOut()
      .then((res) => {
        setCurrentUser(null);
      })
      .catch((err) => setError("Error In Signing Out"));
  }

  function updateUser(userName) {
    currentUser
      .updateProfile({
        displayName: userName,
      })
      .then((res) => {
        setLoading(true);
      });
    setLoading(false);
    return currentUser;
  }

  function removeUser() {
    currentUser.updateProfile({
      displayName: null,
    });
    return currentUser;
  }

  const value = {
    currentUser,
    error,
    loading,
    onSignIn,
    signOut,
    updateUser,
    removeUser,
    showCaptch,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}
