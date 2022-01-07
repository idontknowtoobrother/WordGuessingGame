const wordData = [

]


function wordCalculate(word) {
    let mI = Math.floor(Math.random() * word.length)
    return {
        missingIndex: mI,
        fullWord: word,
        gameWord: word.replace(word.charAt(mI), '_')
    }
}