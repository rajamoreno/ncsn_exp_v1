// client/src/stages/Result.jsx
import React, { useState } from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";

export function Result() {

    const player = usePlayer();
    const itemizedOpponentContributions = player.round.get("itemizedOpponentContributions");
    const totalOpponentContributions = player.round.get("totalOpponentContributions")

    // State for the guess input and validation message
    const [guess, setGuess] = useState("");
    const [validationMessage, setValidationMessage] = useState("");

    // Handler for guess input changes
    const handleGuessChange = (e) => {
        const value = e.target.value;
        const isValid = value.match(/^\d*\.?\d*$/); // Regular expression for floating point numbers

        if (isValid || value === '') {
            // Check if the value is within the 0 to 10 range and is not empty
            const numValue = parseFloat(value);
            if (numValue >= 0 && numValue <= 10 || value === '') {
                setValidationMessage(''); // Clear message if valid
                setGuess(value); // Update guess if valid
            } else {
                setValidationMessage('Please enter a number between 0 and 10.');
            }
        } else {
            setValidationMessage('Please enter a valid floating point number.');
        }
    };

    // Example function to submit the guess
    // This is where you might interact with the player object or other parts of your app
    const submitGuess = () => {
        const numGuess = parseFloat(guess);
        if (guess !== "" && !isNaN(numGuess) && numGuess >= 0 && numGuess <= 10 && validationMessage === "") {
            console.log("Submitting guess:", guess);
            player.round.set("guessOfAverageCont", guess);
            player.stage.set("submit", true); // Move to the next stage after submitting
        } else {
            setValidationMessage('Please enter a valid number between 0 and 10 before submitting.');
        }
    };

    return (
        <div>
            <p>Your nickname in this game is <strong>{player.get("animalName")}</strong>.</p>
            <p>This round, you contributed {player.round.get("contribution")} token(s)</p>
            <br />
            <p>The other players in this game are:</p>
            {itemizedOpponentContributions && itemizedOpponentContributions.length > 0 ? (
                <ul>
                    {itemizedOpponentContributions.map((contribution, index) => (
                        <li key={index}>- {contribution[0]}</li>
                    ))}
                </ul>
            ) : (
                <p>(No other players in this game.)</p>
            )}
            <br />
            <p>Here's what they contributed this round:</p>
            {itemizedOpponentContributions && itemizedOpponentContributions.length > 0 ? (
                <ul>
                    {itemizedOpponentContributions.map((contribution, index) => (
                        <li key={index}>- {contribution[0]} contributed {contribution[1]} token(s)</li> // Format this line according to the structure of 'contribution'
                    ))}
                </ul>
            ) : (
                <p>(No other players in this game.)</p>
            )}
            <p>Together, the other players contributed {totalOpponentContributions} token(s) this round.</p>
            <br />
            <p>You received {player.round.get("roundWinnings")} token(s) from the collective pot.</p>
            <br />
            <p><strong>You now have a total of {player.get("score")} token(s).</strong></p>
            <br />
            <p>Guess the average amount of tokens everyone across the network gave this round:</p>
            <input 
                type="text"
                value={guess}
                onChange={handleGuessChange}
                placeholder="Enter your guess"
            />
            {validationMessage && <span style={{color: 'red'}}>{validationMessage}</span>}
            <Button handleClick={submitGuess}>
                Submit Guess
            </Button>
        </div>
    );
}
