const tableData = document.getElementsByTagName("td");
var gameStarted = false;
var cardFlipped = false;
var numberOfTries = 0;
var firstClickedCard;
var secondClickedCard;
var firstCardColor;
var secondCardColor;
var firstCardFound;
var secondCardFound;


const COLORS = [
  "cross",
  "waves",
  "star",
  "circle",
  "square",
  "cross",
  "waves",
  "star",
  "circle",
  "square"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  
  
  var tdCount = 0;

  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it data attributes for the value we are looping over
    newDiv.setAttribute("data-color", `${color}`);
    newDiv.setAttribute("data-found", "false");
    newDiv.setAttribute("data-card", "true");

    //give it the class of facedown
    newDiv.classList.toggle("facedown");

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    //insert all the divs into a table  
    tableData[tdCount].appendChild(newDiv);
    tdCount++;
    
  }
}


function handleCardClick(event) {
  console.log(gameStarted);
  if(gameStarted){
    //first card flipped
    if(!cardFlipped){
      //find out if the card has been found
      firstClickedCard = event.target;
      firstCardFound = firstClickedCard.dataset.found;
      //if not, "flip" it over
      if(firstCardFound == "false"){
        console.log("first card");
        firstCardColor = firstClickedCard.dataset.color;
        firstClickedCard.classList.toggle("facedown");
        firstClickedCard.classList.toggle(firstCardColor);
        cardFlipped = true;
      }
    }
    //with one card flipped, try another
    else {
      //find out if the card has been found or is face up
      secondClickedCard = event.target;
      secondCardFound = secondClickedCard.dataset.found;
      let secondCardClass = secondClickedCard.className;
      console.log(secondCardClass);
      //if not "flip" it over
      if(secondCardFound == "false" && secondCardClass == "facedown"){
        console.log("second card");
        secondCardColor = secondClickedCard.dataset.color;
        secondClickedCard.classList.toggle("facedown");
        secondClickedCard.classList.toggle(secondCardColor);
        //if they don't match, pause for .5 sec and then flip back 
        if(firstCardColor != secondCardColor){
          gameStarted = false;
          setTimeout(function(){
            firstClickedCard.classList.toggle(firstCardColor);
            firstClickedCard.classList.toggle("facedown");
            secondClickedCard.classList.toggle(secondCardColor);
            secondClickedCard.classList.toggle("facedown");
            gameStarted = true;
          }, 1000);
        }
        //if they do match, mark them as found
        else{
          firstClickedCard.dataset.found = "true";
          secondClickedCard.dataset.found = "true";
        }
        cardFlipped = false;
        numberOfTries++;
        incrementTries();
      }
    }
  }
}

function startGame(event){
  //if the game hasn't started yet, then... start it - it's all ready to go
  if(!gameStarted){
    gameStarted = true;
    startButton.innerText = "Reset Game";
  }
  //otherwise, reset everything
  else{
    let cardArray = document.querySelectorAll('[data-card]');
    for(let i = 0; i < 10; i++){
      let cardColor = cardArray[i].dataset.color;
      cardArray[i].classList.remove(cardColor);
      cardArray[i].classList.remove("facedown");
      cardArray[i].classList.toggle("facedown");
    }
    let reshuffledColors = shuffle(COLORS);
    for(let j = 0; j < 10; j++){
      cardArray[j].setAttribute("data-color", reshuffledColors[j]);
      cardArray[j].setAttribute("data-found", "false");
    }
    numberOfTries = 0;
    let tryCounter = document.getElementById("trynumber");
    tryCounter.innerText = `${numberOfTries}`;
  }
}

function incrementTries(){
  let tryCounter = document.getElementById("trynumber");
  tryCounter.innerText = `${numberOfTries}`;
}

// when the DOM loads
createDivsForColors(shuffledColors);
startButton = document.getElementById("startbutton");
startButton.addEventListener("click", startGame);