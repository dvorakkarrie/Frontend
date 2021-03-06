import React from "react";
import { Link } from "react-router-dom";

// {/* need to move items to event details still */}
const Event = props => {
  return (
    <div>
      <button
        className='delete-button'
        id={props.event._id}
        onClick={props.handleDelete}
      >
        -
      </button>
      <Link to={`/event/${props.event._id}`} className='event-row'>
        {props.event.eDescription}
      </Link>

    </div>
  );
};

export default Event;
