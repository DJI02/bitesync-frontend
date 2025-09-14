import React, { useState } from "react";

function EventForm({ oldEvent, onSubmit, actionTitle, error }) {
  const [title, setTitle] = useState(oldEvent?.name || "");
  const [time, setTime] = useState(oldEvent?.dateAndTime || "");
  const [description, setDescription] = useState(oldEvent?.description || "");

  const event = {
    name: title,
    dateAndTime: time,
    description: description,
  };

  return (
    <div className="bg-white w-full p-8 rounded-lg font-['Inter'] flex flex-col">
      <h2 className="text-3xl font-bold text-center mb-8">{actionTitle}</h2>

      <div className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={127}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        {/* time box */}
        <div>
          <label className="block font-medium mb-1">Date/Time</label>
          <input
            placeholder="Time of Event"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border p-2 rounded-lg"
            maxLength={31}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            placeholder="Event Information"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded-lg"
            rows={4}
            maxLength={1023}
            required
          />
        </div>
        {/* button submit */}
        {error && <p className="text-red-500 text-bold text-lg">{error}</p>}
        <button
          type="submit"
          onClick={() => {
            onSubmit(event);
          }}
          className="w-full bg-[#7A5E48] text-white py-2 rounded-lg hover:bg-[#604836] transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default EventForm;
