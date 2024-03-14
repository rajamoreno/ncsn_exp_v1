// client/src/stages/Result.jsx
// more header info probably wanted here
import React from "react";
import { Button } from "../components/Button";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

export function Result() {
    const player = usePlayer();
    const itemizedOpponentContributions = player.round.get("itemizedOpponentContributions");
    const totalOpponentContributions = player.round.get("totalOpponentContributions")
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
            <Button handleClick={() => player.stage.set("submit", true)}>
                Play Again!
            </Button>
        </div>
    );
}
