import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {

  const treatment = game.get("treatment");
  const numRounds = treatment;

  for (let i = 0; i < treatment.numRounds; i++) {
    const round = game.addRound({
      name: `Round ${i + 1}`,
    })
    round.addStage({name: "choice", duration:10000});
    round.addStage({name: "result", duration:10000});
  }

  const player = usePlayer();
  const players = usePlayers();
  var len = players.length;
  console.log("Number of participants: ", len);

  // this tags each player with an index variable
  for (let i = 0; i < len; i+=1) {
    player.set("index", i);
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
  }

  // console.log("peopleTraitA: ", peopleTraitA);
  // we select trait b from the shuffled array for trait a
  var peopleTraitB = shuffle(peopleTraitA);
  // console.log("peopleTraitB: ", peopleTraitB);

  // we now set values for homophily and acrophily
  var homophily = 0;
  var acrophily = 0.8;
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
  // we now populate a matrix, network, to hold the probability person i
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
      probMeet[i][j] = acrophily * Math.pow(((peopleTraitA[i] + peopleTraitA[j])/2), 2) + (1 - acrophily) * Math.pow(((peopleTraitB[i] + peopleTraitB[j])/2), 2);
      probLike[i][j] = homophily * ((1 - Math.abs(peopleTraitA[i] - peopleTraitA[j]))/2) + (1 - homophily) * ((1 - Math.abs(peopleTraitB[i] - peopleTraitB[j]))/2);
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

  // now we set the network as an attribute of the game so we can access it everywhere
  game.set("network", network);
  
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {

  if (stage.get("name") !== "Choice") return;

  // if the stage is result, we update all the scoring.
  // this portion will need to be updated pretty substantially to reflect
  // the new network adjacency matrix.
  console.log("starting scoring process...")

  const players = stage.currentGame.players;
  const numPlayers = players.length;
  console.log("number of players:");
  console.log(numPlayers);
  // updating this function to support scoring across several opponents
  for (const player of players) {
    console.log("current player id:");
    console.log(player.id);
    // updated for filtering opponents out of big network
    const opponents = players.filter((p) => network[player.index][p.index] == 1);
    const playerContribution = player.round.get("contribution");
    var opponentContributions = 0;
    for (const opponent of opponents) {
      console.log("current opponent id:");
      console.log(opponent.id);
      opponentContributions = opponentContributions + opponent.round.get("contribution");
      console.log("running opponent contribution total:");
      console.log(opponentContributions);
    }
    player.round.set("opponentContributions", opponentContributions);
    // roundWinnings assumes the pot DOUBLES the amount of money contributed to it
    // this value should be in the game config file though, so work on that
    let roundWinnings = ((2 * (playerContribution + opponentContributions)) / numPlayers);
    player.round.set("roundWinnings", roundWinnings);
    // pulls score attribute of player
    const currentScore = player.get("score") || 0;
    // sets their total score as:
    //    initial endowment (set by default to 10)
    //  - their contribution 
    //  + their individual winnings from the round 
    //  + their current running total
    player.set("score", 10 - playerContribution + roundWinnings + currentScore);
  }

});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});
