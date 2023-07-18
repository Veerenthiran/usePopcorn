import { useState } from "react";
import PropTypes from "prop-types";

const Containerstyle = {
  display: "flex",
  align: "center",
  gap: "16px",
};
const StarContainerstyle = {
  display: "flex",
  gap: "4px",
};

StarComponent.propTypes = {
  maxstar: PropTypes.number.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  classname: PropTypes.string,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func,
};

export default function StarComponent({
  maxstar = 5,
  color = "blue",
  size = 48,
  classname = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [stars, setStars] = useState(defaultRating);
  const [tempStar, setTempStar] = useState(0);

  function onHandleRating(stars) {
    setStars(stars);
    onSetRating(stars);
  }

  const Textstyle = {
    display: "flex",
    align: "center",
    lineHeight: "1.3",
    margin: "0",
    color: `${color}`,
    fontSize: `${size}px`,
  };

  return (
    <div style={Containerstyle} className={classname}>
      <div style={StarContainerstyle}>
        {Array.from({ length: maxstar }, (_, i) => (
          <Star
            key={i}
            full={tempStar ? tempStar >= i + 1 : stars >= i + 1}
            onRate={() => onHandleRating(i + 1)}
            onHoverIn={() => setTempStar(i + 1)}
            onHoverOut={() => setTempStar(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={Textstyle}>
        {messages.length === maxstar
          ? messages[tempStar ? tempStar - 1 : stars - 1]
          : tempStar || stars || ""}
      </p>
    </div>
  );
}

function Star({ onRate, full, onHoverOut, onHoverIn, color, size }) {
  const Statstyle = {
    width: `${size}px`,
    height: `${size}px`,
    cursor: "pointer",
    display: "block",
    color: `${color}`,
  };

  return (
    <span
      style={Statstyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={color}
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
