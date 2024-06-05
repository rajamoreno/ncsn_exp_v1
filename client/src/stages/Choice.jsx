// client/src/stages/Choice.jsx
// more header info probably wanted here
import React from "react";
import { Button } from "../components/Button";
import { usePlayer, useRound } from "@empirica/core/player/classic/react";

export function Choice() {

    const round = useRound();

    const player = usePlayer();
    const opponentAnimalNames = player.get("opponentAnimalNames")
    const itemizedOpponentContributions = player.round.get("itemizedOpponentContributions");
    const totalOpponentContributions = player.round.get("totalOpponentContributions")

    function onClick(contribution) {
        console.log("Player:", player.get("name"));
        console.log("You chose to contribute:", contribution);
        player.round.set("contribution", contribution);
        player.set("lastContribution", contribution);
        player.stage.set("submit", true);
    }

    const createContributionButtons = () => {
        const buttons = [];
        for (let i = 0; i <= 100; i += 25) {
            buttons.push(
                <Button key={i} handleClick={() => onClick(i)}>{i}</Button>
            );
        }
        return buttons;
    };

    return (
    <div>
        <h3>Welcome to Round {round.get("name")}!</h3>
        <p>You’re part of a group of 19 other Prolific participants who are playing the Group Decision Making Game simultaneously.  All players are assigned a position in a social network which determines with whom they’re playing the game.</p>
        <br/>
        <p>All players have been assigned an animal nickname. <strong>Your nickname is {player.get("animalName")}.</strong></p>
        <p>You’re playing this game with the following other players:</p>
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
        <p><strong>Now it’s time for you to make your decision for Round {round.get("name")}.  How many tokens would you like to contribute to the collective pot?</strong></p>
        <br />
        <div className="flex w-sw justify-center">
            {createContributionButtons()}
        </div>
        <br />
        <p>We’ve repeated the instructions below in case you want to refer back to them at any time.</p>
        <br />
        <p>Everyone playing the game begins each Round with 100 tokens.  The game proceeds as follows:</p>
        <ul className="list-disc list-inside">
            <li>First, all players are given the option to contribute any number of these tokens (in increments of 25) to the collective pot.  Any tokens not contributed are kept by the participant in their private bank.  All players are given 20 seconds to make their decision.</li>
            <li>Then, all tokens in the collective pot are doubled by the experimenter.</li>
            <li>Finally, the collective pot (now twice the original size) is evenly divided amongst all the participants and deposited in their private bank, regardless of whether or not they donated any tokens.</li>
        </ul>
        <br />
        <p>The game has five rounds total.  At the beginning of each round all players get another 100 tokens to play with.  At the end of all 5 rounds, any tokens in one’s private pot are converted to a monetary bonus at a rate of 100 tokens = $0.50.</p>
    </div>
    );
}
