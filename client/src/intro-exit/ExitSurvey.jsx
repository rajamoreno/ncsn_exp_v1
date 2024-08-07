// client/src/intro-exit/ExitSurvey.jsx
// Refactored with ChatGPT 4o

import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Radio } from "../components/Radio";

export function ExitSurvey({ next }) {
  const labelClassName = "block text-sm font-medium text-gray-700 my-2";
  const inputClassName =
    "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm";
  const player = usePlayer();
  const opponentAnimalNames = player.get("opponentAnimalNames");
  const names = opponentAnimalNames;
  const [responses, setResponses] = useState(names.reduce((acc, name) => ({ ...acc, [name]: "" }), {}));
  const [guess, setGuess] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [mandatoryMessage, setMandatoryMessage] = useState("");

  // Handle changes in the response for each player
  function handleResponseChange(name, value) {
    setResponses(prev => ({ ...prev, [name]: value }));
  }

  // Handle changes in the guess input field
  const handleGuessChange = (e) => {
    const value = e.target.value;
    const isValid = value.match(/^\d*\.?\d*$/); // Validate floating point number

    if (isValid || value === "") {
      const numValue = parseFloat(value);
      if ((numValue >= 0 && numValue <= 100) || value === "") {
        setValidationMessage(""); // Clear message if valid
        setGuess(value); // Update guess if valid
      } else {
        setValidationMessage("Please enter a number between 0 and 100.");
      }
    } else {
      setValidationMessage("Please enter a valid floating point number.");
    }
  };

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    const numGuess = parseFloat(guess);
    const allQuestionsAnswered = Object.values(responses).every(response => response !== "");

    if (guess !== "" && !isNaN(numGuess) && numGuess >= 0 && numGuess <= 100 && validationMessage === "" && allQuestionsAnswered) {
      player.set("exitSurvey", {
        guess,
        playAgainResponses: responses,
      });
      next();
    } else {
      if (!allQuestionsAnswered) {
        setMandatoryMessage("Please answer all questions before submitting.");
      } else {
        setMandatoryMessage(""); // Clear message if all questions are answered
      }
      if (guess === "" || isNaN(numGuess) || numGuess < 0 || numGuess > 100) {
        setValidationMessage("Please enter a valid number between 0 and 100 before submitting.");
      }
    }
  }

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Alert title="Bonus">
        <p>
          Across the five rounds of the game, you earned <strong>{player.get("score")}</strong> tokens. We will convert this to a monetary bonus which will be transferred within the next week to you on your Prolific account.
        </p>
      </Alert>

      <form className="mt-12 space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Exit Survey</h3>
              <p className="mt-1 text-sm text-gray-500">Before completing this study, we have a few more questions for you.</p>
            </div>

            <div>
              <label className={labelClassName}>Please enter your best guess of the average amount of tokens contributed in the previous round across all {player.get("sizeOfNetwork")} players currently playing the game.</label>
              <input
                type="text"
                value={guess}
                onChange={handleGuessChange}
                placeholder="Enter your guess"
                className={inputClassName}
              />
              {validationMessage && <span style={{ color: "red" }}>{validationMessage}</span>}
            </div>

            <div className="space-y-8 mt-6">
              {names.map(name => (
                <div key={name}>
                  <label className={labelClassName}>{`Would you like to play with ${name} again?`}</label>
                  <div className="grid gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(score => (
                      <Radio
                        key={score}
                        selected={responses[name]}
                        name={`play-again-${name}`}
                        value={String(score)}
                        label={score === 1 ? "1 (I would NOT want to play with this player.)" : score === 7 ? "7 (I would DEFINITELY want to play with this player.)" : score}
                        onChange={(e) => handleResponseChange(name, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {mandatoryMessage && <span style={{ color: "red" }}>{mandatoryMessage}</span>}
            <br />
            <div className="mb-12">
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}