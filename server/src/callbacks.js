// callbacks.js

import { ClassicListenersCollector } from "@empirica/core/admin/classic";
// import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
const { shuffle, sample } = require("simple-statistics");

export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {

  console.log("Starting game...");

  const treatment = game.get("treatment");

  console.log("Retrieved treatment...");

  console.log(treatment);

  for (let i = 0; i < treatment.numRounds; i++) {
    const round = game.addRound({
      name: `Round ${i + 1}`,
    })
    round.addStage({name: "choice", duration:60});
    round.addStage({name: "result", duration:60});
    console.log("Added round ", i, "...");
  }
  console.log("All rounds added...");

  const players = game.players;
  console.log("Successfully retrieved players...");

  var len = players.length;
  console.log("Successfully calculated number of players...");
  console.log("Number of players: ", len);

  // array of 100 wild animal names for anonymous player identification.
  // note that this implies you should *NEVER* play this game with more than 100 people.
  const wildAnimals = [
    "Lion",
    "Tiger",
    "Elephant",
    "Giraffe",
    "Zebra",
    "Cheetah",
    "Gorilla",
    "Kangaroo",
    "Koala",
    "Panda",
    "Polar Bear",
    "Grizzly Bear",
    "Brown Bear",
    "Black Bear",
    "Wolf",
    "Fox",
    "Coyote",
    "Deer",
    "Moose",
    "Elk",
    "Antelope",
    "Bison",
    "Hare",
    "Rabbit",
    "Squirrel",
    "Chipmunk",
    "Raccoon",
    "Skunk",
    "Opossum",
    "Beaver",
    "Otter",
    "Hedgehog",
    "Badger",
    "Bat",
    "Flying Fox",
    "Chimpanzee",
    "Bonobo",
    "Orangutan",
    "Gibbon",
    "Lemur",
    "Red Panda",
    "Ring-tailed Lemur",
    "Fossa",
    "Jaguar",
    "Leopard",
    "Panther",
    "Snow Leopard",
    "Lynx",
    "Bobcat",
    "Mountain Lion",
    "African Elephant",
    "African Buffalo",
    "Rhinoceros",
    "Hippopotamus",
    "Warthog",
    "Giraffe",
    "Okapi",
    "Gorilla",
    "Chimpanzee",
    "Baboon",
    "Mandrill",
    "Capybara",
    "Tapir",
    "Sloth",
    "Armadillo",
    "Aardvark",
    "Pangolin",
    "Crocodile",
    "Alligator",
    "Komodo Dragon",
    "Monitor Lizard",
    "Turtle",
    "Tortoise",
    "Snake",
    "Cobra",
    "Python",
    "Boa Constrictor",
    "Eagle",
    "Hawk",
    "Falcon",
    "Owl",
    "Penguin",
    "Albatross",
    "Pelican",
    "Seagull",
    "Swan",
    "Duck",
    "Goose",
    "Hummingbird",
    "Parrot",
    "Toucan",
    "Puffin",
    "Blue Jay",
    "Cardinal",
    "Woodpecker",
    "Sparrow",
    "Finch",
    "Robin",
    "Magpie",
    "Crow"
  ];

  // this loop does three things for each player: 
  // (1) it tags each player with an index variable
  // (2) it assigns each player an animal name.
  // (3) it sets a default "lastContribution" value, in case they are unable to
  //     complete the intro steps.
  
  for (let i = 0; i < len; i+=1) {
    players[i].set("index", i);
    console.log("Successfully tagged player ", i, " with an index...");
    players[i].set("animalName", wildAnimals[i]);
    console.log("Successfully set ", wildAnimals[i], " as the animal name of player ", i, "...");
    // IMPORTANT: the default contribution amount is set to 50 if a player fails to submit the introduction stage, but THIS IS MUTABLE
    const lastContribution = players[i].get("lastContribution") || 50;
    players[i].set("lastContribution", lastContribution);
    players[i].set("sizeOfNetwork", len)
  }

  // len is the number of participants in the game.
  // we use "var" syntax to permit global access.
  // for block-scope variables, we could use "let"
  // instead.
  // NOTE: this will come from the number of participants in the game
  //       which we should set by reference from the game config file

  // scores for participants in the "a" (target) behavior
  // as described in Dannals et al.
  var peopleTraitA = [];
  for (let i = 0; i < len; i+=1) {
    peopleTraitA[i] = players[i].get("traitA");
    // if that value equals 0, we let it equal 1 to avoid isolation in the network
    if (peopleTraitA[i] == 0) {
      peopleTraitA[i] = 1;
    }

  }

  // console.log("peopleTraitA: ", peopleTraitA);
  // we select trait b from a random permutation of the array for trait a
  var peopleTraitB = shuffle(peopleTraitA);
  // console.log("peopleTraitB: ", peopleTraitB);

  // we now set values for homophily and acrophily
  var homophily = treatment.homophily;
  var acrophily = treatment.acrophily;
  var network = [];

  // we construct a matrix to hold the probability person i
  // MEETS person j given their relative similarity in the 
  // target behavior (A) and all other behaviors (B) according
  // to the paper, pg. 13, for all dyads (i, j)
  var probMeet = [];
  for (let i = 0; i < len; i++) {
      probMeet[i] = [];
      for (let j = 0; j < len; j++) {
          probMeet[i][j] = 0;
      }
  }
  // we construct a matrix to hold the probability person i
  // LIKES person j given their relative similarity in the 
  // target behavior (A) and all other behaviors (B) according
  // to the paper, pg. 14, for all dyads (i, j)
  var probLike = [];
  for (let i = 0; i < len; i++) {
    probLike[i] = [];
    for (let j = 0; j < len; j++) {
        probLike[i][j] = 0;
    }
  }
  // we now construct a matrix, network, to hold the probability person i
  // IS CONNECTED TO person j given probMeet[i][j] and probLike[i][j].
  for (let i = 0; i < len; i++) {
    network[i] = [];
    for (let j = 0; j < len; j++) {
        network[i][j] = 0;
    }
  }

  // we populate the matrices now.
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      probMeet[i][j] = acrophily * ((peopleTraitA[i] + peopleTraitA[j])/2) + (1 - acrophily) * ((peopleTraitB[i] + peopleTraitB[j])/2);
      probLike[i][j] = homophily * (1 - Math.abs(peopleTraitA[i] - peopleTraitA[j])) + (1 - homophily) * (1 - Math.abs(peopleTraitB[i] - peopleTraitB[j]));
      // console.log("probMeet[", i, "][", j, "]: ", probMeet[i][j]);
      // console.log("probLike[", i, "][", j, "]: ", probLike[i][j]);
      let r1 = Math.random();
      let r2 = Math.random();
      if (r1 <= probMeet[i][j] && r2 <= probLike[i][j]) {
        network[i][j] = 1;
      } else {
        network[i][j] = 0;
      }
    }
  }

  // we set all the diagonal entries equal to 0 so we can filter opponents more easily
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (i == j) {
        network[i][j] = 0;
      }
    }
  }

  // this is an extra step to make the network symmetric (e.g. network[i][j] = network[j][i])
  // I didn't want to remove the prior asymmetrical construction before we ship this in case
  // we need to revert to asymmetry.

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (i > j) {
        network[i][j] = network[j][i];
      }
    }
  }

  // this code takes participants who didn't match with anyone during network assignment (e.g., all zeros in their row) 
  // and assigns them to a random other participant that ALREADY matched with at least one other participant
  // e.g. we partition the participants into those who made connections and those who did not.
  // then for all of those who did not, we randomly assign them a new connection among those who did
  for (let i = 0; i < len; i++) {

    let degree = 0;
    for (let j = 0; j < len; j++) {
      if (network[i][j] == 1) {
        degree++;
      }
    }

    if (degree == 0) { // this is where we want to randomly assort the degree-0 participant to another one
      console.log(players[i].get("animalName"), " didn't connect with any other players. We will randomly select a connection for them.")
      players[i].set("haveToRandomlyAssignConnection", "YES")
    } else {
      players[i].set("haveToRandomlyAssignConnection", "NO")
    }

  }

  for (let i = 0; i < len; i++) {
    if (players[i].get("haveToRandomlyAssignConnection") === "YES") {
      const arrayOfOtherParticipants = [];
      for (let k = 0; k < len; k++) {
        if (k !== i && players[k].get("haveToRandomlyAssignConnection") === "NO") {
          arrayOfOtherParticipants.push(k); // this should add only the indices of OTHER participants
          console.log(players[k].get("animalName"), " is eligible for connection to ", players[i].get("animalName"))
        }
      }
      newConnection = sample(arrayOfOtherParticipants, 1)[0];
      network[i][newConnection] = 1
      network[newConnection][i] = 1 // to preserve the symmetry of the network
    }
  }



  // now we set the network as an attribute of the game so we can access it everywhere
  game.set("network", network);

  // checking we stored it correctly
  networkCheck = game.get("network");

  // comparison:
  console.log("network:");
  console.log(network);
  console.log("networkCheck:");
  console.log(networkCheck);

  // now, we want to make sure the opponent animal names list is populated 

  for (const player of players) {

    // log the player's identifying info
    console.log("");
    console.log("-----");
    console.log("Player ID: ", player.id);
    console.log("Player Animal Name: ", player.get("animalName"));

    // filter the network to only include other players that are adjacent to the player
    const opponents = players.filter((p) => network[player.get("index")][p.get("index")] == 1);

    // log number of opponents
    const numOpponents = opponents.length;
    console.log("Number of Opponents: ", numOpponents);

    // instantiate opponentAnimalNames
    let opponentAnimalNames = [];
    for (let i = 0; i < numOpponents; i++) {
      opponentAnimalNames[i] = opponents[i].get("animalName");
    }
    player.set("opponentAnimalNames", opponentAnimalNames);

    console.log("Opponent Animal Names: ", player.get("opponentAnimalNames"));
  
  }
  
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {

  if (stage.get("name") !== "choice") return;

  // if the stage that is beginning now is choice, we add default values
  // for all player contributions, to avoid the problem of player dropout
  console.log("");
  console.log("-----");
  console.log("Starting default score setting process...")

  const players = stage.currentGame.players;
  const numPlayers = players.length;

  console.log("Number of players: ", numPlayers);
  
  for (const player of players) {

    // log the player's identifying info
    console.log("");
    console.log("-----");
    console.log("Player ID: ", player.id);
    console.log("Player Animal Name: ", player.get("animalName"));

    // propagate lastContribution to this round's contribution.
    console.log("Setting default contribution amount to lastContribution... ");
    player.round.set("contribution", player.get("lastContribution"));
    console.log("player.round.get('contribution'): ", player.round.get("contribution"))
    console.log("player.get('lastContribution'): ", player.get("lastContribution"))
  }
});

