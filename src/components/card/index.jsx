import React from "react";
import "./card.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Card = ({ children, handleDeleteTask }) => {
  return (
    <div className="card">
      {children}
      <div className="card__actions">
        <FontAwesomeIcon
          icon={faTrash}
          className="card__icon"
          onClick={handleDeleteTask}
        />
      </div>
    </div>
  );
};

export default Card;
