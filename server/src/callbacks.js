import { ClassicListenersCollector } from "@empirica/core/admin/classic";
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

  
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {

  if (stage.get("name") !== "choice") return;

  const players = stage.currentGame.players;
  const numPlayers = players.length;
  // updating this function to support scoring across several opponents
  for (const player of players) {
    const opponents = players.filter((p) => p.id !== player.id);
    const playerContribution = player.round.get("contribution");
    const opponentContributions = 0;
    for (const opponent of opponents) {
      opponentContributions = opponentContributions + opponent.round.get("contribution");
    }
    // score assumes the pot DOUBLES the amount of money contributed to it
    let score = ((2 * (playerContribution + opponentContributions)) / numPlayers);
    player.round.set("score", score);
    // pulls score attribute of player
    const currentScore = player.get("score") || 0;
    // sets their score as:
    //    initial endowment (set by default to 10)
    //  - their contribution 
    //  + their individual winnings from the round 
    //  + their current running total
    player.set("score", 10 - playerCont + score + currentScore);
  }

});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});
