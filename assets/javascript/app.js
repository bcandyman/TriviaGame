//Variables
var data = {};
var correctAnswers = 0;
var incorrectAnswers = 0;
var keyIndex = -1;
var key_question = "";
var unselectedData = [];
var userSelectableResponseItems = [];
var timer;
var timerActive = false;
var userGaveResponse = false;
var availableUserResponses = [];
var imgTimer;
var imgTimerActive = false;
var giphyAPIKey = "eSqZO6ojSUC2LlqL8j6ip1Yycn1xHueV";
var isFlyOutActive = false;
var categoryValue = 0;
var roundNum = 1;
var gameOver = false;
var lastQuestion = false;




function restart(){
correctAnswers = 0;
incorrectAnswers = 0;
keyIndex = -1;
key_question = "";
unselectedData = [];
userSelectableResponseItems = [];
timerActive = false;
userGaveResponse = false;
availableUserResponses = [];
imgTimer;
imgTimerActive = false;
isFlyOutActive = false;
gameOver = false;
lastQuestion = false;
}



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


function removeSpecialCharacters(str) {
    var encodedStr = str;
    var parser = new DOMParser();
    var dom = parser.parseFromString(
        "<!doctype html><body>" + str,
        "text/html"
    );
    return dom.body.textContent;
}



function hideButtons() {
    for (var i = 1; i <= 4; i++) {
        console.log("Hide" + i);
        $("#userOption-" + i).hide();
    }
}



function configureForm() {
    hideButtons();

    keyIndex = getRandomNumberBetween(0, unselectedData.length - 1); //randomly assigns an index value from unselectedData
    console.log("keyIndex: " + keyIndex);
    keyIndex = unselectedData.splice(keyIndex, 1); //Removed the selected item from unselectedData to keep from reasking a question
    key_question = data.results[keyIndex].question;
    key_question = removeSpecialCharacters(key_question); //remove special characters from the question.
    $("#question-text").text(key_question); //Display the question

    if (unselectedData.length === 0){
        lastQuestion = true
    }

    userSelectableResponseItems.push(data.results[keyIndex].correct_answer);

    for (var i = 0; i < data.results[keyIndex].incorrect_answers.length; i++) {
        userSelectableResponseItems.push(data.results[keyIndex].incorrect_answers[i]);//populate userSelecatableResponseItems. This is needed when randomizing the user options
    }

    var i = 0;
    while (userSelectableResponseItems.length > 0) {
        //This activates and populates user selectable radio buttons
        var selectableResponse = getRandomNumberBetween(0, userSelectableResponseItems.length - 1);
        selectableResponse = userSelectableResponseItems.splice(selectableResponse, 1);
        i++;
        selectableResponse = removeSpecialCharacters(selectableResponse);
        $("#userOption-" + i).text(selectableResponse);
        $("#userOption-" + i).show();
    }

    timer = setTimeout(function () {
        if (userGaveResponse === false && timerActive === true) {
            incorrectAnswers++;
            console.log("Times Up");
            displayImage();
        } else {
            timerActive = false;
            console.log("timerActive: " + timerActive);
        }
    }, 12000);

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

    queryURL = "http://api.giphy.com/v1/gifs/search?q=" + imgQueryURLSearch + "&api_key=" + giphyAPIKey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //   console.log(response)
        var imgUrl = response.data[getRandomNumberBetween(0, 24)].images.original.url;
        console.log(imgUrl);
        $(".testImg").attr("src", imgUrl);
        $(".testImg").show();
    });
    
    $(".testImg").show();
    imgTimer = setTimeout(function () {
        imgTimerActive = false;
        $("#result").text("");
        console.log("imgTimerActive: " + imgTimerActive);
        $(".testImg").hide();
        $(".testImg").attr("src", "");
        if (lastQuestion === false) {
            configureForm();
            console.log("Not the last question")
        }
        else{
            gameOver=true
        }
    }, 4000);
    imgTimerActive = true;
    console.log("imgTimerActive: " + imgTimerActive);
}


function flyout(headerText) {
    if (!isFlyOutActive) {
        var flyoutDiv = $("<div>");
        flyoutDiv.attr("id", "flyout");
        flyoutDiv.addClass("flyout");
        flyoutDiv.html($("<H3>").text(headerText));
        flyoutDiv.append($("<hr />"));
        flyoutDiv.hide();
        $(".content-body").append(flyoutDiv);
        flyoutDiv.fadeIn();
        isFlyOutActive = true;
    } else {
        closeFlyout();
    }
}


