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
        // "BANANA",
        // "CARROT",
        // "DEAR",
        // "ELEPHANT",
        // "FISH",
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
        Word Missing 💡
        <div class='rules_info'>
            <span style="font-size: 20px; color: gold;"> @ Game Instructor</span><br>
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

function isCorrectWord(selectedChar) {
    if (gameData.missingChar == selectedChar) {
        removeWord(gameData.fullWord)
        debug(`Word Data -> ${wordData}`)
        toStartGuessingWord()
        return
    }

    failAttmp++
    // document.getElementById(`word_${selectedChar}`)
    document.getElementById('fail-attemp').innerHTML = `Fail Attemp: <span style="color:red">${failAttmp}/${maxFailAttmp}</span>`
    
    // Game Over
    if (failAttmp >= maxFailAttmp) {
        document.getElementsByClassName('game_container')[0].innerHTML = `<div class="game-over">GAME OVER !</div><br><button onclick="toMainMenu()">Back To Main`
        return
    }

    // Win
    if (failAttmp < maxFailAttmp && wordData.length < 1) {
        return
    }
}

function toStartGuessingWord() {
    cleanGameContainer()
    refreshFailAttmpData()
    gameData = wordCalculate(getRandomWord())
    var rndData = getRandomCharactersData(gameData.missingChar)
    var htmlCode = `
        <div id='fail-attemp'>Fail Attemp: <span style="color:red">${failAttmp}/${maxFailAttmp}</span></div>
        <div id='missionWord'>${gameData.gameWord}</div>
        <div class='grid-answers'>
    `   
    for (let i = 0; i < rndData.length; i++){
        htmlCode += `<div class="grid-character" id="word_${rndData[i]}" onclick="isCorrectWord('${rndData[i]}')">${rndData[i]}</div>`
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