import React, { useState } from "react";

// The event location (e.g., your office or a conference hall)
const EVENT_LOCATION = { lat: 6.675541, lng: -1.564151 };
const RADIUS_METERS = 100; // Allowed check-in distance

const AttendanceCheckIn = () => {
  const [status, setStatus] = useState("");

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleCheckIn = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = calculateDistance(
          latitude,
          longitude,
          EVENT_LOCATION.lat,
          EVENT_LOCATION.lng,
        );

        if (distance <= RADIUS_METERS) {
          setStatus("✅ Check-in Successful! You are on-site.");
          // Trigger your backend API call here
        } else {
          setStatus(
            `❌ Too far away. You are ${Math.round(distance)}m from the venue.`,
          );
        }
      },
      () => {
        setStatus("Please enable location access to check in.");
      },
    );
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Event Attendance</h2>
      <button
        onClick={handleCheckIn}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Tap to Check In
      </button>
      <p>{status}</p>
    </div>
  );
};

export default AttendanceCheckIn;
