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
Array.prototype.getRandomSubarray = function(size){
    let shuffled = this.slice(0), i = this.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
class Solfege{
    static get diatonic() {
        return [1,3,5,6,8,10,12];
    }
    static get chromatic() {
        return [2,4,7,9,11];
    }
    static get solfege() {
        return ["ti","do","di-ra","re","ri-me","mi","fa","fi-se","so","si-le","la","li-te","ti","do","di-ra","re","ri-me","mi","fa","fi-se","so","si-le","la","li-te","ti","do"];
    }
}
class Exercise{
    static octaves = true;
    chord;
    answer;
    key;
    audio;
    constructor(notes, chromatics, key = Math.floor(Math.random() * 12)){
        this.key = key;
        let d = Solfege.diatonic.getRandomSubarray(notes - chromatics);
        let c = Solfege.chromatic.getRandomSubarray(chromatics);
        let tempChord = d.concat(c);
        if (this.octaves && Math.round(Math.random()) == 1){
            tempChord.forEach((note, index) => {
                if(Math.round(Math.random()) == 1){
                    tempChord[index] += 12;
                }
            });
        }
        tempChord.sort((a, b) => a - b);
        this.answer = [];
        tempChord.forEach((note, index) => {
            this.answer.push(Solfege.solfege[note]);
            tempChord[index]+=key;
        });
        this.chord = [...tempChord];
        this.audio = new Sound(this.chord, "assets/notes/", this.key, "assets/keys/", "wav");
    }
    playChord(){
        this.audio.playChord();
    }
    playKey(){
        this.audio.playKey();
    }
}

class Sound {
    chord;
    key;
    constructor(notes, notePath, key, keyPath, format){
        this.chord = [];
        notes.forEach((note)=>{
            this.chord.push(new Howl({src: [notePath + note + "." + format]}))
        });
        this.key = new Howl({src: [keyPath + key + "." + format]});
    }
    playChord(){
        this.chord.forEach((note)=>{
            note.play();
        })
    }
    playKey(){
        this.key.play();
    }
}
let chord = [];
let answer = [];
let answerText = "";
let keyModifier = 0;
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
    let diaNotes = getRandomSubarray(Solfege.diatonic,dia);
    let chromNotes = getRandomSubarray(Solfege.chromatic,chrom);
    //combine and sort notes
    chord = diaNotes.concat(chromNotes);
    for (note = 0; note < chord.length; note++){
        let octave = Math.round(Math.random() * 1);
        if (octave==2){
            chord[note]+=12;
        }

    };
    chord.sort((a, b) => a - b);
    answer = [...chord];
    //generate answer string
    for (let note = 0; note < chord.length; note++){
        answerText+=Solfege.solfege[chord[note]]+" ";
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
        document.getElementById("feedback-box").classList.remove("alert-secondary");
        document.getElementById("feedback-box").classList.remove("alert-danger");
        document.getElementById("feedback-box").classList.add("alert-success");
        document.getElementById("feedback").innerHTML = 'Correct!';
        document.getElementById("feedback-text").innerHTML = 'Click "New Notes" to continue.';
        document.getElementById("reveal").style.display = "none";
    } 
    else {
        document.getElementById("feedback-box").classList.remove("alert-success");
        document.getElementById("feedback-box").classList.remove("alert-secondary");
        document.getElementById("feedback-box").classList.add("alert-danger");
        document.getElementById("feedback").innerHTML = 'Incorrect!';
        document.getElementById("feedback-text").innerHTML = 'Try again.';
        document.getElementById("reveal").style.display = "inline";
    }; 
};

document.addEventListener("DOMContentLoaded", function(){
    $('select').selectpicker();
    document.getElementById("reveal").style.display = "none";
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
        document.getElementById("feedback-box").classList.remove("alert-success");
        document.getElementById("feedback-box").classList.remove("alert-danger");
        document.getElementById("feedback-box").classList.add("alert-secondary");
        document.getElementById("feedback").innerHTML = 'Enter your answer';
        document.getElementById("feedback-text").innerHTML = 'Click "Check Answer" to continue.';
        document.getElementById("reveal").style.display = "none";

    });
    document.getElementById("checkAnswer").addEventListener("click", function(){
        checkAnswer();
    
    });
    document.getElementById("reveal").addEventListener("click", function(){
        document.getElementById("reveal").style.display = "none";
        let message="The answer was: "+answerText;
        document.getElementById("feedback-text").innerHTML = message;
    
    });
    document.getElementById("answer").addEventListener("keydown", function(key){
        if (key.code == "Enter") {  //checks whether the pressed key is "Enter"
            checkAnswer();
        }

    });
  });