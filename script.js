const mainBody = document.querySelector('.mainbody');
const wrongButtonSound = document.getElementById('wrong-button-sound');
const tenSecondSound = document.getElementById('10second-sound');
const bellSound = document.getElementById('bell-sound');
const gameEndSound = document.getElementById('game-end-sound');

let arrow_size = 10; // 화면에 나타나는 버튼 개수.
let arrow_array = [];
let arrow_type = ['Arrow-left', 'Arrow-up', 'Arrow-right', 'Arrow-down'];
let current_arrow = 0;
let timersetting = 30; // 시간 설정.
let temptime = 0;
let gamestarted = 0;
let bestScore = 0;
let timePlus = 2;

function SetTime(){
    const timeText = document.querySelector('.timer');
    const timeBar = document.querySelector('.timebar');

    let x = setInterval(function(){
        timeText.textContent = time.toFixed(2);
        time -= 0.01;
        timeBar.style.width = time*20 + 'px';
        
        if(time < 10){
            // 10초 미만이면 빨강색으로 변경.
            timeBar.style.backgroundColor = 'red';
            timeText.style.color = 'red';

            temptime -= 0.01;
            if(temptime < 0){
                tenSecondSound.play();
                temptime = 2;
            } // 2초마다 소리 재생.
        }else{
            timeBar.style.backgroundColor = 'black';
            timeText.style.color = 'black';
        }

        if(time < 0){
            clearInterval(x);
            TimeOver();
        }
    }, 10); // 10은 0.01초 마다 함수가 실행됨을 의미.
}

//create array of arrows
function CreateArrowArray(){
    for(let i = 0; i<arrow_size; i++){
        // let arrowTemp = document.createElement('img');
        // arrowTemp.getAttribute('src', arrow-type[getRandomIntInclusive(0, 3)]);
        let randomNumber = getRandomIntInclusive(0, 3)
        arrow_array.push(randomNumber);
    }
}

//create img tags of arrows and append it to main tag.
function DrawArrowArray(){
    const arrows = document.getElementById('arrows');
    for(let i = 0; i<arrow_size; i++){
        let arrowTemp = document.createElement('img');
        arrowTemp.setAttribute('src', arrow_type[arrow_array[i]]+'.jpg');
        arrowTemp.setAttribute('class', 'arrow');
        arrowTemp.setAttribute('id', 'arrow'+i);

        arrows.appendChild(arrowTemp);
    }
}

// it will reset variables, screen and create arrows on screen.
function GenerateArrows(){
    const arrows = document.getElementById('arrows');
    current_arrow = 0;
    arrow_array = [];
    arrows.innerHTML = '';
    arrows.style.width = 1075+'px'

    CreateArrowArray();
    DrawArrowArray();
}

function OnKeyDown(event){
    // event.keyCode -> left :37, up: 38, right: 39, down: 40
    const scoreNumber = document.querySelector('.score');
    const scoreText = document.querySelector('.score-text');

    if(CheckInputArrow(current_arrow, event.keyCode)){
        score++;
        scoreNumber.textContent = score;
        scoreNumber.style.color = 'black';
        scoreText.style.color = 'black';
        ChangeArrowImgToRed(current_arrow, event.keyCode);
        current_arrow++;
        PlayArrowButtonSound();
        if(current_arrow === arrow_size){
            // Cleared! to the next Stage!
            GenerateArrows();
            isCleared = 1;
            time += timePlus;
            bellSound.load();
            bellSound.play();
            scoreNumber.style.color = "rgb(0,0,255)";
            scoreText.style.color = "rgb(0,0,255)";

            let rgbBlue = 255;
            let z = setInterval(function() {
                if(rgbBlue >= 0){
                    rgbBlue -= 1;
                    scoreNumber.style.color = "rgb(0,0,"+rgbBlue+" )";
                    scoreText.style.color = "rgb(0,0,"+rgbBlue+" )";
                }
            }, 10);
        }
    }else{
        // Failed..
        
        wrongButtonSound.play();

        scoreNumber.style.color = 'red';
        scoreText.style.color = 'red';
        score -= current_arrow;
        scoreNumber.textContent = score;
        current_arrow = 0;
        ChangeAllArrowToBlack();
    }
}

function ChangeAllArrowToBlack(){
    for(let i = 0; i<arrow_size; i++){
        let arrowTemp = document.getElementById('arrow'+i);
        arrowTemp.setAttribute('src', arrow_type[arrow_array[i]]+'.jpg');
        arrowTemp.style.width = 100 + 'px';
        arrowTemp.style.padding = 0 + 'px';
    }
}

function ChangeArrowImgToRed(currArrowIndex, currArrowType){
    let arrowTemp = document.getElementById('arrow'+currArrowIndex);
    arrowTemp.setAttribute('src', arrow_type[currArrowType - Number(37)]+'r.jpg');

    let arrowTempSize = 100;
    let arrowTempPadding = 0;
    let arrowTempShrinkSpeed = 2;

    arrowTemp.style.width = arrowTempSize + 'px';
    arrowTemp.style.padding = arrowTempPadding + 'px';
    let z = setInterval(function() {
        if(arrowTempSize >= 80){
            arrowTempSize -= arrowTempShrinkSpeed * 2;
            arrowTemp.style.width = arrowTempSize + 'px';
        }
        if(arrowTempPadding <= 10){
            arrowTempPadding += arrowTempShrinkSpeed;
            arrowTemp.style.padding = arrowTempPadding + 'px';
        }
    }, 10);
}

