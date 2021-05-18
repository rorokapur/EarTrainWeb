diatonic = [1,3,5,6,8,10,12,13,15,17,18,20,22,24,25];
chromatic = [2,4,7,9,11,14,16,19,21,23];
var chord = [];
var answer;
keyModifier = 0;
solfege = ["ti","do","ra","re","me","mi","fa","fi","so","le","la","te","ti","do","ra","re","me","mi","fa","fi","so","le","la","te","ti","do"];
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
function generate(numPref,chromPref){
    //check for invalid settings
    if (chromPref>numPref){
        return
    }
    // init variables
    chord = [];
    answer = ""
    //generate diatonics and chromatics
    var dia=numPref-chromPref;
    var chrom=chromPref;
    var diaNotes = getRandomSubarray(diatonic,dia);
    var chromNotes = getRandomSubarray(chromatic,chrom);
    //combine and sort notes
    chord = diaNotes.concat(chromNotes);
    chord.sort((a, b) => a - b);
    //generate answer string
    for (note = 0; note < chord.length; note++){
        answer+=solfege[chord[note]]+" ";
    };
    //apply key
    keyModifier = Math.floor(Math.random() * 12);
    for (note = 0; note < chord.length; note++){
        chord[note]+=keyModifier;
    };
};
function playChord(){
    for (note = 0; note < chord.length; note++){
        noteNumber = chord[note].toString();
        fileName = "assets/notes/" + noteNumber + ".wav";
        file = new Audio(fileName);
        file.play();
    };
};
function playKey(){
    key = keyModifier+1
    fileName = "assets/keys/" + key + ".wav";
        file = new Audio(fileName);
        file.play();
}

document.addEventListener("DOMContentLoaded", function(){
    generate(1,0)
    document.getElementById("playKey").addEventListener("click", function(){
        playKey();
    });
    document.getElementById("playChord").addEventListener("click", function(){
        playChord();
    });
    document.getElementById("generate").addEventListener("click", function(){
        var noteSelector = document.getElementById("notes");
        noteSelection = noteSelector.value;
        var chromSelector = document.getElementById("chromatics");
        chromSelection = chromSelector.value;
        generate(noteSelection,chromSelection);

    });
    document.getElementById("checkAnswer").addEventListener("click", function(){
        var inputAnswer = document.getElementById("answer").value;
        inputAnswer = inputAnswer.replace(/\s/g, '');
        inputAnswer = inputAnswer.toLowerCase();
        fixedAnswer = answer.replace(/\s/g, '');
        if (inputAnswer==fixedAnswer) {
            alert("Correct!");
        } else {
            var warning = "Incorrect! Answer is: " + answer
            alert(warning)
        };

    });
  });