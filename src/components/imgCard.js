import React, { useState, useEffect, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import { Alert } from "react-bootstrap";
import "./componentsCss/card.css";
import { useAuth } from "../context/AuthContext";

const db = [
  {
    id: 5,
    name: "five",
    url: "./five.png",
  },
  {
    id: 4,
    name: "four",
    url: "./four.png",
  },
  {
    id: 3,
    name: "three",
    url: "./three.png",
  },
  {
    id: 2,
    name: "two",
    url: "./two.png",
  },

  {
    id: 1,
    name: "one",
    url: "./one.png",
  },
];
const alreadyRemoved = [];
let charactersState = db;

export default function ImgCard({
  setRejectedImages,
  setLikedImages,
  saveToLocalStorage,
  isLast,
  setIsLast,
  likedData,
  rejectedData,
}) {
  const { currentUser } = useAuth();
  const [isRejected, setIsRejected] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const [imgName, setImgName] = useState();
  const [imgDb, setImgDb] = useState(db);
  const [intervalCounter, setIntervalCounter] = useState(1000);
  const timeout = useRef();
  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  function keyboardKeyPressed(e) {
    if (e.key === "ArrowRight") {
      swipe("right");
    }
    if (e.key === "ArrowLeft") {
      swipe("left");
    } else {
      return;
    }
  }

  useEffect(() => {
    if (childRefs.length) {
      window.addEventListener("keydown", keyboardKeyPressed);
      timeout.current = setTimeout(() => {
        swipe("left");
        setIntervalCounter(intervalCounter + 1);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isLast, intervalCounter]);

  const onSwipe = (direction, currentImgName) => {
    setImgName(currentImgName);
    alreadyRemoved.push(currentImgName);

    if (direction === "left") {
      setIsRejected(true);
      setIsLiked(false);

      setRejectedImages((prevArray) => [
        ...prevArray,
        { userName: currentUser.displayName, imgName: currentImgName },
      ]);
    } else if (direction === "right") {
      setIsRejected(null);
      setIsLiked(true);
      console.log(childRefs);

      setLikedImages((prevArray) => [
        ...prevArray,
        { userName: currentUser.displayName, imgName: currentImgName },
      ]);
    }

    if (currentImgName === db[0].name) {
      setIsLast(true);
      saveToLocalStorage();
    }
  };

  const onCardLeftScreen = (dir, name) => {
    charactersState = charactersState.filter(
      (character) => character.name !== name
    );

    setImgDb(charactersState);
  };

  const swipe = (dir) => {
    try {
      const cardsLeft = imgDb.filter(
        (person) => !alreadyRemoved.includes(person.name)
      );

      if (cardsLeft.length) {
        const toBeRemoved = cardsLeft[cardsLeft.length - 1].name;

        const index = db.map((person) => person.name).indexOf(toBeRemoved);

        alreadyRemoved.push(toBeRemoved);
        if (index >= 0) {
          childRefs[index].current.swipe(dir);
        }
      } else {
        return;
      }
    } catch {}
  };

  function userFromStorage() {
    if (
      (rejectedData && rejectedData.length > 0) ||
      (likedData && likedData.length > 0)
    ) {
      setIsLast(true);
    } else {
      return (
        <div className="tinder-card-container">
          {imgDb.map((person, index) => {
            return (
              <>
                <TinderCard
                  ref={childRefs[index]}
                  key={new Date().now}
                  className="swipe"
                  preventSwipe={["up", "down"]}
                  onSwipe={(dir) => {
                    onSwipe(dir, person.name);
                  }}
                  onCardLeftScreen={(dir) => onCardLeftScreen(dir, person.name)}
                >
                  <div
                    style={{
                      backgroundImage: `url(${person.url})`,
                    }}
                    className="card"
                  ></div>
                </TinderCard>
              </>
            );
          })}
          {isRejected && (
            <Alert
              variant="danger"
              style={{ position: "absolute", bottom: "20px" }}
            >
              {currentUser.displayName + ",you have rejected image " + imgName}
            </Alert>
          )}
          {isLiked && (
            <Alert
              variant="success"
              style={{ position: "absolute", bottom: "20px" }}
            >
              {currentUser.displayName + ",you have selected image " + imgName}
            </Alert>
          )}
        </div>
      );
    }
  }

  return (
    <>
      {currentUser && <div className="tinder-cards">{userFromStorage()}</div>}

      {isLast && (
        <>
          <div className="greet-container">
            <h1 className="greet">You have rated all the images,Thank You!</h1>
            <div className="greet-images">
              <div className="greet-images-data">
                <h4>
                  <span>&times;</span>
                  {rejectedData && rejectedData.length}
                </h4>
                <p>Rejected Images</p>
              </div>

              <div className="greet-images-data">
                <h4>
                  {" "}
                  <span>&#10084;</span>
                  {likedData && likedData.length}
                </h4>
                <p> Liked Images</p>
              </div>
            </div>
            {/* ------RESET AND CLEAR LOCAL STORAGE----------------
            
            <div className="reset-btn-container">
              <button
                onClick={(e) => {
                  setRejectedImages([]);
                  setLikedImages([]);
                  setLikedData([]);
                  setRejectedData([]);
                  setIsLiked(false);
                  setIsRejected(false);
                  setIsLast(false);
                  localStorage.removeItem(`${currentUser.uid}+liked`);
                  localStorage.removeItem(`${currentUser.uid}+rejected`);
                }}
              >
                Reset Data
              </button>
            </div> */}
          </div>
        </>
      )}
    </>
  );
}
