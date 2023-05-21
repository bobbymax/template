import React from "react";
import emptyList from "../../assets/images/empty.png";

const EmptyData = ({ text = "" }) => {
  return (
    <div className="add-expenses">
      <div className="content_center">
        <div className="inner__content">
          <img
            className="empty__img"
            src={emptyList}
            alt="Another empty folder"
          />
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyData;
