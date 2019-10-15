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
	"What is the symbol for potassium?": ["", "K", "Hg", "Fe", "Au"],
	"Which auto brand was the first to offer seat belts?": [
		"",
		"Nash Motors",
		"Volkswagen",
		"Ford"
	],
	"Adults have fewer bones than babies.": ["", "True", "False"]
};
var keyIndex = -1;
var unselectedData = [];
var userSelectableResponseItems = [];

//Functions

//This function returns a random number between the min and max parameters
function getRandomNumberBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//This function returns the length of an object
function getObjLength(obj) {
	return Object.keys(obj).length;
}

//This function returns the number of user selectable responses for a given question
function getObjArrayLen(obj, objKey) {
	return obj[objKey].length;
}

//populate unselectedData array
//this will be used to track which questions have been asked
for (var i = 0; i < getObjLength(data); i++) {
	unselectedData.push(i);
}

$("#test").on("click", function() {
	if (!unselectedData.length == 0) {
		keyIndex = getRandomNumberBetween(0, unselectedData.length - 1);
		keyIndex = unselectedData.splice(keyIndex, 1);
		var key_question = Object.keys(data)[keyIndex];
		$("#question").text(key_question);

		for (var i = 1; i < getObjArrayLen(data, key_question); i++) {
			userSelectableResponseItems[i - 1] = data[key_question][i];
		}

		var i = 0;
		while (userSelectableResponseItems.length > 0) {
			var selectableResponse = getRandomNumberBetween(
				0,
				userSelectableResponseItems.length - 1
			);
			selectableResponse = userSelectableResponseItems.splice(
				selectableResponse,
				1
			);
			i++;
			$("label[for='" + $("#userOption-" + i).attr("id") + "']").text(
				selectableResponse
			);
		}

		for (var i = 1; i < getObjArrayLen(data, key_question); i++) {
			// console.log(data[key_question][i])
			// $("label[for='" + $("#userOption-" + i).attr('id') + "']").text(data[key_question][i])
		}
	} else {
		//if unselectedData is empty. (All questions have been asked.)
		$("#question").fadeOut();
	}
});
