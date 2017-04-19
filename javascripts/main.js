// Use AJAX | Promises to load all 3 JSON files
// Iterate over all JSON files and match the human with their appropriate pet(s)
// ES6-ify it all!
	// no more var (let, const)
	// FAT ARROW

$(document).ready(function(){

const outputContainer = $("#output");

const writeToDOM = function (humanArray) {
  let domString = "";
  for (let i = 0; i < humanArray.length; i++) {
    domString += `<div class="human row">`;
    domString += `<div class="col-sm-4">`;
    domString += `<img src="${humanArray[i].image}">`;
    domString += `<p>${humanArray[i].name}</p>`;
    domString += `</div>`;
    domString += `<div class="col-sm-8 overflow-row">`;
    for (let j = 0; j < humanArray[i].matches.length; j++){
      domString += `<div class="animal">`;
      domString += `<img src="${humanArray[i].matches[j].image}">`;
      domString += `<p>${humanArray[i].matches[j].name}</p>`;
      domString += `<p>${humanArray[i].matches[j].description}</p>`;
      domString += `</div>`;
    }
    domString += `</div>`;
    domString += `</div>`;
  }
  outputContainer.append(domString);
};

  const loadHumans = () => {
    return new Promise((resolve, reject) => {
      $.ajax("./database/humans.json")
      .done((data1) => resolve(data1.humans))
      .fail((error1) => reject(error1));
     });
  };

   const loadCats = () => {
    return new Promise((resolve, reject) => {
      $.ajax("./database/cats.json")
      .done((data2) => resolve(data2.cats))
      .fail((error2) => reject(error2));
    });
  };

   const loadDinos = () => {
    return new Promise((resolve, reject) => {
      $.ajax("./database/dinos.json")
      .done((data3) => resolve(data3.dinos))
      .fail((error3) => reject(error3));
    });
  };

    const loadDogs = () => {
    return new Promise((resolve, reject) => {
      $.ajax("./database/dogs.json")
      .done((data4) => resolve(data4.dogs))
      .fail((error4) => reject(error4));
    });
  };

  const myHumans = []; //create empty array to store info in
  const myAnimals = [];

  const checkForTypeMatch = (human, pet) => { //if the animals type is contained within human's interested in, return true
    const interestedInArray = human["interested-in"];
    const isMatchNumber = interestedInArray.indexOf(pet.type); //if returns -1, false
    if (isMatchNumber === -1){ // if not in array
      return false;
    } else {
      return true;
    }
  };

  const checkForKidFriendly = (human,pet) => {
  	const hasKids = human["has-kids"];
  	const isKidFriendly = pet["kid-friendly"];
  	let isMatched = true;
  	if(hasKids && !isKidFriendly){
  		isMatched = false;
  	}
  	return isMatched;
  };

  loadHumans().then((humans) => {
    humans.forEach((human) => {
      human.matches = []; //adds new key value pair. matches is an emply array, matches will be pushed in there
      myHumans.push(human);
    });

    Promise.all([loadDogs(), loadCats(), loadDinos()]) //function that returns the promise
          .then((result) => {
            result.forEach((xhrResult) =>{ //have to go into each array and grab animal out
              xhrResult.forEach((animal) =>{ //each time it goes through each loadCat, loadDinos, loadDogs
                myAnimals.push(animal);
              });
            });
            // console.log(myAnimals); //shows one giant array with all the animals
            for (let i = 0; i < myHumans.length; i++){
              for (let j = 0; j < myAnimals.length; j++){
                if (checkForTypeMatch(myHumans[i], myAnimals[j]) && checkForKidFriendly(myHumans[i], myAnimals[j])) {
                  myHumans[i].matches.push(myAnimals[j]);
                }
              }
            }
            console.log(myHumans);
            writeToDOM(myHumans);
          }).catch(function(errors){
          	console.log(errors);
          });
        });

 //         function writeDOM(){
  //         	$.each(myHumans, function(index, val){
  //         		console.log("I'm here")
  //         		console.log(index);
  //         		console.log(val);
  //         	$(".container").append(`<h1>${val.name}'s perfect pet is ${val.matches[0].name} the <img src="${val.matches[0].image}"></h1>`)
  //         });
  //         }
  //});






});