diatonic = [1,3,5,6,8,10,12];
chromatic = [2,4,7,9,11];
let chord = [];
let answer = [];
let answerText = "";
let keyModifier = 0;
solfege = ["ti","do","ra","re","me","mi","fa","fi","so","le","la","te","ti","do","ra","re","me","mi","fa","fi","so","le","la","te","ti","do"];
let parameters = new URLSearchParams(window.location.search);
let generatorParams = parameters.get('n');
let showAnswer = parameters.get('sa');
let generatorSettings = Array.from(generatorParams.toString());
let numberOfExcercises = 0;
let excersizeCounter = [];
let currentExcersize = 1;
for (i=0; i<generatorSettings.length; i ++){
    excersizeCounter[i]=generatorSettings[i];
}
console.log(generatorSettings);
while(excersizeCounter.length!==0){
    let numPref = excersizeCounter.shift();
    for (i = 0; i < numPref; i++){
        excersizeCounter.shift();
        
        

    };
    numberOfExcercises+=1;


}

console.log(numberOfExcercises);
for (i=0; i < generatorSettings.length; i++){
    if (generatorSettings[i]=="0"){
        generatorSettings[i]="10";
    }
    if (generatorSettings[i]=="q"){
        generatorSettings[i]="11";
    }
    if (generatorSettings[i]=="w"){
        generatorSettings[i]="12";
    }
    if (generatorSettings[i]=="e"){
        generatorSettings[i]="13";
    }
    if (generatorSettings[i]=="r"){
        generatorSettings[i]="14";
    }
    if (generatorSettings[i]=="t"){
        generatorSettings[i]="15";
    }
    if (generatorSettings[i]=="y"){
        generatorSettings[i]="16";
    }
    if (generatorSettings[i]=="u"){
        generatorSettings[i]="17";
    }
    if (generatorSettings[i]=="i"){
        generatorSettings[i]="18";
    }
    if (generatorSettings[i]=="o"){
        generatorSettings[i]="19";
    }
    if (generatorSettings[i]=="p"){
        generatorSettings[i]="20";
    }
    if (generatorSettings[i]=="a"){
        generatorSettings[i]="21";
    }
    if (generatorSettings[i]=="s"){
        generatorSettings[i]="22";
    }
    if (generatorSettings[i]=="d"){
        generatorSettings[i]="23";
    }
    if (generatorSettings[i]=="f"){
        generatorSettings[i]="24";
    }
    generatorSettings[i] = parseInt(generatorSettings[i])
}
console.log(generatorSettings);
function generate(){
    if (generatorSettings.length == 0){
        document.body.innerHTML = '';

    };
    

    //clear answer field
    document.getElementById('answer').value='';
    //check for invalid settings
    // init variables
    chord = [];
    answer = [];
    answerText = "";
    //generate diatonics and chromatics
    let numPref = generatorSettings.shift();
    console.log(numPref);
    for (i = 0; i < numPref; i++){
        chord[i]=generatorSettings.shift();
        

    };
    chord.sort((a, b) => a - b);
    answer = [...chord];
    //generate answer string
    for (let note = 0; note < chord.length; note++){
        answerText+=solfege[chord[note]]+" ";
    };
    console.log(answer);
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
        $('#feedback-text').text('Click "Next" to continue.');
        $('#reveal').hide();
    } 
    else {
        let warning = "Incorrect! The answer is: " + answer
        $('#feedback-box').removeClass("alert-success");
        $('#feedback-box').removeClass("alert-secondary");
        $('#feedback-box').addClass("alert-danger");
        $('#feedback').text("Incorrect!");
        $('#feedback-text').text('Try again.');
        if (showAnswer=="true"){
            $('#reveal').show();
        }
    };
};

document.addEventListener("DOMContentLoaded", function(){





    let titleString = "Solfege Ear Training - " + currentExcersize.toString() + "/" + numberOfExcercises.toString();
    document.getElementById("title").innerHTML=titleString;
    $('select').selectpicker();
    $('#reveal').hide();
    generate();
    document.getElementById("playKey").addEventListener("click", function(){
        playKey();
    });
    document.getElementById("playChord").addEventListener("click", function(){
        playChord();
    });
    document.getElementById("generate").addEventListener("click", function(){
        currentExcersize+=1;
        let titleString = "Solfege Ear Training - " + currentExcersize.toString() + "/" + numberOfExcercises.toString();
        document.getElementById("title").innerHTML=titleString;
        generate();
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