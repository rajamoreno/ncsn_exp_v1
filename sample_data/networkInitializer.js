// Raja Moreno (assisted by ChatGPT)
// 13 February 2023
// Centrality and Social Norms
// This is a version of forexperiment.r written in JavaScript to support
// (incomplete) resources consulted
// - ChatGPT
// - R documentation
// - https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
// - https://stackoverflow.com/questions/8301400/how-do-you-easily-create-empty-matrices-javascript
// - https://www.geeksforgeeks.org/javascript-program-to-write-data-in-a-text-file/
// - 
// this program requires the simplestatistics package for JavaScript:
// https://simplestatistics.org
// follow installation instructions on the website.
// requirements:
const { sampleWithReplacement, shuffle } = require("simple-statistics");
const fs = require('fs');

console.log("Running simulation.");

// n is the number of participants in the game.
// we use "var" syntax to permit global access.
// for block-scope variables, we could use "let"
// instead.
// NOTE: this will come from the number of participants in the game
//       which we should set by reference from the game config file
var n = 25;
console.log("Number of participants: ", n);

// now we generate a random distribution of 0.1 to 1.0
// scores for participants in the "a" (target) behavior
// NOTE: this will be changed to accomodate the actual array of behaviors 
var scoreDistribution = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
// console.log("scoreDistribtion: ", scoreDistribution);
var peopleTraitA = sampleWithReplacement(scoreDistribution, n);
// console.log("peopleTraitA: ", peopleTraitA);
// we select trait b from the shuffled array for trait a
var peopleTraitB = shuffle(peopleTraitA);
// console.log("peopleTraitB: ", peopleTraitB);

// we now step through our four situations: 
for (let homophily = 0; homophily <= 0.8; homophily += 0.8) {
  for (let acrophily = 0; acrophily <= 0.8; acrophily += 0.8) {
    // we construct a matrix to hold the probability person i
    // MEETS person j given their relative similarity in the 
    // target behavior (A) and all other behaviors (B) according
    // to the paper, pg. 13, for all dyads (i, j)
    var probMeet = [];
    for (let i = 0; i < n; i++) {
        probMeet[i] = [];
        for (let j = 0; j < n; j++) {
            probMeet[i][j] = 0;
        }
    }
    // we construct a matrix to hold the probability person i
    // LIKES person j given their relative similarity in the 
    // target behavior (A) and all other behaviors (B) according
    // to the paper, pg. 14, for all dyads (i, j)
    var probLike = [];
    for (let i = 0; i < n; i++) {
      probLike[i] = [];
      for (let j = 0; j < n; j++) {
          probLike[i][j] = 0;
      }
    }
    // we now construct a matrix to hold the probability person i
    // IS CONNECTED TO person j given probMeet[i][j] and probLike[i][j].
    var network = [];
    for (let i = 0; i < n; i++) {
      network[i] = [];
      for (let j = 0; j < n; j++) {
          network[i][j] = 0;
      }
    }

    // we populate the matrices now.
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
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

    // set the text output file name
    if (homophily == 0) {
      if (acrophily == 0) {
        fileName = "LowHomophilyLowAcrophily.txt";
      } else {
        fileName = "LowHomophilyHighAcrophily.txt";
      }
    } else {
      if (acrophily == 0) {
        fileName = "HighHomophilyLowAcrophily.txt";
      } else {
        fileName = "HighHomophilyHighAcrophily.txt";
      }
    }

    // we initialize and populate the string representing the network
    // (for printing and writing to a file)
    let fileContents = "";
    fileContents += ("File Name: " + fileName + "\n");
    fileContents += ("Homophily Value: " + homophily + "\n");
    fileContents += ("Acrophily Value: " + acrophily + "\n");
    fileContents += ("TraitA: " + peopleTraitA + "\n");
    fileContents += ("TraitB: " + peopleTraitB + "\n");
    fileContents += ("Adjacency Matrix: " + "\n");
    for (let i = 0; i < n; i++) {
      fileContents += network[i].toString();
      fileContents += "\n";
    }
    console.log ("\n");
    console.log("*** Printing fileContents for homophily: ", homophily, " and acrophily: ", acrophily, "***");
    console.log(fileContents);
    
    if (homophily == 0) {
      if (acrophily == 0) {
        fileName = "LowHomophilyLowAcrophily.txt";
      } else {
        fileName = "LowHomophilyHighAcrophily.txt";
      }
    } else {
      if (acrophily == 0) {
        fileName = "HighHomophilyLowAcrophily.txt";
      } else {
        fileName = "HighHomophilyHighAcrophily.txt";
      }
    }

    console.log("Writing file: " + fileName);
    fs.writeFile(fileName, fileContents, (err) => {
      if (err) throw err;
    })
    console.log("Written file: " + fileName);

  }
}
