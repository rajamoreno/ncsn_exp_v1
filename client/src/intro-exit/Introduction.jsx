import React from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";

export function Introduction({ next }) {

  const player = usePlayer();

  // this function gets called when any of the contribution buttons are clicked.
  function onClick(generosity) {
    console.log("Player Pressed Button: ", generosity);
    // sets this as the player's most recent contribution 
    player.set("lastContribution", generosity);
    // we now scale the player's contribution to their traitA parameter like so:
    //  0   -> 0.1
    //  25  -> 0.3
    //  50  -> 0.5
    //  75  -> 0.7
    //  100 -> 0.9
    let traitA;
    switch(generosity) {
        case 0:
            traitA = 0.1;
            break;
        case 25:
            traitA = 0.3;
            break;
        case 50:
            traitA = 0.5;
            break;
        case 75:
            traitA = 0.7;
            break;
        case 100:
            traitA = 0.9;
            break;
        default:
            traitA = 0.0; // Default value in case something unexpected happens
    }
    console.log("Player's 'traitA' is: ", traitA);
    // sets this as traitA for access when constructing the game network.
    player.set("traitA", traitA);
    // player.set("submit", true);
    next();
  }

  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Welcome to the Group Decision Making Game! 
      </h3>
      <div className="mt-2 mb-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900"> 
          Instructions: 
        </h4>
        <p>Everyone playing the game begins each Round with 100 tokens.  The game proceeds as follows:</p>
        <ul className="list-disc list-inside">
          <li>First, all players are given the option to contribute any number of these tokens (in increments of 25) to the collective pot.  Any tokens not contributed are kept by the participant in their private bank.  All players are given 20 seconds to make their decision.</li>
          <li>Then, all tokens in the collective pot are doubled by the experimenter.</li>
          <li>Finally, the collective pot (now twice the original size) is evenly divided amongst all the participants and deposited in their private bank, regardless of whether or not they donated any tokens.</li>
        </ul>
        <p>The game has five rounds total.  At the beginning of each round all players get another 100 tokens to play with.  At the end of all 5 rounds, any tokens in one’s private pot are converted to a monetary bonus at a rate of 100 tokens = $0.50.</p>
        <p><strong>Round 1 has not yet begun.  Before it starts, please indicate using the buttons below how many tokens you wish to contribute to the collective pot.  You will then enter the game, learn about your fellow players and begin Round 1.</strong></p>
      </div>
      <div className="flex w-sw justify-center">
        <Button handleClick={() => onClick(0)}>0</Button>
        <Button handleClick={() => onClick(25)}>25</Button>
        <Button handleClick={() => onClick(50)}>50</Button>
        <Button handleClick={() => onClick(75)}>75</Button>
        <Button handleClick={() => onClick(100)}>100</Button>
      </div>
    </div>
  );
}
