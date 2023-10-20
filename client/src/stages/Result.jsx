// client/src/stages/Result.jsx
// more header info probably wanted here
import React from "react";
import { Button } from "../components/Button";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

export function Result() {
    const player = usePlayer();
    const players = usePlayers();
    return (
        <div>
            <p>You contributed: {player.round.get("contribution")} token(s)</p>
            <p>Your opponents contributed: {player.round.get("opponentContributions")} token(s)</p>
            <br />
            <p>You got {player.round.get("roundWinnings")} token(s) from the collective pot.</p>
            <p>You now have a total of {player.get("score")} token(s) this round.</p>
            <br />
            <Button handleClick={() => player.stage.set("submit", true)}>
                Play Again!
            </Button>
        </div>
    );
}