Empirica.onStageEnded(({ stage }) => {

  console.log("");
  console.log("-----");
  console.log("Checking stage name...");
  console.log("Stage name is ", stage.get("name"));

  if (stage.get("name") !== "choice") return;

  // if the stage that just ended was choice, we update all the scoring.

  console.log("Starting scoring process...")

  const players = stage.currentGame.players;
  const numPlayers = players.length;

  console.log("Number of players: ", numPlayers);

  for (const player of players) {

    // log the player's identifying info
    console.log("");
    console.log("-----");
    console.log("Player ID: ", player.id);
    console.log("Player Animal Name: ", player.get("animalName"));

    // grab the global network
    network = stage.currentGame.get("network");
    // console.log("network: ", network);

    // filter the network to only include other players that are adjacent to the player
    const opponents = players.filter((p) => network[player.get("index")][p.get("index")] == 1);

    // log number of opponents
    const numOpponents = opponents.length;
    console.log("Number of Opponents: ", numOpponents);

    // pull the player's individual contribution
    const playerContribution = player.round.get("contribution");
    console.log("Player Contribution: ", playerContribution);

    // initialize variables for storing opponent contributions
    let totalOpponentContributions = 0;
    let itemizedOpponentContributions = [];
    for (let i = 0; i < numOpponents; i++) {
      itemizedOpponentContributions[i] = [];
        itemizedOpponentContributions[i][0] = 0;
        itemizedOpponentContributions[i][1] = "defaultName";
    }

    // calculate and store opponent contributions
    for (const [index, opponent] of opponents.entries()) {

      // identifying information about the opponent
      console.log("Opponent ID: ", opponent.id);
      console.log("Opponent Animal Name: ", opponent.get("animalName"));

      // calculation of running total of ALL opponent contributions
      totalOpponentContributions = totalOpponentContributions + opponent.round.get("contribution");

      // adding a record for this opponent's name and contribution amount to the player.round
        // note that this line assumes that if something breaks, "nobody" is the default name
      itemizedOpponentContributions[index][0] = opponent.get("animalName") || "defaultName";
        // note that this line assumes that if something breaks, our default contribution is 0
      itemizedOpponentContributions[index][1] = opponent.round.get("contribution") || 0;

      // log running tally of opponent contributions
      console.log("Running Total of Opponent Contributions: ");
      console.log(totalOpponentContributions);

      // log running list of opponent contributions
      console.log("Running Itemized Opponent Contributions");
      console.log(itemizedOpponentContributions);

    }

    player.round.set("totalOpponentContributions", totalOpponentContributions);
    console.log("Total Opponent Contributions:", totalOpponentContributions);

    player.round.set("itemizedOpponentContributions", itemizedOpponentContributions);
    console.log("Itemized Opponent Contributions", itemizedOpponentContributions);

    // roundWinnings assumes the pot DOUBLES the amount of money contributed to it
    // this multiple should be in the game config file though, so work on that
    let roundWinnings = ((2 * (playerContribution + totalOpponentContributions)) / (1 + numOpponents));
    roundWinnings = Math.round(roundWinnings) // we round the winnings from the round to the nearest integer for simplicity
    console.log("Total Tokens in Pot just DOUBLED.")
    player.round.set("roundWinnings", roundWinnings);
    console.log("Round Winnings:", roundWinnings);
    // pulls score attribute of player
    const currentScore = player.get("score") || 0;
    console.log("Previous Score", currentScore);
    // sets their total score as:
    //    initial endowment (set by default to 100)
    //  - their contribution 
    //  + their individual winnings from the round 
    //  + their current running total
    player.set("score", 100 - playerContribution + roundWinnings + currentScore);
    console.log("Updated Score:", player.get("score"));
  }

});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});
