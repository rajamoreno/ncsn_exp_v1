// MyPlayerForm.jsx

import React, { useState } from "react";
import { Button } from "./components/Button";

export function MyPlayerForm({ onPlayerID, connecting }) {
  // For the text input field.
  const [playerID, setPlayerID] = useState("");

  // Handling the player submitting their ID.
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!playerID || playerID.trim() === "") {
      return;
    }

    onPlayerID(playerID);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-xl font-semibold mb-4">Enter your Prolific ID</div>

      <form action="#" method="POST" onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <fieldset disabled={connecting} className="space-y-4">
            <label htmlFor="playerID">Prolific ID: </label>
            <input
                id="playerID"
                name="playerID"
                type="text"
                autoComplete="off"
                required
                autoFocus
                value={playerID}
                onChange={(e) => setPlayerID(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Prolific ID"
            />
          <Button
              type="submit"
              className="w-full" // Ensures the button takes full width
              primary // Optional: if you want to apply primary styles
            >
              Enter
            </Button>
        </fieldset>
      </form>
    </div>
  );
}