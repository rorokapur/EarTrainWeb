let score;
let et;
document.addEventListener('DOMContentLoaded', ()=>{
    Controls.init();
    et = new EarTraining();
    // temporary UI change message.
    document.getElementById("ui-message-close").addEventListener("click",()=>{
        localStorage.setItem("ui-message-dismissed", 1);
    });
    if(localStorage.getItem("ui-message-dismissed") != 1){
        document.getElementById("new-ui-message").style.display="block";
        document.getElementById("new-ui-message").style.opacity="0"
        setTimeout(()=>{document.getElementById("new-ui-message").style.opacity="1";}, 0);
        document.querySelector(':root').style.setProperty('--body-blur', "blur(0.2rem)")
    }
})
class DarkMode{
    static dark(){
        document.getElementById("dark-mode-toggle").style.visibility = "visible";
        document.getElementById("dark-mode-toggle").style.position = "relative";
        document.getElementById("light-mode-toggle").style.visibility = "hidden";
        document.getElementById("light-mode-toggle").style.position = "absolute";
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    static light(){
        document.getElementById("light-mode-toggle").style.visibility = "visible";
        document.getElementById("light-mode-toggle").style.position = "relative";
        document.getElementById("dark-mode-toggle").style.visibility = "hidden";
        document.getElementById("dark-mode-toggle").style.position = "absolute";
        document.documentElement.setAttribute('data-theme', 'light');
    }
}
class Controls{
    static init(){
        document.querySelectorAll(".note-button").forEach((button)=>{
            button.addEventListener("click", ()=>{
                document.getElementById("clear-notes").style.visibility = "visible";
                let el = document.createElement('div');
                el.innerText = button.innerText;
                el.classList.add("note");
                el.setAttribute("data-note", button.getAttribute("data-note"));
                document.getElementById("notes").append(el);
                document.getElementById("notes").scrollBy(100,0);
                
            })
        });
        document.getElementById("clear-notes").addEventListener("click", ()=>{
            document.getElementById("clear-notes").style.visibility = "hidden";
            let delay = 0;
            Array.from(document.querySelectorAll('.note')).reverse().forEach((note)=>{
    
                setTimeout(()=>{
                    note.style.scale = "0";
                    setTimeout(()=>{note.remove();}, 200);
                }, delay);
                delay += 15;
    
            });
    
    
        });
        document.querySelectorAll(".menu-button").forEach((button)=>{
            let id = button.dataset.menu;
            document.querySelectorAll(".menu").forEach((menu)=>{
                if (menu.dataset.menu == id){
                    button.addEventListener("click",()=>{
                        menu.style.display="block";
                        menu.style.opacity="0"
                        setTimeout(()=>{menu.style.opacity="1";}, 0);
                        document.querySelector(':root').style.setProperty('--body-blur', "blur(0.2rem)")
                    })
                }
            })
        });
        document.querySelectorAll(".menu-close").forEach((button)=>{
            let parent = button.parentElement;
            button.addEventListener("click",()=>{
                parent.style.opacity="0";
                setTimeout(()=>{parent.style.display="none";}, 250);
                document.querySelector(':root').style.setProperty('--body-blur', "")
            })
        });
        document.getElementById("settings-notes").addEventListener("input", (event)=>{
            if(document.getElementById("settings-notes").value < document.getElementById("settings-chromatics").value){
                document.getElementById("settings-chromatics").value = document.getElementById("settings-notes").value;
            };
            if (document.getElementById("settings-notes").value < 6){
                document.getElementById("settings-chromatics").max = document.getElementById("settings-notes").value;
                et.chromatics = document.getElementById("settings-chromatics").value;
            }
            document.getElementById("notes-value").innerText = document.getElementById("settings-notes").value;
            document.getElementById("chromatics-value").innerText = document.getElementById("settings-chromatics").value;
            et.notes = document.getElementById("settings-notes").value;
            localStorage.setItem("notes_preference", et.notes);
            localStorage.setItem("chromatics_preference", et.chromatics);
            et.newChord();

        });
        document.getElementById("settings-chromatics").addEventListener("input", (event)=>{
            document.getElementById("chromatics-value").innerText = document.getElementById("settings-chromatics").value;
            et.chromatics = document.getElementById("settings-chromatics").value;
            localStorage.setItem("chromatics_preference", et.chromatics);
            et.newChord();
        });
        return;
    }
}
class EarTraining{
    notes = 1;
    chromatics = 0;
    key = 1;
    randomKey = true;
    input;
    exercise;
    controls;
    correct = 0;
    incorrect = 0;
    keylistens;
    notelistens;
    attempts;
    constructor(){
        this.newChord();
        this.score = new ScoreBar(document.getElementById("correctVal"),document.getElementById("incorrectVal"),document.getElementById("meter-green"),document.getElementById("meter-red"));
        this.input = document.getElementById('note-selector');
        document.getElementById('enter').addEventListener('click',()=>{this.checkAnswer()});
        this.controls = document.querySelector('#flow-controls');
        document.getElementById('play-chord').addEventListener('click', ()=>{this.playChord()});
        document.getElementById('play-key').addEventListener('click', ()=>{this.playKey()});
        if (localStorage.getItem("correct_answers") != null){
            this.correct = localStorage.getItem("correct_answers");
        } else {
            localStorage.setItem("correct_answers", 0);
        }
        if (localStorage.getItem("incorrect_answers") != null){
            this.incorrect = localStorage.getItem("incorrect_answers");
        } else {
            localStorage.setItem("incorrect_answers", 0);
        }
        if (localStorage.getItem("notes_preference") != null){
            this.notes = localStorage.getItem("notes_preference");
        } else {
            localStorage.setItem("notes_preference", this.notes);
        }
        document.getElementById("settings-notes").value = this.notes;   
        document.getElementById("notes-value").innerText = document.getElementById("settings-notes").value;
        if (localStorage.getItem("chromatics_preference") != null){
            this.chromatics = localStorage.getItem("chromatics_preference");
        } else {
            localStorage.setItem("chromatics_preference", this.chromatics);
        }
        if(this.chromatics > this.notes){this.chromatics = this.notes;}
        localStorage.setItem("chromatics_preference", this.chromatics);
        document.getElementById("settings-chromatics").value = this.chromatics;   
        document.getElementById("chromatics-value").innerText = document.getElementById("settings-chromatics").value;
        if (document.getElementById("settings-notes").value < 6){
            document.getElementById("settings-chromatics").max = document.getElementById("settings-notes").value;
            this.chromatics = document.getElementById("settings-chromatics").value;
        }
        this.newChord();
        
    }
    playKey(){
        this.keylistens++
        document.querySelector('#infobox').classList.remove("correct");
        document.querySelector('#infobox').classList.remove("incorrect");
        document.querySelector('#bigtext').innerText = "Playing key...";
        let kp = "s";
        if (this.keylistens == 1){
            kp = ""
        }
        let np = "s";
        if (this.notelistens == 1){
            np = ""
        }
        document.querySelector('#littletext').innerText = "Once you know where Do is, listen to the notes.\nYou have listened to the key " + this.keylistens + " time" + kp + " and the notes " + this.notelistens + " time" + np + ".";
        this.exercise.playKey();
    }
    playChord(){
        this.notelistens++;
        document.querySelector('#infobox').classList.remove("correct");
        document.querySelector('#infobox').classList.remove("incorrect");
        document.querySelector('#bigtext').innerText = "Playing notes...";
        let kp= "s";
        if (this.keylistens == 1){
            kp = ""
        }
        let np = "s";
        if (this.notelistens == 1){
            np = ""
        }
        document.querySelector('#littletext').innerText = "Figure out the solfege of each note and enter your answer below.\nYou have listened to the key " + this.keylistens + " time" + kp + " and the notes " + this.notelistens + " time" + np + ".";
        this.exercise.playChord();
    }
    checkAnswer(){
        if(this.notelistens == 0){return;}
        this.attempts++;
        let answer = [];
        document.querySelectorAll('.note').forEach((el)=>{
            answer.push(el.dataset.note);
        })
        let delay = 0;
        Array.from(document.querySelectorAll('.note')).reverse().forEach((note)=>{

            setTimeout(()=>{
                note.style.scale = "0";
                setTimeout(()=>{note.remove();}, 200);
            }, delay);
            delay += 15;

        });
        if(this.exercise.checkAnswer(answer)){
            this.score.increaseLeft();
            this.correct++;
            this.newChord();
            document.querySelector('#infobox').classList.remove("incorrect");
            document.querySelector('#infobox').classList.add("correct");
            document.querySelector('#bigtext').innerText = "Correct!";
            document.querySelector('#littletext').innerText = "Play the new key or notes to continue";
            this.newChord();
        } else {
            if(answer.length == 0 && this.attempts > 1){
                document.querySelector('#infobox').classList.remove("correct");
                document.querySelector('#infobox').classList.add("incorrect");
                document.querySelector('#bigtext').innerText = "You gave up!";
                document.querySelector('#littletext').innerText = "The answer was " + this.exercise.answer.join(" ") + ".\nPlay the next key or notes to continue.";
                this.newChord();
                return;

            }
            if(this.attempts == 1){
                this.score.increaseRight();
                this.incorrect++;
            }
            document.querySelector('#infobox').classList.remove("correct");
            document.querySelector('#infobox').classList.add("incorrect");
            document.querySelector('#bigtext').innerText = "Incorrect!";
            document.querySelector('#littletext').innerText = "Give it another listen any try again or submit a blank answer to give up.";
        }
    }
    newChord(){
        this.keylistens = 0;
        this.notelistens = 0;
        this.attempts = 0;
        if (this.randomKey){
            this.exercise = new Exercise(this.notes, this.chromatics);
        } else {
            this.exercise = new Exercise(this.notes, this.chromatics, this.key);
        }
    }
}

class ScoreBar{
    leftText;
    rightText;
    leftBar;
    rightBar;
    left;
    right;

