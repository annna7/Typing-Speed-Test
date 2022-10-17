let minusMarginTop = 0;

// Checks whether the words within the box have reached a new line
function isNewLine(prevWord, currWord) {
    textboxtext = document.querySelector("#textboxtext");
    let currWordRect = currWord.getBoundingClientRect();
    let prevWordRect = prevWord.getBoundingClientRect();
    if (prevWordRect.top != currWordRect.top){
        minusMarginTop -= 47;
        textboxtext.style.marginTop = minusMarginTop + "px";
    }
}

// Loads the words into the textbox
document.addEventListener('DOMContentLoaded', function(){
    var word_list = [];
    "{% for word in word_list %}"
    word_list.push("{{ word }}");
    "{% endfor %}"
    let correct_count = 0;
    let count = 0;
    let correct_character_count = 0;
    let start = false;
    let writebox = document.querySelector("#writebox");
    writebox.addEventListener('keypress', function(event){
        if (start == false){
            let seconds = 60;
            var counter = document.querySelector("#timer");
            function tick() {
                seconds--;
                if (seconds < 10) {
                    counter.innerHTML = "00:0" + seconds;
                }
                else {
                    counter.innerHTML = "00:" + seconds;
                }

                if (seconds > 0) {
                    setTimeout(tick, 1000);
                }
                else {
                    let wpm = Math.ceil((correct_character_count + count - 1) / 5);
                    let accuracy = (correct_count / count) * 100;
                    accuracy = parseFloat(accuracy).toFixed(2);
                    let correct = correct_count;
                    let incorrect = count - correct_count;
                    document.querySelector("#results").innerHTML = "Congratulations! Your results are the following: ";
                    document.querySelector("#wps1").innerHTML = "WPM: ";
                    document.querySelector("#wps2").innerHTML = wpm.toString();
                    document.querySelector("#acc1").innerHTML = "Accuracy: ";
                    document.querySelector("#acc2").innerHTML = accuracy.toString() + "%";
                    document.querySelector("#corr1").innerHTML = "Correct words: ";
                    document.querySelector("#corr2").innerHTML = correct.toString();
                    document.querySelector("#wr1").innerHTML = "Incorrect words: ";
                    document.querySelector("#wr2").innerHTML = incorrect.toString();

                    document.querySelector("#writebox").disabled = true;
                }
            }
            let firstWordIndex = 1;
            firstWord = document.querySelector(".textbox span:nth-child("+ firstWordIndex +")");
            firstWord.style.color = 'purple';
            tick();
            start = true;
        }
        if (event.keyCode == 32) {
            count += 1;
            let curr = count;
            let currWord;
            currWord = document.querySelector(".textbox span:nth-child(" + curr + ")");
            typed_word = document.querySelector("#writebox").value.trim();
            if (typed_word == currWord.innerHTML){
                correct_count += 1;
                console.log(currWord.innerHTML);
                correct_character_count += typed_word.length;
                currWord.style.color = 'green';
            }
            else {
                currWord.style.color = 'red';
            }
            document.querySelector("#writebox").value = "";
            let futureWord;
            let futureWordIndex = count + 1;
            futureWord = document.querySelector(".textbox span:nth-child("+ futureWordIndex +")");
            futureWord.style.color='purple';

            isNewLine(currWord, futureWord);
        }
    });
});