const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const correctAnswer = document.getElementById("correctAnswer");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
//let theAnswer = "";

// fetch questions from JSON file (questions.json)
//fetch("questions.json").then(res => {
//    return res.json();
//}).then(loadedQuestions => {
//    questions = loadedQuestions;
//    startGame();
//}).catch(err => {
//    console.error(err);
//});

// fetch questions from open trivia api - https://opentdb.com/api_config.php
fetch("https://opentdb.com/api.php?amount=10&category=32&difficulty=easy&type=multiple").then(res => {
    return res.json();
}).then(loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion => {
        const formattedQuestion = {
            question: loadedQuestion.question
        };
        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
        });
        return formattedQuestion;
    });
    startGame();
}).catch(err => {
    console.error(err);
});


//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    // hide loader display game
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        // end game
        return window.location.assign('./end.html')
    }
    questionCounter++;
    // clear correct answer box
    correctAnswer.innerHTML = "";
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // update progress bar
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`;
    
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;
    
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerHTML = currentQuestion["choice" + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice =>{
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;
        acceptingAnswers = false;
        
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        const theAnswer = choices[currentQuestion.answer-1].textContent;

        if(classToApply === "correct"){
            incrementScore(CORRECT_BONUS);
            correctAnswer.innerHTML = "Correct!";
        } else{
            correctAnswer.innerHTML = "Incorrect. The correct answer is " + theAnswer;
        }

        selectedChoice.parentElement.classList.add(classToApply);
        
        setTimeout( ()=> {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 3000);
    })
});

incrementScore = num =>{
    score += num;
    scoreText.innerText = score;
};

