import $ from  "jquery";

let currWord="";



function processData(allText) {
    if (allText==undefined){
        return currWord;
    }
    var allTextLines = allText.split("\n");
    
    var randomChoice = Math.floor(Math.random() * (allTextLines.length-1)+1);

    currWord=allTextLines[randomChoice].split(",")[0];
    while (currWord.length>6 || currWord.length<3 || !(/^[a-zA-Z]+$/.test(currWord))){
        randomChoice = Math.floor(Math.random() * (allTextLines.length-1)+1);
        currWord=allTextLines[randomChoice].split(",")[0];
    }
    currWord=currWord.toLowerCase();
    //console.log("end: " + currWord);
    return currWord;
}
export default processData;