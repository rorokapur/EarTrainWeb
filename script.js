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
        document.querySelectorAll('.note').forEach((note)=>{
            note.style.scale = "0";
        });
        setTimeout(()=>{document.getElementById("notes").innerHTML="";}, 200)
        document.getElementById("clear-notes").style.visibility = "hidden";


    });
    score = new ScoreBar(document.getElementById("correctVal"),document.getElementById("incorrectVal"),document.getElementById("meter-green"),document.getElementById("meter-red"));
})




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