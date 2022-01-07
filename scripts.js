let dbg = true
let wordData
let gameData 
let wordDataReleaseLength
let failAttmp
let maxFailAttmp

function debug(data) {
    if (!dbg) return;
    console.log(data)
}

function cleanGameContainer() {
    document.getElementsByClassName('game_container')[0].innerHTML = ``
}

function initialGame() { 
    wordData = [
        "APPLE",
        "BANANA",
        "CARROT",
        "DEAR",
        "ELEPHANT",
        "FISH",
        // "GRAPE",
        // "HUMAN",
        // "ICON",
        // "JIGSAW",
        // "KING",
        // "LOVE",
        // "MONEY",
        // "NUMBER",
        // "OIL",
        // "PENCIL",
        // "QUEEN",
        // "RIVER",
        // "SNAKE",
        // "TIGER",
        // "UNDER",
        // "VAN",
        // "WIN",
        // "XRAY",
        // "YELLOW",
        // "ZEBRA"
    ]
    wordDataReleaseLength = wordData.length
    failAttmp = 0
    refreshFailAttmpData()
}

function toMainMenu() {
    cleanGameContainer()
    initialGame()
    document.getElementsByClassName('game_container')[0].innerHTML = `
        Character Hidden💡
        <div class='rules_info'>
            <span style="font-size: 20px; color: gold;"> @ Game Instructor</span>
            <br>1. The Character Hidden gonna random a word
            <br>2. That the word will hidden 1 character itself
            <br>3. We have 8 block of chracters
            <br>4. You must guess and select it to go another word

            <br><br><span style="font-size: 20px; color: gold;"> @ Attention</span><br>
            You have max fail attemp if you choose a incorrect word more than max attemp you will lose .
            <br>Fail Attemp : <span style="color:red">${failAttmp}</span>
        </div>
        <button id="startBtn" onclick="toStartGuessingWord()">Let's Guess The Word 🖱️</button>
    `
}

function rndNum(n) {
    return Math.floor(Math.random()*n)
}

function getRandomCharacter() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    return characters.charAt(rndNum(charactersLength));
}

function getRandomCharactersData(correctChar) {
    var rndData = []
    var placeIndex = rndNum(8)
    while (rndData.length < 8) {
        var rndChar = getRandomCharacter()

        // if random and get correct characters .
        if (rndChar == correctChar) {
            continue;
        }
        for (var i=0; i<8; i++){
            if (rndData[i]==correctChar||rndData[i]==rndChar) {
                continue;
            }
        }
        rndData.push(rndChar)
    }
    rndData[placeIndex] = correctChar
    debug(`Correct Word -> ${placeIndex} : ${correctChar}`)
    debug(`Game Data -> ${rndData}`)
    return rndData
}

function getRandomWord() {
    return wordData[rndNum(wordData.length)]
}

function refreshFailAttmpData() {
    var percentOfData = wordData.length * 100 / wordDataReleaseLength
    maxFailAttmp = percentOfData < 25 ? 1 : percentOfData < 50 ? 2 : 3
}

function removeWord(word) {
    for (var i = 0; i < wordData.length; i++){
        if (wordData[i] == word) {
            wordData.splice(i, 1);
            return
        }
    }
}
function disableAllBtn() { 
    for (var id = 0; id < 8; id++){
        document.getElementById(`word_${id}`).onclick = ''
        document.getElementById(`word_${id}`).disabled = true
    }
}

function isCorrectWord(selectedChar, id) {
    if (gameData.missingChar == selectedChar) {
        disableAllBtn()
        document.getElementById(`word_${id}`).classList.remove('grid-character')
        document.getElementById(`word_${id}`).classList.add('onclicked-right');
        removeWord(gameData.fullWord)
        debug(`Word Data -> ${wordData}`)
        setTimeout(function () {
            failAttmp = 0
            toStartGuessingWord()
        }, 400);
        return
    }

    failAttmp++
    document.getElementById(`word_${id}`).classList.remove('grid-character')
    document.getElementById(`word_${id}`).classList.add('onclicked');
    document.getElementById(`word_${id}`).disabled = true
    document.getElementById(`word_${id}`).onclick = ''

    document.getElementById('fail-attemp').innerHTML = `Fail Attemp: <span style="color:red">${failAttmp}/${maxFailAttmp}</span>`
    
    // Game Over
    if (failAttmp >= maxFailAttmp) {
        document.getElementsByClassName('game_container')[0].innerHTML = `<div class="game-over">Game Over !</div><br>Fail Attemp : <span style="color:red">${failAttmp}</span><br><button onclick="toMainMenu()">Back To Main`
        return
    }

}

function toStartGuessingWord() {
    cleanGameContainer()
    // Win
    debug(`Stat -> ${failAttmp} < ${maxFailAttmp}`)
    if (wordData.length < 1) {
        document.getElementsByClassName('game_container')[0].innerHTML = `<div class="game-win">Congratulations 😊</div><br>Fail Attemp : <span style="color:red">${failAttmp}</span><br><button onclick="toMainMenu()">Back To Main`
        return
    }

    refreshFailAttmpData()
    gameData = wordCalculate(getRandomWord())
    var rndData = getRandomCharactersData(gameData.missingChar)
    var htmlCode = `
        <div id='fail-attemp'>Fail Attemp: <span style="color:red">${failAttmp}/${maxFailAttmp}</span></div>
        <div id='missionWord'>${gameData.gameWord}</div>
        <div class='grid-answers'>
    `   
    for (let id = 0; id < rndData.length; id++){
        htmlCode += `<div class="grid-character" id="word_${id}" onclick="isCorrectWord('${rndData[id]}', '${id}')">${rndData[id]}</div>`
    }
    htmlCode+='</div>'
     
    document.getElementsByClassName('game_container')[0].innerHTML = htmlCode
}

function wordCalculate(word) {
    debug(`Cal Word -> ${word}`)
    var mI = rndNum(word.length)
    var missChar = word.charAt(mI)
    var gameWord = word.replace(missChar, '<span style="color:gold;">__</span>')
    return {
        missingChar: missChar,
        fullWord: word,
        gameWord: gameWord
    }
}

toMainMenu()