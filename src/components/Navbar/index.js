import React from "react";
import "../../assets/css/style.css";

function Navbar(props) {
  return (
    <nav className="navbar navbar-light bg-light height">
        <div className="col-4 pb-4 float-center">
        <h1>
          {props.title}
        </h1>
        </div>
    </nav>
  );
}

export default Navbar;
