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
class Settings{
    static notes = 3;
    static chromatics = 0;
    static key = 1;
    static multipleTries = true;
    static randomKey = true;
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

