import React from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";

export function Introduction({ next }) {

  const player = usePlayer();

  function onClick(generosity) {
    console.log("Player Pressed Button: ", generosity);
    // sets this as the player's most recent contribution 
    player.set("lastContribution", generosity);
    // scales the player's button press to a value in the range [0, 0.1, ... 0.9, 1]
    const traitA = generosity / 10;
    // sets this as traitA for access when constructing the game network.
    player.set("traitA", traitA);
    // player.set("submit", true);
    console.log("Player's 'traitA' is: ", traitA);
    next();
  }

  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Instructions and Introductory Question
      </h3>
      <div className="mt-2 mb-6">
        <p> The INSTRUCTIONS for the game go here. </p>
        <p> - instructions for playing the game </p>
        <p> - instructions for filling out the first question -- how generous are they? </p>
        <p> - once you fill out this question, it sets your "generosity" parameter as a player. </p>
        <p> - "generosity" is trait a for the purposes of network initialization </p>
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
    </div>
  );
}
