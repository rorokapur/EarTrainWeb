let score;
document.addEventListener('DOMContentLoaded', ()=>{
    score = new Score(document.getElementById("correctVal"),document.getElementById("incorrectVal"),document.getElementById("meter-green"),document.getElementById("meter-red"));
})





class Score{
    correctText;
    incorectText;
    greenEl;
    redEl;
    correctVal;
    incorrectVal;

    constructor(correctText, incorrectText, greenEl, redEl){
        this.correctText = correctText;
        this.incorrectText = incorrectText;
        this.greenEl = greenEl;
        this.redEl = redEl;
        this.correctVal = 0;
        this.incorrectVal = 0;
    }
    correct(){
        this.correctVal++;
        this.correctText.innerText = this.correctVal;
        if(this.incorrectVal == 0){
            this.greenEl.style.width = "100%";
            return;
        }
        this.greenEl.style.width = (this.correctVal/(this.incorrectVal + this.correctVal)) * 100 + "%";
        this.redEl.style.width = (100 - (this.correctVal/(this.incorrectVal + this.correctVal)) * 100) + "%";
    }
    incorrect(){
        this.incorrectVal++;
        this.incorrectText.innerText = this.incorrectVal;
        if(this.correctVal == 0){
            this.redEl.style.width = "100%";
            return;
        }
        this.greenEl.style.width = (this.correctVal/(this.incorrectVal + this.correctVal)) * 100 + "%";
        this.redEl.style.width = (100 - (this.correctVal/(this.incorrectVal + this.correctVal)) * 100) + "%";
    }
    reset(){
        this.correctText.innerText = 0;
        this.incorrectText.innerText = 0;
        this.redEl.style.width= "0%";
        this.greenEl.style.width = "0%";
        this.correctVal = 0;
        this.incorrectVal = 0;
    }
}