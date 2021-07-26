diatonic = [1,3,5,6,8,10,12];
chromatic = [2,4,7,9,11];
let chord = [];
let answer;
keyModifier = 0;
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
    // init letiables
    chord = [];
    answer = "";
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
    //generate answer string
    for (note = 0; note < chord.length; note++){
        answer+=solfege[chord[note]]+" ";
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
    let inputAnswer = document.getElementById("answer").value;
    inputAnswer = inputAnswer.replace(/\s/g, '');
    inputAnswer = inputAnswer.toLowerCase();
    fixedAnswer = answer.replace(/\s/g, '');
    if (inputAnswer==fixedAnswer) {
        $('#feedback-box').removeClass("alert-secondary");
        $('#feedback-box').removeClass("alert-danger");
        $('#feedback-box').addClass("alert-success");
        $('#feedback').text("Correct!");
        $('#feedback-text').text('Click "New Notes" to continue.');
        $('#reveal').hide();
    } else {
        let warning = "Incorrect! The answer is: " + answer
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
        let message="The answer was: "+answer;
        $('#feedback-text').text(message)
    
    });
    document.getElementById("answer").addEventListener("keydown", function(key){
        if (key.code == "Enter") {  //checks whether the pressed key is "Enter"
            checkAnswer();
        }

    });
  });