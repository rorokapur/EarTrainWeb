diatonic = [1,3,5,6,8,10,12];
chromatic = [2,4,7,9,11];
let chord = [];
let answer = [];
let answerText = "";
let keyModifier = 0;
solfege = ["ti","do","ra","re","me","mi","fa","fi","so","le","la","te","ti","do","ra","re","me","mi","fa","fi","so","le","la","te","ti","do"];
function getRandomSubarray(arr, size) {
    let shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
function generate(numPref,chromPref){
    //clear answer field
    document.getElementById('answer').value='';
    //check for invalid settings
    if (chromPref>numPref){
        return
    }
    // init variables
    chord = [];
    answer = [];
    answerText = "";
    //generate diatonics and chromatics
    let dia=numPref-chromPref;
    let chrom=chromPref;
    let diaNotes = getRandomSubarray(diatonic,dia);
    let chromNotes = getRandomSubarray(chromatic,chrom);
    //combine and sort notes
    chord = diaNotes.concat(chromNotes);
    for (note = 0; note < chord.length; note++){
        let octave = Math.round(Math.random());
        if (octave==1){
            chord[note]+=12;
        }

    };
    chord.sort((a, b) => a - b);
    answer = [...chord];
    //generate answer string
    for (let note = 0; note < chord.length; note++){
        answerText+=solfege[chord[note]]+" ";
    };
    //apply key
    keyModifier = Math.floor(Math.random() * 12);
    for (note = 0; note < chord.length; note++){
        chord[note]+=keyModifier;
    };
    //load notes wavs
    notes = [];
    for (note = 0; note < chord.length; note++){
        noteNumber = chord[note].toString();
        fileName = "assets/notes/" + noteNumber + ".wav";
        notes[note] = new  Howl({
            src: [fileName]
        });
    };
    //load key signature wav
    key = keyModifier+1
    fileName = "assets/keys/" + key + ".wav";
    keyAudio = new Howl({
        src: [fileName]
    });
};
function playChord(){
    //play note wavs
    for (note = 0; note < chord.length; note++){
        notes[note].play();
    };  
};
function playKey(){
    keyAudio.play();
}
function checkAnswer(){
    let correctAnswer;
    let inputAnswer = document.getElementById("answer").value;
    inputAnswer = inputAnswer.toLowerCase();
    inputArray = inputAnswer.split(" ");
    console.log(inputArray);
    for (let i = 0; i < inputArray.length; i++){
        if (inputArray[i]=="do"){
            inputArray[i]=1;
        }
        if (inputArray[i]=="di"||inputArray[i]=="ra"){
            inputArray[i]=2;
        }
        if (inputArray[i]=="re"){
            inputArray[i]=3;
        }
        if (inputArray[i]=="ri"||inputArray[i]=="me"){
            inputArray[i]=4;
        }
        if (inputArray[i]=="mi"){
            inputArray[i]=5;
        }
        if (inputArray[i]=="fa"){
            inputArray[i]=6;
        }
        if (inputArray[i]=="fi"){
            inputArray[i]=7;
        }
        if (inputArray[i]=="so"||inputArray[i]=="sol"){
            inputArray[i]=8;
        }
        if (inputArray[i]=="si"||inputArray[i]=="le"){
            inputArray[i]=9;
        }
        if (inputArray[i]=="la"){
            inputArray[i]=10;
        }
        if (inputArray[i]=="li"||inputArray[i]=="te"){
            inputArray[i]=11;
        }
        if (inputArray[i]=="ti"){
            inputArray[i]=12;
        }
    }
    console.log(inputArray);
    for (let i = 0; i < answer.length; i++){
        if (inputArray[i]==answer[i]||inputArray[i]==answer[i]-12){
            correctAnswer = true;
        }
        else{
            correctAnswer = false;
            break;
        }

    }
    if (correctAnswer) {
        $('#feedback-box').removeClass("alert-secondary");
        $('#feedback-box').removeClass("alert-danger");
        $('#feedback-box').addClass("alert-success");
        $('#feedback').text("Correct!");
        $('#feedback-text').text('Click "New Notes" to continue.');
        $('#reveal').hide();
    } 
    else {
        $('#feedback-box').removeClass("alert-success");
        $('#feedback-box').removeClass("alert-secondary");
        $('#feedback-box').addClass("alert-danger");
        $('#feedback').text("Incorrect!");
        $('#feedback-text').text('Try again.');
        $('#reveal').show();
    };
};

document.addEventListener("DOMContentLoaded", function(){
    $('select').selectpicker();
    $('#reveal').hide();
    generate(1,0)
    document.getElementById("playKey").addEventListener("click", function(){
        playKey();
    });
    document.getElementById("playChord").addEventListener("click", function(){
        playChord();
    });
    document.getElementById("generate").addEventListener("click", function(){
        let noteSelector = document.getElementById("notes");
        noteSelection = noteSelector.value;
        let chromSelector = document.getElementById("chromatics");
        chromSelection = chromSelector.value;
        generate(noteSelection,chromSelection);
        $('#feedback-box').removeClass("alert-success");
        $('#feedback-box').removeClass("alert-danger");
        $('#feedback-box').addClass("alert-secondary");
        $('#feedback').text("Enter your answer");
        $('#feedback-text').text('Click "Check Answer" to continue.');
        $('#reveal').hide();

    });
    document.getElementById("checkAnswer").addEventListener("click", function(){
        checkAnswer();
    
    });
    document.getElementById("reveal").addEventListener("click", function(){
        $('#reveal').hide();
        let message="The answer was: "+answerText;
        $('#feedback-text').text(message)
    
    });
    document.getElementById("answer").addEventListener("keydown", function(key){
        if (key.code == "Enter") {  //checks whether the pressed key is "Enter"
            checkAnswer();
        }

    });
  });