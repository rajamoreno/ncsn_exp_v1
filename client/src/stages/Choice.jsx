// client/src/stages/Choice.jsx
// more header info probably wanted here
import React from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";

export function Choice() {

    const player = usePlayer();
    const opponentAnimalNames = player.get("opponentAnimalNames")
    const itemizedOpponentContributions = player.round.get("itemizedOpponentContributions");
    const totalOpponentContributions = player.round.get("totalOpponentContributions")

    function onClick(contribution) {
        console.log("player name:", player.get("name"));
        console.log("you chose to contribute:", contribution);
        player.round.set("contribution", contribution);
        player.set("lastContribution", contribution);
        player.stage.set("submit", true);
    }

    const createContributionButtons = () => {
        const buttons = [];
        for (let i = 0; i <= 10; i++) {
            buttons.push(
                <Button key={i} handleClick={() => onClick(i)}>{i}</Button>
            );
        }
        return buttons;
    };

    return (
    <div>
        {" "}
        <h2><strong>You are playing a public goods game.</strong></h2>
        <br />
        <p>Your nickname in this game is <strong>{player.get("animalName")}</strong>.</p>
        <br />
        <ul className="list-disc list-inside">
            <li>At the beginning of every round, you receive ten tokens.</li>
            <li>You may choose how much to contribute to the common pot.</li>
            <li>At the end of this round, the total number of tokens in the pot will be doubled.</li>
            <li>The pot will then be divided equally between everybody in the game.</li>
        </ul>
        <br />
        <p>The other players in this game are:</p>
        <br />
        {itemizedOpponentContributions && itemizedOpponentContributions.length > 0 ? (
                <ul>
                    {itemizedOpponentContributions.map((contribution, index) => (
                        <li key={index}>- {contribution[0]}</li>
                    ))}
                </ul>
            ) : opponentAnimalNames && opponentAnimalNames.length > 0 ? (
                <ul>
                    {opponentAnimalNames.map((name, index) => (
                    <li key={index}>{name}</li>
                    ))}
                </ul>
            ) : (
                <p>(No other players in this game.)</p>
            )}
        <br />
        <p><strong>How many tokens will you contribute?</strong></p>
        <br />
        <div className="flex w-sw justify-center">
            {createContributionButtons()}
        </div>
    </div>
    );
}
