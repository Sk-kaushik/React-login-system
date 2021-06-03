import React, { useEffect, useState } from "react";
import "./componentsCss/header.css";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import ExitBtn from "../res/exit.svg";

import Popover from "react-bootstrap/Popover";
import { NavLink } from "react-router-dom";

export default function Header() {
  const { currentUser, signOut } = useAuth();
  const [isUser, setIsUser] = useState();
  const history = useHistory();

  function signOutBtn() {
    try {
      signOut();
      setIsUser(null);
      history.push("/signin");
    } catch {
      console.log("error in sign out");
    }
  }

  useEffect(() => {
    if (currentUser) {
      setIsUser(currentUser);
    }
  }, [currentUser]);
  return (
    <header>
      <div className="header-container">
        <div className="brand">
          <h1>React Login System</h1>
        </div>
        <ul className="nav-links">
          {isUser && (
            <li>
              <OverlayTrigger
                trigger="hover"
                key={"bottom"}
                placement={"bottom"}
                overlay={
                  <Popover
                    id={`popover-positioned-${"bottom"}`}
                    style={{
                      border: "none",
                      marginTop: "5px",
                    }}
                  >
                    <Popover.Title
                      style={{ background: "#0d6efd", color: "white" }}
                    >
                      LogOut
                    </Popover.Title>
                  </Popover>
                }
              >
                <button className="signout-btn" onClick={signOutBtn}>
                  <img src={ExitBtn} alt="" />
                </button>
              </OverlayTrigger>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
