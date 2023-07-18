import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarComponent from "./Star";

function NewStar() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarComponent
        maxstar={7}
        color="green"
        size={60}
        onSetRating={setMovieRating}
      />
      <p>This Movie was rated {movieRating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarComponent maxstar={5} color="red" size={48} classname="test" />
    <StarComponent maxstar={10} defaultRating={1} />
    <StarComponent
      maxstar={5}
      messages={["terriable", "Bad", "Okay", "Good", "Great"]}
    />
    <NewStar /> */}
  </React.StrictMode>
);
