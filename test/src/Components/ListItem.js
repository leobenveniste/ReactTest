import React from "react";
import { Link } from "react-router-dom";

export default function ListItem (props) {

    const cap = (text) => {
        return text[0].toUpperCase() + text.slice(1, text.length);
    }

    return (
        <Link to={'/item/' + props.item.name} key={props.item.id} className="flex-1 flex flex-col">
            <button title={cap(props.item?.name)} className="flex flex-col listBtn items-center">
                <div className="imgContainer flex flex-col items-center justify-center self-stretch">
                    <img src={props.item.image} alt={cap(props.item.name)} style={{minWidth: 'fit-content'}} />
                </div>
                <span className="py-1">{cap(props.item.name)}</span>
                <span style={{fontSize: '0.75em', fontWeight: '200'}}>#{props.item.id}</span>
            </button>
        </Link>
    )
}