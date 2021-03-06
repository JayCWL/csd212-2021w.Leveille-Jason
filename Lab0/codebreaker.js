"use strict"

import initPrompt from 'prompt-sync';

const prompt = initPrompt();

function allTrue(a, b){
    return a && b
}

function isNumeric(c){
    /*Returns true if the given character is between '0' and '9'
        c is assumed to be a string of length 1
    */
    return "0" <= c && c <= "9"
}

function isStringNumeric(s){
    /*Returns True if the given string consists of only the digits 0-9*/
    
    // First, make a list of which symbols in the given string are numeric (map)
    // Then determine if that list is a sequence of only True values (reduce)
    return reduce(allTrue, map(isNumeric, s))
}

function makeCode(length){
    /*Generate a random code string of the given length.
       Codes consist of the digits 0-9 in any position.
       (010, 007, and 000 are all possible codes.)
    */
    
    code = ""
    for (_ in range(length)){
        code += str(randint(0,9))}
    
    return code
}

function getGuess(code_length){
    /*Recursively prompt the player for a guess*/

    guess = input("Guess the code{ ")
    
    if (len(guess) != code_length){
        console.log(`You must enter ${code_length} numbers`)
        return getGuess(code_length)
    }
    
    if (not isStringNumeric(guess)){
        console.log("The code may contain only numbers")
        return getGuess(code_length)
    }
    
    return guess
    }
    
function countMatches(code, guess){
    /*Returns a tuple (M,S) where M (matches) is the number of symbols in the player's guess
       that are both correct and in the correct position and S (semi-matches) is the number of
       symbols in the player's guess that are correct, but NOT in the correct position.
       It is assumed that code and guess are strings.
    */
    
    // First, convert the strings into lists, which are mutable (we will take advantage of this fact)
    codeNumbers = list(code)
    guessNumbers = list(guess)
    
    numMatches = 0
    num_semiMatches = 0
    
    // Find the exact matches first
    for (i in range(len(codeNumbers))){
        // Any given position that has the same symbol in both the code and the guess is an exact match
        if (codeNumbers[i] == guessNumbers[i]){
            // Mark matches in the lists of numbers so we don't double-match any of them
            codeNumbers[i] = "-"
            guessNumbers[i] = "-"
            numMatches += 1}}

    // Now determine if there are any semi-matches, ignoring any symbols for which we have already
    // identified an exact match
    for (g in guessNumbers){
        
        // Skip any guess numbers we've already matched
        if (g == "-"){
            continue}
        
        // We need to compare ALL the symbols in the code with each symbol in the guess
        // because a a semi-match means the guess symbol is somewhere in the code but not
        // in the same position as it is in the guess
        for (i in range(len(codeNumbers))){
            c = codeNumbers[i]}
            
            // Skip any code numbers we've already matched
            if (c == "-"){
                continue}
        
            if (g == c) {
                // Once a code symbol has been matched, mark it so it doesn't get double-matched
                codeNumbers[i] = "-"   
                num_semiMatches += 1
                break}
            }
    
    return (numMatches, num_semiMatches)
}

function getCodeLength(){
    /*Recursively prompt the user for a numeric code length*/
    
    let response = prompt("How long do you want the code to be? ")
    
    if (!(isStringNumeric)){
        console.log("You must enter a number")
        return getCodeLength()
    }
    let n = response
    
    if (n < 2){
        console.log("You must choose a number greater than 1")
        return getCodeLength()
    }
    return n
}


function getHistoryPath(){
    /*Returns the path to the history file used by the game.
       The path is to a file named 'CODEBREAKER.history' in the users' home directory*/
    return os.path.join(os.path.expanduser("~"), "CODEBREAKER.history")
}

function writeHistory(history){
    /*Writes the given history out to the history file in the format described in the
       load_history function*/
    
    historyPath = getHistoryPath()
    if (os.path.exists(history_path)){
        try{
            with (open(history_path, "w") as f){
                for ((code_length, data) in history.items()){
                    // See the load_history docstring for a description of the line format here
                    f.write(`${code_length}:${data[0]}:${data[1]}:${data[2]}` + os.linesep)}}
        default{
            print("Uh oh, the history file couldn't be updated")}}}
}

