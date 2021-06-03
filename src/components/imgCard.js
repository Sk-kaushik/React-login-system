import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { Alert } from "react-bootstrap";
import "./componentsCss/card.css";
import { useAuth } from "../context/AuthContext";

export default function ImgCard({
  setRejectedImages,
  setLikedImages,
  saveToLocalStorage,
  rejectedImages,
  isLast,
  setIsLast,
  likedData,
  rejectedData,
  setRejectedData,
  setLikedData,
  // userName,
}) {
  // const alreadyRemoved = [];

  const { currentUser } = useAuth();
  const [isRejected, setIsRejected] = useState(null);
  const [isLiked, setIsLiked] = useState(null);
  const [imgName, setImgName] = useState();

  const [people, setPeople] = useState([
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
  ]);
  // const swipe = (dir) => {
  //   const cardsLeft = people.filter(
  //     (person) => !alreadyRemoved.includes(person.name)
  //   );
  //   if (cardsLeft.length) {
  //     const toBeRemoved = cardsLeft[cardsLeft.length - 1].name; // Find the card object to be removed
  //     const index = db.map((person) => person.name).indexOf(toBeRemoved); // Find the index of which to make the reference to
  //     alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
  //     childRefs[index].current.swipe(dir); // Swipe the card!
  //   }
  // };

  function keyboardKeyPressed(e) {
    if (e.key === "ArrowRight") {
      console.log("right");
      onSwipe("right");
      // swipe("left");
    }
    if (e.key === "ArrowLeft") {
      console.log("left");
      onSwipe("left");
    }
    console.log("key pressed");
  }

  useEffect(() => {
    document.addEventListener("keydown", keyboardKeyPressed);
  }, [isLast, rejectedData, likedData]);

  const onSwipe = (direction, currentImgName) => {
    setImgName(currentImgName);
    if (direction === "left") {
      setIsRejected(true);
      setIsLiked(false);
      console.log("left");
      if (direction === "left") {
        setRejectedImages((prevArray) => [
          ...prevArray,
          { userName: currentUser.displayName, imgName: currentImgName },
        ]);
      }
    } else if (direction === "right") {
      setIsRejected(null);
      setIsLiked(true);
      console.log("right");
      setLikedImages((prevArray) => [
        ...prevArray,
        { userName: currentUser.displayName, imgName: currentImgName },
      ]);
    }
    if (currentImgName === people[0].name) {
      setIsLast(true);
      saveToLocalStorage();
    }
  };

  const onCardLeftScreen = (dir, name) => {};

  function userFromStorage() {
    if (
      (rejectedData && rejectedData.length > 0) ||
      (likedData && likedData.length > 0)
    ) {
      setIsLast(true);
    } else {
      return (
        <div className="tinder-card-container">
          {people.map((person) => {
            return (
              <TinderCard
                className="swipe"
                key={person.id}
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
            );
          })}
          {isRejected && (
            <Alert
              variant="danger"
              style={{ position: "absolute", bottom: "20px" }}
            >
              {currentUser.displayName + " rejected " + imgName}
            </Alert>
          )}
          {isLiked && (
            <Alert
              variant="success"
              style={{ position: "absolute", bottom: "20px" }}
            >
              {currentUser.displayName + " liked " + imgName}
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
            <h1 className="greet">Thank You, you have rated all the images</h1>
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
            </div>
          </div>
        </>
      )}
    </>
  );
}
