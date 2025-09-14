import AttendeeCard from "./AtendeeCard";
import React, { useEffect, useState } from "react";
import api from "../../api";

// Half of the ViewEvent Page that will display the list of attendees
function AttendeeDisplay({ participants, eventError, passAllAllergies }) {
  const [users, setUsers] = useState([]); // State to hold the list of attendee user objects
  const [allAllergies, setAllAllergies] = useState([]); // State to hold the concatenated allergies of all attendees

  // Error and loading states
  const [loading, setLoading] = useState(true); // State to track loading status

  // Ref to prevent useEffect from triggering twice in development
  const hasFetchedRef = React.useRef(false);

  // Function to concatenate allergies from each attendee
  useEffect(() => {
    if (!participants || participants.length === 0) {
      setLoading(false);
      return;
    }

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const ids = participants.map((participant) => participant[0]);
    // Fetch user data for each participant
    (async () => {
      const Allergy = Promise.all(ids.map((id) => grabUser(id)));
      const allergyMap = (await Allergy).flat();
      const allergyCount = {};
      allergyMap.forEach((allergy) => {
        if (!allergy) return;
        const existingKey = Object.keys(allergyCount).find(
          (key) => key.toLowerCase() === allergy.toLowerCase()
        );
        if (existingKey) {
          allergyCount[existingKey] += 1;
        } else {
          allergyCount[allergy] = 1;
        }
      });
      setAllAllergies((prevAllergies) => ({
        ...prevAllergies,
        ...allergyCount,
      }));
      setLoading(false);
    })();
  }, [participants]);

  useEffect(() => {
    const sortedAllergies = Object.entries(allAllergies).sort(
      (a, b) => b[1] - a[1]
    );
    passAllAllergies(sortedAllergies);
  }, [allAllergies, passAllAllergies]);

  const grabUser = async (userID) => {
    try {
      const data = await api.post(`/account-mgr/info?accountID=${userID}`);
      const attendeeData = await data.data;
      setUsers((prevUsers) => [...prevUsers, attendeeData]);
      return attendeeData.tags;
    } catch (err) {
      console.error("Error fetching attendee info:", err);
      return;
    }
  };

  return (
    <div className="flex flex-col items-start justify-start min-w-[65%] p-6 gap-1">
      <h2 className="text-3xl font-semibold mb-4">
        {eventError
          ? "This Event Does Not Exist" // Displayed when there is an error fetching participants
          : participants?.length > 0
          ? "Attendees" // Displayed when there are one or more participants
          : "No Attendees"}
      </h2>
      {loading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-[175px] flex flex-col items-start justify-start p-4 bg-white rounded-lg shadow-md font-['Inter'] border-b-2 animate-pulse"
            ></div>
          ))
        : eventError
        ? null
        : participants?.map((participant, index) => (
            <AttendeeCard
              key={index}
              attendee={users.find((user) => user.id === participant[0])}
              recipes={participant.slice(0).filter((_, idx) => idx > 0)}
            />
          ))}
    </div>
  );
}

export default AttendeeDisplay;
