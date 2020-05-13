import React from "react";
import "./style.css";


function Picture(props) {
    return (
            <img
                className={props.class}
                onClick={() => props.handleClick(props.id)}
                alt={props.alt}
                src={props.image}
                
            ></img>
  );
}

export default Picture;