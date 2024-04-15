let score;
document.addEventListener('DOMContentLoaded', ()=>{
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
    score = new ScoreBar(document.getElementById("correctVal"),document.getElementById("incorrectVal"),document.getElementById("meter-green"),document.getElementById("meter-red"));
})


class EarTraining{
    notes = 3;
    chromatics = 0;
    key = 1;
    multipleTries = true;
    randomKey = true;
    input;
    exercise;
    controls;
    constructor(controls, input){
        this.input = input;
        this.input.querySelector('#enter').addEventListener('click',this.submit());
        this.controls = controls;
        this.controls.querySelector('#play-chord').addEventListener('click', this.playChord());
        this.controls.querySelector('#play-key').addEventListener('click', this.playKey());
        if (this.randomKey){
            this.exercise = new Exercise(this.notes, this.chromatics);
        } else {
            this.exercise = new Exercise(this.notes, this.chromatics, this.key);
        }
    }
    playKey(){
        this.exercise.playKey();
    }
    playChord(){
        this.exercise.playChord();
    }
    submit(){
        let answer = [];
        this.input.querySelectorAll('.note').forEach((el)=>{
            answer.push(el.dataset.note);
        })
        this.exercise.checkAnswer(answer);
    }
    newChord(){

    }
    clearInput(){

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

