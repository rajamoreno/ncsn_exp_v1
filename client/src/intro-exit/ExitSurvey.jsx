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

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [strength, setStrength] = useState("");
  const [fair, setFair] = useState("");
  const [feedback, setFeedback] = useState("");
  const [education, setEducation] = useState("");

  // this array is an EXAMPLE -- I still need to port in the appropriate opponent animal names lists 
  const names = ["Lion", "Tiger", "Bear"];
  const [responses, setResponses] = useState(names.reduce((acc, name) => ({ ...acc, [name]: "" }), {}));

  function handleResponseChange(name, value) {
    setResponses(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault()
    player.set("exitSurvey", {
      age,
      gender,
      strength,
      fair,
      feedback,
      education,
      playAgainResponses: responses
    });
    next();
  }

  function handleEducationChange(e) {
    setEducation(e.target.value);
  }

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Alert title="Bonus">
        <p>
          Across the five rounds of the game, you earned <strong>{player.get("score")}</strong> tokens. We will convert this to a monetary bonus which will be transferred within the next week to you on your Prolific account.
        </p>
      </Alert>

      <form
        className="mt-12 space-y-8 divide-y divide-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Exit Survey
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Before completing this study, we have a few more questions for you. 
              </p>
            </div>

            <div className="space-y-8 mt-6">
              <div className="flex flex-row">
                <div>
                  <label htmlFor="email" className={labelClassName}>
                    Age
                  </label>
                  <div className="mt-1">
                    <input
                      id="age"
                      name="age"
                      type="number"
                      autoComplete="off"
                      className={inputClassName}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                </div>
                <div className="ml-5">
                  <label htmlFor="email" className={labelClassName}>
                    Gender
                  </label>
                  <div className="mt-1">
                    <input
                      id="gender"
                      name="gender"
                      autoComplete="off"
                      className={inputClassName}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClassName}>
                  Highest Education Qualification
                </label>
                <div className="grid gap-2">
                  <Radio
                    selected={education}
                    name="education"
                    value="high-school"
                    label="High School"
                    onChange={handleEducationChange}
                  />
                  <Radio
                    selected={education}
                    name="education"
                    value="bachelor"
                    label="US Bachelor's Degree"
                    onChange={handleEducationChange}
                  />
                  <Radio
                    selected={education}
                    name="education"
                    value="master"
                    label="Master's or higher"
                    onChange={handleEducationChange}
                  />
                  <Radio
                    selected={education}
                    name="education"
                    value="other"
                    label="Other"
                    onChange={handleEducationChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                <label className={labelClassName}>
                  How would you describe your strength in the game?
                </label>

                <label className={labelClassName}>
                  Do you feel the pay was fair?
                </label>

                <label className={labelClassName}>
                  Feedback, including problems you encountered.
                </label>

                <textarea
                  className={inputClassName}
                  dir="auto"
                  id="strength"
                  name="strength"
                  rows={4}
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                />

                <textarea
                  className={inputClassName}
                  dir="auto"
                  id="fair"
                  name="fair"
                  rows={4}
                  value={fair}
                  onChange={(e) => setFair(e.target.value)}
                />

                <textarea
                  className={inputClassName}
                  dir="auto"
                  id="feedback"
                  name="feedback"
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-8 mt-6">
              {/* New questions added dynamically */}
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
                        label={score === 1 ? "I would NOT want to play with this player." : score === 7 ? "I would DEFINITELY want to play with this player." : score}
                        onChange={(e) => handleResponseChange(name, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-12">
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}