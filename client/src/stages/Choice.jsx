// client/src/stages/Choice.jsx
// more header info probably wanted here
import React from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";

export function Choice() {
    const player = usePlayer();

    function onClick(contribution) {
        console.log("you chose to contribute:", contribution);
        player.round.set("contribution", contribution);
        player.stage.set("submit", true);
    }

    return (
    <div>
        {" "}
        <h2> You are playing a public goods game. </h2>
        <ul className="list-disc list-inside">
            <li>
                You start with ten tokens in your personal bank.
            </li>
            <li>
                You may choose how much to contribute to the common pot.
            </li>
            <li>
                At the end of this round, the total number of tokens in the pot will be doubled.
            </li>
            <li>
                The pot will then be divided equally between everybody in the game.
            </li>
        </ul>
        <br />
        <p><strong>How many tokens will you contribute?</strong></p>
        <div className="flex w-sw justify-center">
            <Button handleClick={() => onClick(0)}>0</Button>
            <Button handleClick={() => onClick(1)}>1</Button>
            <Button handleClick={() => onClick(2)}>2</Button>
            <Button handleClick={() => onClick(3)}>3</Button>
            <Button handleClick={() => onClick(4)}>4</Button>
            <Button handleClick={() => onClick(5)}>5</Button>
            <Button handleClick={() => onClick(6)}>6</Button>
            <Button handleClick={() => onClick(7)}>7</Button>
            <Button handleClick={() => onClick(8)}>8</Button>
            <Button handleClick={() => onClick(9)}>9</Button>
            <Button handleClick={() => onClick(10)}>10</Button>
        </div>
    </div>
    );
}