function closeFlyout() {
    if (isFlyOutActive) {
        $("#flyout").fadeOut();
        setTimeout(() => {
            $("#flyout").remove();
        }, 1000);
        isFlyOutActive = false;
    }
}


function getDifficultyString() {
    var difficultyKeyword;

    if (roundNum === 1) {
        difficultyKeyword = "easy";
    } else if (roundNum === 2) {
        difficultyKeyword = "medium";
    } else {
        difficultyKeyword = "hard";
    }
    return "&difficulty=" + difficultyKeyword;
}


function getTriviaData() {
    var queryURL = "https://opentdb.com/api.php?amount=10";

    if (categoryValue !== 0) {
        queryURL =
            queryURL + "&category=" + categoryValue + getDifficultyString();
        console.log(queryURL);
    }

    console.log(queryURL);
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        data = response;
        for (var i = 0; i < data.results.length; i++) {
            unselectedData.push(i);
        }
        console.log("unselectedData");
        console.log(unselectedData);
        configureForm();
    });
}


$(".option-button").on("click", function () {
    console.log("game over: " + gameOver)
    // console.log($("#" + this.id).text());
    if (gameOver === false){
        var userSelection = $("#" + this.id).text();
        var correctAnswer = data.results[keyIndex].correct_answer;
        var isUserAnswerCorrect = false;
        userGaveResponse = true;
        clearTimeout(timer);
        timerActive = false;
        console.log(imgTimerActive);

        if (imgTimerActive === false) {

            if (userSelection === correctAnswer) {
                isUserAnswerCorrect = true;
                correctAnswers++;
                $("#result").text("Correct!");
                console.log("correct answer");
            } else {
                incorrectAnswers++;
                $("#result").text("Correct answer was: " + correctAnswer);
                console.log("incorrect answer");
            }

            console.log("game over: " + gameOver)

            if (unselectedData.length !== 0) {
                displayImage(isUserAnswerCorrect);
            } else {
                gameOver = true;
                displayImage(isUserAnswerCorrect);

                setTimeout(function(){
                    flyout("Results")
                    var resultDiv1 = $("<Div>")
                    resultDiv1.html("<H5>Correct: " + correctAnswers + "</H5> <br> <H5>Incorrect: " + incorrectAnswers + "</H5><br><br><H5>Get ready for the next level!!</H5>")
                    $("#flyout").append(resultDiv1)
                }, 2000);

                setTimeout(function(){
                    closeFlyout()
                    $("#flyout").remove();
                    roundNum++
                    timerActive = false;
                    $(".testImg").hide();
                    restart()
                    getTriviaData();
                }, 8000);
                console.log("Correct: " + correctAnswers);
                console.log("Incorrect: " + incorrectAnswers);
            }
            console.log("game over: " + gameOver)
        }
    }
});


function startUp() {
    var categories = {
        Any: 0,
        "General Knowledge": 9,
        Books: 10,
        Film: 11,
        Music: 12,
        Television: 14,
        "Video Games": 15,
        "Board Games": 16,
        "Science & Nature": 17,
        Computers: 18,
        Mathematics: 19,
        Mythology: 20,
        Sports: 21,
        Geography: 22,
        History: 23,
        Politics: 24,
        Celebrities: 26,
        Animals: 27,
        Vehicles: 28,
        "Japanese Anime & Manga": 31,
        "Cartoon & Animations": 32
    };
    var categoryDiv = $("<div>");
    flyout("Pick a category");

    var rowDiv = $("<div>");
    rowDiv.addClass("row");

    var colDiv1 = $("<div>");
    colDiv1.addClass("col-6 btn-group-vertical text-center");
    var colDiv2 = $("<div>");
    colDiv2.addClass("col-6 btn-group-vertical text-center");
    colDiv1.attr("role", "group");
    colDiv2.attr("role", "group");

    for (var i = 1; i <= 21; i++) {
        var categoryKey = Object.keys(categories)[i - 1];
        var btn = $("<button>");
        btn.addClass("category btn btn-secondary option-button");
        btn.attr("value", categories[categoryKey]);
        btn.text(categoryKey);

        if (i < 12) {
            colDiv1.append(btn);
        } else {
            colDiv2.append(btn);
        }
    }
    rowDiv.append(colDiv1);
    rowDiv.append(colDiv2);
    categoryDiv.append(rowDiv);

    $("#flyout").append(categoryDiv);
}


function setCategory() {
    categoryValue = parseInt($(this).attr("value"));
    console.log(categoryValue);
    console.log($(this).attr("value"));
    closeFlyout();
    getTriviaData();
}


$(document).on("click", ".category", setCategory);


timerActive = false;
$(".testImg").hide();
startUp();