import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import { useAuth } from "../context/AuthContext";

import Loader from "../res/loader.gif";
import { Form } from "react-bootstrap";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./componentsCss/form.css";

export default function SignIn() {
  const { onSignIn, error, loading, showCaptch } = useAuth();
  const [flag, setFlag] = useState(false);

  function signInSubmit(e) {
    e.preventDefault();
    let phone = document.querySelector("#form-input").value.toString();
    if (phone.length >= 13) {
      showCaptch(phone);
      setFlag(false);
    } else {
      setFlag(true);
      setInterval(() => {
        setFlag(false);
      }, 2000);
    }
  }

  return (
    <div className="form-container">
      <div className="login-container">
        <form method="post">
          <h2 className="form-heading">Sign In</h2>

          <div className="form-group">
            <input
              className="form-control"
              id="form-input"
              type="tel"
              name="mobile"
              placeholder="+91 ######"
              style={flag ? { borderColor: "red" } : {}}
            />
            <Form.Text className="text-muted">
              {flag ? (
                <span style={{ color: "red" }}>Please check phone number</span>
              ) : (
                <span>Enter Phone Number with country code</span>
              )}
            </Form.Text>{" "}
          </div>

          <div className="form-group">
            <button
              className=" w-100 btn btn-primary btn-block"
              type="submit"
              onClick={signInSubmit}
              disabled={loading}
            >
              {loading ? (
                <img src={Loader} id="loader" alt="" />
              ) : (
                <span>Send OTP</span>
              )}
            </button>
          </div>
          <Link to="/signup" className="create-acc-btn mt-2">
            Create an account ?
          </Link>
        </form>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="recaptcha-container">
        <div id="recaptcha"></div>
      </div>
    </div>
  );
}
