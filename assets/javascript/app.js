//Variables

//data contains all trivia questions as well as the selectable responses for the user.
//the first item (index(0) in the array is the photo file to display
//the second item (index(1) in the array is the correct accepted answer. The remaining items are the selectable user responses.
var data = {
	"Which boxer was known as 'The Greatest' and 'The People’s Champion'?": [
		"",
		"Muhammed Ali",
		"Sugar Ray Leonard",
		"Mike Tyson",
		"Jim Shorts"
	],
	"Which of these events is NOT part of a decathlon?": [
		"",
		"Hammer Throw",
		"Pole Vault",
		"Long Jump",
		"Hurdles"
	],
	"What year was the very first model of the iPhone released?": [
		"",
		"2007",
		"1999",
		"2013",
		"1987"
	],
	"What’s the shortcut for the “copy” function on most computers?": [
		"",
		"ctrl/cmd + c",
		"ctrl/cmd + x",
		"ctrl/cmd + v",
		"ctrl/cmd + shift + c"
	],
	"Which planet is the hottest in the solar system?": [
		"",
		"Venus",
		"Mercury",
		"Jupiter",
		"Earth"
	],
	"What is the symbol for potassium?": ["", "K", "Hg", "Fe", "Au"]
};
var keyIndex = -1;
var unselectedData = [];

//Functions

//This function returns a random number between the min and max parameters
function getRandomNumberBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//This function returns the length of an object
function getObjLength(obj) {
	return Object.keys(obj).length;
}

//populate unselectedData array
//this will be used to track which questions have been asked
for (var i = 0; i < getObjLength(data); i++) {
	unselectedData.push(i);
}

// while (unselectedData.length > 0) {
$("#test").on("click", function() {
	if (!unselectedData.length == 0) {
		keyIndex = getRandomNumberBetween(0, unselectedData.length - 1);
		keyIndex = unselectedData.pop(keyIndex);
		console.log("keyIndex: " + keyIndex);
		console.log("---------------------");
		var key_question = Object.keys(data)[keyIndex];
        console.log("Key (Question): " + key_question);
        $("#question").text(key_question)
		console.log("---------------------");
		console.log("Array(1) (Correct Answer): " + data[key_question][1]);
		console.log("---------------------");
		console.log("Array Length: " + unselectedData.length);
		console.log("---------------------");
		// }
    }
    else{//if unselectedData is empty. (All questions have been asked.)
        $("#question").fadeOut()
    }
});
