// ---------Responsive-navbar-active-animation-----------
function test() {
  var tabsNewAnim = $("#navbarSupportedContent");
  var selectorNewAnim = $("#navbarSupportedContent").find("li").length;
  var activeItemNewAnim = tabsNewAnim.find(".active");
  var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
  var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
  var itemPosNewAnimTop = activeItemNewAnim.position();
  var itemPosNewAnimLeft = activeItemNewAnim.position();
  $(".hori-selector").css({
    top: itemPosNewAnimTop.top + "px",
    left: itemPosNewAnimLeft.left + "px",
    height: activeWidthNewAnimHeight + "px",
    width: activeWidthNewAnimWidth + "px",
  });
  $("#navbarSupportedContent").on("click", "li", function (e) {
    $("#navbarSupportedContent ul li").removeClass("active");
    $(this).addClass("active");
    var activeWidthNewAnimHeight = $(this).innerHeight();
    var activeWidthNewAnimWidth = $(this).innerWidth();
    var itemPosNewAnimTop = $(this).position();
    var itemPosNewAnimLeft = $(this).position();
    $(".hori-selector").css({
      top: itemPosNewAnimTop.top + "px",
      left: itemPosNewAnimLeft.left + "px",
      height: activeWidthNewAnimHeight + "px",
      width: activeWidthNewAnimWidth + "px",
    });
  });
}
$(document).ready(function () {
  setTimeout(function () {
    test();
  });
});
$(window).on("resize", function () {
  setTimeout(function () {
    test();
  }, 500);
});
$(".navbar-toggler").click(function () {
  $(".navbar-collapse").slideToggle(300);
  setTimeout(function () {
    test();
  });
});

// --------------add active class-on another-page move----------
jQuery(document).ready(function ($) {
  // Get current path and find target link
  var path = window.location.pathname.split("/").pop();

  // Account for home page with empty path
  if (path == "") {
    path = "index.html";
  }

  var target = $('#navbarSupportedContent ul li a[href="' + path + '"]');
  // Add active class to target link
  target.parent().addClass("active");
});

// Add active class on another page linked
// ==========================================
// $(window).on('load',function () {
//     var current = location.pathname;
//     console.log(current);
//     $('#navbarSupportedContent ul li a').each(function(){
//         var $this = $(this);
//         // if the current path is like this link, make it active
//         if($this.attr('href').indexOf(current) !== -1){
//             $this.parent().addClass('active');
//             $this.parents('.menu-submenu').addClass('show-dropdown');
//             $this.parents('.menu-submenu').parent().addClass('active');
//         }else{
//             $this.parent().removeClass('active');
//         }
//     })
// });

// Slider
// mainSlider

// Query selectors
let quizInfo = document.querySelector(".quiz-info");
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let categorySpan = document.querySelector(".category span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let optionsArea = document.querySelector(".options-area");
let submitButton = document.querySelector(".submit-button");
let countdownDiv = document.querySelector(".countdown");
let resultsDiv = document.querySelector(".results");

// Variables
let currentIndex = 0;
let rigthAnswers = 0;
let countdownInterval = 0;

//Functions to get the questions from JSON File
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.questions.length;

      createBullets(questionsCount);

      categoryName(
        questionsObject.questions[currentIndex].category,
        questionsCount
      );

      addQuestionData(questionsObject.questions[currentIndex], questionsCount);

      countdown(600, questionsCount);

      submitButton.onclick = () => {
        let theRightAnswer =
          questionsObject.questions[currentIndex].right_answer;
        currentIndex++;

        checkAnswer(theRightAnswer, questionsCount);

        quizArea.innerHTML = "";
        optionsArea.innerHTML = "";

        addQuestionData(
          questionsObject.questions[currentIndex],
          questionsCount
        );

        handleBullets();

        showResults(questionsCount);
      };
    }
  };

  myRequest.open(
    "GET",
    "https://mohamedkhalifa11.github.io/Qweb/webDevlopement_questions.json",
    true
  );
  myRequest.send();
}

getQuestions(); // To call getQuestions function

// Make circles to know which question you are now in the quiz
function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }

    bulletsSpanContainer.appendChild(theBullet);
  }
}

// To add category name from JSON File
function categoryName(category) {
  categorySpan.innerHTML = category;
}

// Function addQuestionData to add questions and options into the web app
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj.question);

    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    for (let i = 0; i < 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "option";

      let radioInput = document.createElement("input");
      radioInput.name = "options";
      radioInput.type = "radio";
      radioInput.id = `option_${i}`;
      radioInput.dataset.option = obj.options[i];

      theLabel = document.createElement("label");
      theLabel.htmlFor = `option_${i}`;

      theLabelText = document.createTextNode(obj.options[i]);

      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      optionsArea.appendChild(mainDiv);
    }
    categoryName(obj.category); // Call categoryName Function
  }
}
// To check the answers from the user
function checkAnswer(rAnswer, count) {
  let options = document.getElementsByName("options");
  let choosenAnswer;

  for (let i = 0; i < options.length; i++) {
    if (options[i].checked) {
      choosenAnswer = options[i].dataset.option;
    }
  }
  if (rAnswer === choosenAnswer) {
    rigthAnswers++;
  }
}
// To color the circle to show you the number of the quiz question
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

/*
  This function used after the quiz is finished 
  It Delete all quiz content and show the user result
*/
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    optionsArea.remove();
    submitButton.remove();
    bullets.remove();
    quizInfo.remove();

    if (rigthAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All answers are correct ${rigthAnswers} from ${count}`;
    } else if (rigthAnswers < count && rigthAnswers > count / 2) {
      theResults = `<span class="good">Good</span>, ${rigthAnswers} from ${count} are correct`;
    } else if (rigthAnswers === count / 2) {
      theResults = `<span class="fair">Fair</span>, Just half of answers are correct ${rigthAnswers} from ${count} is Right`;
    } else {
      theResults = `<span class="bad">Bad Result</span>, ${rigthAnswers} from ${count} are correct`;
    }

    resultsDiv.innerHTML = theResults;
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownDiv.style.fontWeight = "bold";

      if (duration < 60) {
        countdownDiv.style.color = "red";
      }

      countdownDiv.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        // showResults(count)
        for (let i = 0; i < count - currentIndex + i; i++) {
          console.log(`Count: ${count}`);
          console.log(`current Index: ${currentIndex}`);
          submitButton.click();
        }
      }
    }, 1000);
  }
}
