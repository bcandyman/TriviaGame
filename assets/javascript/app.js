//Variables
var data = {}
var correctAnswers = 0;
var incorrectAnswers = 0;
var keyIndex = -1;
var key_question = "";
var unselectedData = [];
var userSelectableResponseItems = [];
var timer;
var timerActive = false;
var userGaveResponse = false;
var availableUserResponses = []

var imgTimer;
var imgTimerActive = false;
var triviaURL = "https://opentdb.com/api.php?amount=10";


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


function removeSpecialCharacters(str){
    var encodedStr = str;

    var parser = new DOMParser;
    var dom = parser.parseFromString(
        '<!doctype html><body>' + str,
        'text/html');
    var decodedString = dom.body.textContent;

    console.log(decodedString);

    return decodedString
}



function hideButtons(){
    for (var i = 1; i <= 4; i++){
        console.log("Hide" + i)
        $("#userOption-" + i).hide();
    }
}



function configureForm() {
    hideButtons()
	keyIndex = getRandomNumberBetween(0, unselectedData.length - 1); //randomly assigns an index value from unselectedData
	console.log("keyIndex: " + keyIndex);
	keyIndex = unselectedData.splice(keyIndex, 1); //Removed the selected item from unselectedData to keep from reasking a question
	key_question = data.results[keyIndex].question;
    key_question = removeSpecialCharacters(key_question) //remove special characters from the question.
	$("#question-text").text(key_question); //Display the question

    userSelectableResponseItems.push(data.results[keyIndex].correct_answer)
    console.log(userSelectableResponseItems)
    console.log("before for loop")
    console.log(data.results[keyIndex].incorrect_answers.length)
	for (var i = 0; i < data.results[keyIndex].incorrect_answers.length; i++) {
		//populate userSelecatableResponseItems. This is needed when randomizing the user options
		userSelectableResponseItems.push(data.results[keyIndex].incorrect_answers[i])
    }
    
    console.log(userSelectableResponseItems)

	var i = 0;
	while (userSelectableResponseItems.length > 0) {
		//This activates and populates user selectable radio buttons
		var selectableResponse = getRandomNumberBetween(
			0,
			userSelectableResponseItems.length - 1
		);
		selectableResponse = userSelectableResponseItems.splice(
			selectableResponse,
			1
		);
        i++;
        
        selectableResponse = removeSpecialCharacters(selectableResponse)

		$("#userOption-" + i).text(selectableResponse);
		$("#userOption-" + i).show();
	}

	timer = setTimeout(function() {
		//Activates the timer
		if (userGaveResponse === false && timerActive === true) {
			incorrectAnswers++;
			console.log("Times Up");
			displayImage();
		} else {
			timerActive = false;
			console.log("timerActive: " + timerActive);
		}
	}, 8000);
	timerActive = true;
	console.log("timerActive: " + timerActive);
	userGaveResponse = false;
	console.log("userGaveResponse: " + userGaveResponse);
}



function displayImage(answeredCorrect) {
	var imageQueryURL1 = "http://api.giphy.com/v1/gifs/search?q=";
	var imageQueryURLSearch = "";
	var imageQueryURL2 = "&api_key=eSqZO6ojSUC2LlqL8j6ip1Yycn1xHueV";

	if (answeredCorrect) {
		imageQueryURLSearch = "yay";
	} else {
		imageQueryURLSearch = "oh+no";
	}
	queryURL = imageQueryURL1 + imageQueryURLSearch + imageQueryURL2;
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response) {
		//   console.log(response)
		var imgUrl =
			response.data[getRandomNumberBetween(0, 24)].images.original.url;
		console.log(imgUrl);
		$(".testImg").attr("src", imgUrl);
		$(".testImg").show();
    });
	$(".testImg").show();
	imgTimer=setTimeout(function() {
        imgTimerActive=false;
        $("#result").text("")
        console.log("imgTimerActive: " + imgTimerActive)
		$(".testImg").hide();
		$(".testImg").attr("src", "");
		configureForm();
    }, 5000);
    imgTimerActive = true;
    console.log("imgTimerActive: " + imgTimerActive)
}


console.log("Hi there");
$.ajax({
    url: triviaURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
    data = response;
    for (var i = 0; i < data.results.length; i++) {
        unselectedData.push(i);
    }
    console.log("unselectedData")
    console.log(unselectedData);
});

// populate unselectedData array
// this will be used to track which questions have been asked



timerActive = false;
$(".testImg").hide();

$("#beginGame").on("click", function() {
	configureForm();
});

$(".option-button").on("click", function() {
	// console.log($("#" + this.id).text());
	var userSelection = $("#" + this.id).text();
	var correctAnswer = data.results[keyIndex].correct_answer //data[key_question][1];
	var isUserAnswerCorrect = false;
	userGaveResponse = true;
	// console.log("userGaveResponse: " + userGaveResponse);
    clearTimeout(timer);
    timerActive=false;
    // clearTimeout(imgTimer)
    // imgTimerActive=false;
    console.log(imgTimerActive)

    if(imgTimerActive === false){

	if (userSelection === correctAnswer) {
		isUserAnswerCorrect = true;
        correctAnswers++;
        $("#result").text("Correct!")
		console.log("correct answer");
	} else {
        incorrectAnswers++;
        $("#result").text("Oh no!")
		console.log("incorrect answer");
	}
	if (!unselectedData.length == 0) {
		displayImage(isUserAnswerCorrect);
		// configureForm()
	} else {
		$("#question").fadeOut();
		// resetRadioButtons()
		console.log("Correct: " + correctAnswers);
		console.log("Incorrect: " + incorrectAnswers);
    }
}
});
