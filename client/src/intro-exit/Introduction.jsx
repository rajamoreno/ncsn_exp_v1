import React from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";

export function Introduction({ next }) {

  const player = usePlayer();

  function onClick(generosity) {
    console.log("you chose to contribute:", generosity);
    player.set("generosity", generosity);
    // player.set("submit", true);
}

  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Instructions and Introductory Question
      </h3>
      <div className="mt-2 mb-6">
        <p className="text-sm text-gray-500">
          The INSTRUCTIONS for the game go here.
          - instructions for playing the game
          - instructions for filling out the first question -- how generous are they?
          - once you fill out this question, it sets your "generosity" parameter as a player.
          - "generosity" is trait a for the purposes of network initialization
        </p>
      </div>
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
      <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}
