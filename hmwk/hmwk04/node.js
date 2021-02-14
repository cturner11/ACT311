const library = [
    "The Way of Kings",
    "Words of Radiance",
    "Oathbringer",
    "Rhythm of War"
  ]

function printIt(item, index, theList) {
    console.log(index + '. ' + item);
}


library.forEach(printIt);