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
var giphyAPIKey = "eSqZO6ojSUC2LlqL8j6ip1Yycn1xHueV"
var isFlyOutActive = false;
var categoryValue = 0


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
    return dom.body.textContent;
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
	var imgQueryURLSearch = "";

	if (answeredCorrect) {
		imgQueryURLSearch = "yay";
	} else {
		imgQueryURLSearch = "oh+no";
	}
	queryURL = "http://api.giphy.com/v1/gifs/search?q=" + imgQueryURLSearch + "&api_key="+ giphyAPIKey
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
        closeFlyout()
    }, 5000);
    imgTimerActive = true;
    console.log("imgTimerActive: " + imgTimerActive)
}



function flyout(){
    // event.stopPropagation()
    if(!isFlyOutActive){
        var flyoutDiv = $("<div>")
        flyoutDiv.attr("id","flyout")
        flyoutDiv.addClass("flyout")
        flyoutDiv.html($("<H3>").text("Pick a category"))
        flyoutDiv.append($("<hr />"))
        // flyoutDiv.append($("<p>").text("Your Text"))
        flyoutDiv.hide()
        $(".content-body").append(flyoutDiv)
        flyoutDiv.fadeIn()
        isFlyOutActive = true;
    }
    else{
        closeFlyout()
    }
}



function closeFlyout(){
    if (isFlyOutActive){
        $("#flyout").fadeOut()
        setTimeout(() => {
            $("#flyout").remove()
        }, 1000);
        isFlyOutActive = false;
    }
}


function getTriviaData(){

    var queryURL = "https://opentdb.com/api.php?amount=10"
console.log("Hi there");
if(categoryValue !== 0){
    queryURL = queryURL + "&category=" + categoryValue
}
console.log(queryURL)
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
    data = response;
    for (var i = 0; i < data.results.length; i++) {
        unselectedData.push(i);
    }
    console.log("unselectedData")
    console.log(unselectedData);
    configureForm();
});
}
// populate unselectedData array
// this will be used to track which questions have been asked



timerActive = false;
$(".testImg").hide();



// $("#beginGame").on("click", function() {
// 	configureForm();
// });



$(".option-button").on("click", function() {
    // flyout()
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
        $("#result").text("Correct answer was: " + correctAnswer)
		console.log("incorrect answer");
	}
	if (!unselectedData.length == 0) {
		displayImage(isUserAnswerCorrect);
		// configureForm()
	} else {
        $("#question").fadeOut();
        // flyout()
		// resetRadioButtons()
		console.log("Correct: " + correctAnswers);
		console.log("Incorrect: " + incorrectAnswers);
    }
}
});









startUp()



function startUp(){
    var categories = {
        "Any":0,
        "General Knowledge":9,
        "Books":10,
        "Film":11,
        "Music":12,
        "Musical & Theatres":13,
        "Television":14,
        "Video Games":15,
        "Board Games":16,
        "Science & Nature":17,
        "Computers":18,
        "Mathematics":19,
        "Mythology":20,
        "Sports":21,
        "Geography":22,
        "History":23,
        "Politics":24,
        "Art":25,
        "Celebrities":26,
        "Animals":27,
        "Vehicles":28,
        "Comics":29,
        "Gadgets":30,
        "Japanese Anime & Manga":31,
        "Cartoon & Animations":32,
    }
    var categoryDiv = $("<div>")
    categoryDiv.addClass("btn-group-vertical text-center")
    categoryDiv.attr("role", "group")
    flyout()

    // <div class="btn-group text-center" role="group" aria-label="Basic example">
    var rowDiv = $("<div>")
    rowDiv.addClass("row")
    
    for ( var i = 1; i = 2; i++){

    }


    for ( var i = 1; i <= 25; i++){
        var categoryKey = Object.keys(categories)[i - 1]
        var btn = $("<button>")
        btn.addClass("category btn btn-secondary option-button")
        btn.attr("value", categories[categoryKey])
        btn.text(categoryKey)
        categoryDiv.append(btn)
    }
    $("#flyout").append(categoryDiv)
}


function setCategory(){
// console.log(this)
categoryValue =parseInt($(this).attr("value"))
console.log(categoryValue)
console.log($(this).attr("value"))
closeFlyout()
getTriviaData()
}


function buildStartMenu(){
    
}





$(document).on("click", ".category", setCategory);