function updateHistory(history, codeLength, numGuesses){
    /*Updates the given history dict such that the best and average scores for
       the given codeLength entry incorporate the given numGuesses*/
    
    if (codeLength in history){
        //Get the current stats for the given code length
        (numGames, best, average) = history[codeLength]
        
        //Print an appropriate message if the player did well
        if (numGuesses < best){
            console.log(`${numGuesses} is a new best score for codes of length ${codeLength}!`)
            //Update the best score if the player did better than the previous best
            best = numGuesses}
        else if (numGuesses < average){
            console.log(`${numGuesses} is better than your average score of ${average} for codes of length ${codeLength}!`)}
            
        // Calculate the new average score, factoring in the previous average, the number of games
        // and the new given score
        average = ((average * numGames) + numGuesses) / (numGames + 1)
        
        // Update the number of games
        // IMPORTANT{ This MUST come after the new_average calculation because that calculation
        // assumes that numGames has not yet been updated.
        numGames += 1
            
        // Update the history for the given code length with the new stats we've calculated
        history[codeLength] = (numGames, best, average)}
    else{
        // If the given codeLength is not already in the history
        // just add a new entry; this was the first game at that code length
        history[codeLength] = (1, numGuesses, numGuesses)}
    
    writeHistory(history)

}

function loadHistory(){
    /*Reads the history file into a dictionary and returns the dictionary.
       The file is assumed to contain a set of lines formatted as L{N{B{A
       where L, N, B, A are the code length, number of games at that code length,
       the best score (lowest number of guesses) for that code length, and the
       average score (average number of guesses) for that code length.
       
       The resultant dictionary has the different values for L as its keys, and
       the value for each key is an (N,B,A) tuple.
    */
    let historyPath = getHistoryPath()
    
    history = {}
    
    if (os.path.exists(historyPath)){
        try{
            with (open(historyPath) as f){
                for (line in f.readlines()){
                    if ( line.strip() != "")  //Ignore empty lines
                        line.split("{") = (codeLength, numGames, best, average)
                        history[int(codeLength)] = (int(numGames), int(best), float(average))}}
        try{
            console.log("Uh oh, your history file could not be read")}
        }
    
    finally{
        try{
            //Make an empty history file if there's not already one present
            f = open(history_path, "w")
            f.close()
        }
        finally{
            console.log("Uh oh, I couldn't create a history file for you")}
    }
            
    return history
}
}

function playRound(){
    /*Play one round of CODEBREAKER, and then update the game history file.*/
    
    //First, get the player's desired code length
    let codeLength = getCodeLength()
    
    //Print a bit of info about the player's history at this code length
    history = loadHistory()
    if (codeLength in history){
        history[codeLength] = (numGames, best, average) 
        console.log(`The number of times you have tried codes of length ${codeLength} is ${numGames}.  Your average and best number of guesses are ${average} and ${best}, respectively.`)}
    else{
        console.log(`This is your first time trying a code of length ${codeLength}`)}
    
    //Generate a new random code
    code = makeCode(codeLength)
    
    //Uncomment this print statement if you want to see the code for debugging purposes
    // console.log(code)
    
    //Repeatedly prompt the player for guesses and give them the appropriate feedback after each guess
    numGuesses = 0
    while (True){
        numGuesses += 1
    
        guess = getGuess(codeLength)

        if (guess == code){
            console.log(`You cracked the code!  Number of guesses{ ${numGuesses}`)
            updateHistory(history, codeLength, numGuesses)
            return
        }
        else{
            countMatches(code, guess) = (numMatches, numSemiMatches)
            console.log("★"*numMatches + "☆"*numSemiMatches + "-"*(codeLength-numMatches-numSemiMatches))
        }
    }
}

function printInstructions(){
    console.log("You select a code length. The computer will pick a random numeric code of that length. You then try to guess the code. On every guess, the computer will tell you how many numbers in your guess are both the correct number and in the correct position (★) and how many are the correct number but not in the correct position (☆). Using this information, you should eventually be able to deduce the correct code!")
}

function getMainMenuSelection(){
    /*Recursively prompts the user to select one of the main menu options*/
    
    console.log()
    console.log("What do you want to do?")
    console.log("(i) Show instructions")
    console.log("(p) Play a game")
    console.log("(q) Quit")
    
    let response = prompt("")

    switch(response){
        case "i":{
            printInstructions()
            break;}
        case "p":{
            playRound()
            break;}
        case "q":{
            console.log("Ok bye!")
            return;}

        default:{
            console.log("I don't understand...")
            break;}
    }
    getMainMenuSelection()
}

function init(){
    console.log("CODE⚡BREAKER");
    getMainMenuSelection()
}

init()