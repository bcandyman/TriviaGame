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
var correctAnswers = 0;
var incorrectAnswers = 0;
var keyIndex = -1;
var key_question = ""
var unselectedData = [];
var userSelectableResponseItems = [];
var timer
var timerActive = false;
var userGaveResponse = false;

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

function resetRadioButtons(){
    for(var i = 1; i <= 4; i++){
        $("label[for='" + $("#userOption-" + i).attr("id") + "']").text("")
        $("#userOption-" + i).prop("checked",false)
    }
    $(".option-button").hide()
}

function configureForm(){        
        resetRadioButtons()
        keyIndex = getRandomNumberBetween(0, unselectedData.length - 1); //randomly assigns an index value from unselectedData
        keyIndex = unselectedData.splice(keyIndex, 1); //Removed the selected item from unselectedData to keep from reasking a question
        key_question = Object.keys(data)[keyIndex];//Retrieve question using the keyIndex value
        $("#question").text(key_question);//Display the question

        for (var i = 1; i < getObjArrayLen(data, key_question); i++) {//populate userSelecatableResponseItems. This is needed when randomizing the user options
            userSelectableResponseItems[i - 1] = data[key_question][i];
        }

        var i = 0;
        while (userSelectableResponseItems.length > 0) {//This activates and populates user selectable radio buttons
            var selectableResponse = getRandomNumberBetween(0, userSelectableResponseItems.length - 1);
            selectableResponse = userSelectableResponseItems.splice(selectableResponse,	1);
            i++;
            $("label[for='" + $("#userOption-" + i).attr("id") + "']").text(selectableResponse);
            $("#userOption-" + i).show()
        }

        timer=setTimeout(function(){//Activates the timer
            if (userGaveResponse === false && timerActive === true){
                incorrectAnswers++
                console.log("Times Up")
                displayImage()
            }
            else{
                timerActive=false
                console.log("timerActive: " + timerActive)
            }
        },10000)
        timerActive=true
        console.log("timerActive: " + timerActive)
        userGaveResponse=false;
        console.log("userGaveResponse: " + userGaveResponse)
    }


    function displayImage(){
        $(".testImg").show()
        setTimeout(function(){
            $(".testImg").hide()
            configureForm()
        },2000)
    }
    

//populate unselectedData array
//this will be used to track which questions have been asked
for (var i = 0; i < getObjLength(data); i++) {
	unselectedData.push(i);
}

timerActive = false;
resetRadioButtons()
$(".testImg").hide()


$("#beginGame").on("click", function() {
    configureForm()
});


$(".option-button").on("click", function() {
    var userSelection = $("label[for='" + $("#" + this.id).attr("id") + "']").text()
    var correctAnswer = data[key_question][1]
    userGaveResponse = true
    console.log("userGaveResponse: " + userGaveResponse)
    clearInterval(timer)

    

    if (userSelection === correctAnswer){
        correctAnswers++
    }
    else{
        incorrectAnswers++
    }
    if (!unselectedData.length == 0){
        displayImage()
        // configureForm()
    }
    else{
        $("#question").fadeOut()
        resetRadioButtons()
        console.log("Correct: " + correctAnswers)
        console.log("Incorrect: " + incorrectAnswers)
    }
})
