import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import ImgCard from "./imgCard";
import Loader from "../res/loader.gif";

import "./componentsCss/home.css";

export default function Home() {
  const { currentUser, updateUser, loading } = useAuth();
  const [rejectedImages, setRejectedImages] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const [rejectedData, setRejectedData] = useState([]);
  const [likedData, setLikedData] = useState([]);

  function setUserDetail(e) {
    let user = document.querySelector(".user-name").value;
    updateUser(user);
  }

  function saveToLocalStorage() {
    if (rejectedImages !== null || likedImages !== null) {
      if (isLast) {
        if (rejectedImages.length > 0) {
          rejectedImages.forEach((rejectedImg, index) => {
            localStorage.setItem(
              `${currentUser.uid}+rejected`,
              JSON.stringify(rejectedImages)
            );
          });
        }
        if (likedImages.length > 0) {
          likedImages.forEach((likedImg, index) => {
            localStorage.setItem(
              `${currentUser.uid}+liked`,
              JSON.stringify(likedImages)
            );
          });
        }
      }
    }
  }

  function getDataFromLocalStorage() {
    try {
      if (localStorage.getItem(`${currentUser.uid}+rejected`) !== null) {
        let itemArray = JSON.parse(
          localStorage.getItem(`${currentUser.uid}+rejected`)
        );
        setRejectedData(itemArray);
      }
      if (localStorage.getItem(`${currentUser.uid}+liked`) !== null) {
        let itemArray = JSON.parse(
          localStorage.getItem(`${currentUser.uid}+liked`)
        );
        setLikedData(itemArray);
      }
    } catch {}
  }

  useEffect(() => {
    saveToLocalStorage();
    getDataFromLocalStorage();
    console.log(currentUser.uid);
  }, [isLast, currentUser.displayName]);

  return (
    <div className="home-container">
      {currentUser && currentUser.displayName ? (
        <>
          <h1 className="welcome-heading">
            Welcome <span>{currentUser.displayName}</span>
          </h1>
          <div className="home-card-container">
            <ImgCard
              setRejectedImages={setRejectedImages}
              setLikedImages={setLikedImages}
              saveToLocalStorage={saveToLocalStorage}
              rejectedImages={rejectedImages}
              isLast={isLast}
              setIsLast={setIsLast}
              userName={currentUser.displayName}
              rejectedData={rejectedData}
              likedData={likedData}
              setRejectedData={setRejectedData}
              setLikedData={setLikedData}
            />
          </div>
        </>
      ) : (
        <>
          <div id="name-form">
            <h3>Enter Your Name</h3>
            <div className="name">
              <input type="text" className="user-name" />
            </div>
            <button onClick={setUserDetail}>
              {loading ? (
                <img src={Loader} id="loader" alt="" />
              ) : (
                <span>Done</span>
              )}
            </button>
          </div>
          <div className="overlay"></div>
        </>
      )}
    </div>
  );
}
