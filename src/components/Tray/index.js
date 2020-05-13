import React from "react";
import "../../assets/css/style.css";


function Tray(props) {
    return (
        <tr className="row d-flex justify-content-center">
            <td className="col-3">{props.text}</td>
            <td className={props.class}>{props.score}</td>
        </tr>
    )
}

export default Tray