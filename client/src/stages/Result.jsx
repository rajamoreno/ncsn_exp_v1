// client/src/stages/Result.jsx
// more header info probably wanted here
import React from "react";
import { Button } from "../components/Button";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";

export function Result() {
    const player = usePlayer();
    const players = usePlayers();
    // this next line gets ONE other person (suitable for TWO-PLAYER config.)
    // we're going to want to be a bit more careful with getting other players
    // (e.g the filtering function will be more intense) in the actual
    // implementation. this part will need to be unit tested and debugged
    // (a few hours to grapple and test)
    const opponent = players.filter((p) => p.id !== player.id)[0];
    return (
        <div>
            <p>You contributed: {player.round.get("contribution")} token(s)</p>
            <p>Your partner contributed: {opponent?.round?.get("contribution")} token(s)</p>
            <br />
            <p>You get {player.round.get("score")} token(s) from the collective pot.</p>
            *** this line is not calculating everything perfectly yet ***
            <p>You made {10 - player.round.get("contribution") + player.round.get("score")} token(s) this round.</p>
            <br />
            <Button handleClick={() => player.stage.set("submit", true)}>
                play again
            </Button>
        </div>
    );
}