// check if current arrow and input are same, returns 1 if correct, else return 0;
function CheckInputArrow(currArrow, inputArrow){
    let isInputCorrect = 0;

    if(arrow_array[currArrow]+Number(37) === inputArrow){
        isInputCorrect = 1;
    }

    return isInputCorrect;OnKeyDown
}

//randomly generate integer from min to max
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
  }

function PlayArrowButtonSound(){
    const arrowButtonSound = document.getElementById('arrow-button-sound');
    arrowButtonSound.load();
    arrowButtonSound.play();
    //audio 태그의 play는 사운드 중복이 안되므로 load와 혼용해서 사용하면 적당히 끊고 사용 가능. 
}

function SetGameArea(){
    time = timersetting;
    score = 0;

    mainBody.innerHTML = '';
    const scoreText = document.createElement('div');
    const scoreNumberDiv = document.createElement('div');
    const arrowDiv = document.createElement('div');
    const timerDiv = document.createElement('div');
    const timeBarDiv = document.createElement('div');

    scoreText.setAttribute('class', 'score-text');
    scoreNumberDiv.setAttribute('class', 'score');
    arrowDiv.setAttribute('id', 'arrows');
    timerDiv.setAttribute('class', 'timer');
    timeBarDiv.setAttribute('class', 'timebar');

    scoreText.textContent = 'score';
    scoreNumberDiv.textContent = 0;

    mainBody.appendChild(scoreText);
    mainBody.appendChild(scoreNumberDiv);
    mainBody.appendChild(arrowDiv);
    mainBody.appendChild(timerDiv);
    mainBody.appendChild(timeBarDiv);
}

function SetStartMenu(){
    const titleText = document.createElement('div');
    const br = document.createElement('br');
    const titleText2 = document.createElement('div');
    const spaceBarStartText = document.createElement('div');

    titleText.setAttribute('class', 'title');
    spaceBarStartText.setAttribute('class', 'space-bar-text');

    titleText.textContent = '30 Seconds Left';
    titleText2.textContent = 'Made by Coding Feature';
    spaceBarStartText.textContent = 'Press Spacebar To Start!';

    let opacityText = 1;
    let timeOpacity = 0;
    let y = setInterval(function() {
        timeOpacity += 0.01
        if (Math.floor(timeOpacity) % 2 === Number(0)){
            opacityText -= 0.01;
            spaceBarStartText.style.opacity = opacityText
        }else if(Math.floor(timeOpacity) % 2 === Number(1)){
            opacityText += 0.01;
            spaceBarStartText.style.opacity = opacityText
        }
    }, 10);

    mainBody.appendChild(titleText);
    mainBody.appendChild(br);
    mainBody.appendChild(titleText2);
    mainBody.appendChild(spaceBarStartText);
}

function StartGame(){
    document.removeEventListener('keydown', StartGame);
    document.addEventListener('keydown', OnKeyDown);
    
    SetGameArea();
    GenerateArrows();
    SetTime();
}

function StartGameAgain(event){
    // spacebar keycode is 32.
    if(event.keyCode === Number(32)){
        document.removeEventListener('keydown', StartGameAgain);
        StartGame();
    }
}

function TimeOver(){
    document.removeEventListener('keydown', OnKeyDown);
    document.addEventListener('keydown', StartGameAgain);
    mainBody.innerHTML = '';

    const gameOverText = document.createElement('div');
    const bestScoreText = document.createElement('div');
    const finalScoreText = document.createElement('div');
    const gameStartAgainText = document.createElement('div');
    const newBestScoreText = document.createElement('div');

    gameOverText.setAttribute('class', 'game-over-text');
    bestScoreText.setAttribute('class', 'best-score-text');
    finalScoreText.setAttribute('class', 'final-score-text');
    gameStartAgainText.setAttribute('class', 'game-start-again-text');
    newBestScoreText.setAttribute('class', 'new-best-score-text');

    
    if(score > bestScore){
        //최고 기록 경신 시 실행.
        bestScore = score;
        gameOverText.textContent = '';
        newBestScoreText.textContent = "WOW! NEW RECORD!! CONGRATULATIONS!!";

    }else{
        newBestScoreText.textContent = '';
        gameOverText.textContent = 'GAME OVER!!';
    }

    bestScoreText.textContent = 'Best Score : ' + bestScore;
    finalScoreText.textContent = 'Your Score : ' + score;
    gameStartAgainText.textContent = 'Press Spacebar to Start Again!!';

    let opacityText = 1;
    let timeOpacity = 0;
    let y = setInterval(function() {
        timeOpacity += 0.01
        if (Math.floor(timeOpacity) % 2 === Number(0)){
            opacityText -= 0.01;
            gameStartAgainText.style.opacity = opacityText;
        }else if(Math.floor(timeOpacity) % 2 === Number(1)){
            opacityText += 0.01;
            gameStartAgainText.style.opacity = opacityText;
        }
    }, 10);

    gameEndSound.play();

    mainBody.appendChild(gameOverText);
    mainBody.appendChild(newBestScoreText);
    mainBody.appendChild(bestScoreText);
    mainBody.appendChild(finalScoreText);
    mainBody.appendChild(gameStartAgainText);
}

function Game(){
    SetStartMenu();
    document.addEventListener('keydown', StartGame);
}

Game();