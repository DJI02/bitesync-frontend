import { Link } from "react-router-dom";
import React from "react";

function EventCard({ event }) {
  return (
    <Link
      to={`/view-event/${event.id}`}
      className="flex flex-col outline outline-1 p-3 font-['Inter'] bg-white rounded-lg w-full h-[150px]"
    >
      <div className="text-2xl text-start font-semibold line-clamp-1">
        {event.name}
      </div>
      <div className="text-left text-md text-gray-600">
        Hosted by {event.author}
      </div>
      <div className="mt-1 text-sm text-black whitespace-pre-line line-clamp-3">
        {event?.description.replace(/\n\n+/g, "\n") || "No Description Given"}
      </div>
    </Link>
  );
}

export default EventCard;