    constructor(leftText, rightText, leftBar, rightBar){
        this.leftText = leftText;
        this.rightText = rightText;
        this.leftBar = leftBar;
        this.rightBar = rightBar;
        this.left = 0;
        this.right = 0;
    }
    increaseLeft(){
        this.left++;
        this.leftText.innerText = this.left;
        if(this.right == 0){
            this.leftBar.style.width = "100%";
            this.rightBar.style.width = "0%"
            return;
        }
        this.leftBar.style.width = (this.left/(this.right + this.left)) * 100 + "%";
        this.rightBar.style.width = (100 - (this.left/(this.right + this.left)) * 100) + "%";
    }
    increaseRight(){
        this.right++;
        this.rightText.innerText = this.right;
        if(this.left == 0){
            this.rightBar.style.width = "100%";
            this.leftBar.style.width = "0%"
            return;
        }
        this.leftBar.style.width = (this.left/(this.right + this.left)) * 100 + "%";
        this.rightBar.style.width = (100 - (this.left/(this.right + this.left)) * 100) + "%";
    }
    decreaseLeft(){
        if (this.left < 1){return;}
        this.left--;
        this.leftText.innerText = this.left;
        if(this.left < 1){
            this.leftBar.style.width = "0%";
        }
        this.leftBar.style.width = (this.left/(this.right + this.left)) * 100 + "%";
        this.rightBar.style.width = (100 - (this.left/(this.right + this.left)) * 100) + "%";
    }
    decreaseRight(){
        if (this.right < 1){return;}
        this.right--;
        this.rightText.innerText = this.right;
        if(this.right < 1){
            this.rightBar.style.width = "0%"
        }
        this.leftBar.style.width = (this.left/(this.right + this.left)) * 100 + "%";
        this.rightBar.style.width = (100 - (this.left/(this.right + this.left)) * 100) + "%";
    }
    reset(){
        this.leftText.innerText = 0;
        this.rightText.innerText = 0;
        this.rightBar.style.width= "0%";
        this.leftBar.style.width = "0%";
        this.left = 0;
        this.right = 0;
    }
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
    constructor(notes, chromatics, key = (Math.floor(Math.random() * 12) + 1)){
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
            tempChord[index]+=key - 1;
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
    checkAnswer(input){
        let correct = true
        if (input.length != this.answer.length){correct = false;}
        input.forEach((note, index)=>{
            if (note != this.answer[index]){correct = false}
        })
        return correct;
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

