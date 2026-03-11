async function pickCup(e) {
    if(!window.readyToPick) {
        return;
    }
    let cupElement = e.target;
    console.log(cupElement)
    let cupHasBall = cupElement.classList.contains("ball")
    if(!window.ballPlaced) {
        console.log("Shuffle first");
        showMessage("Shuffle first");
    }
    else if (cupHasBall) {
        console.log("Win!");
        showMessage("Win!");
    }
    else {
        console.log("LOOSE!!!");
        showMessage("LOOSE!!!")
    }
    await sleep(1000)
    reset();
}

function reset() {
    for(let cup of window.cups) {
        cup.classList.remove("ball");
    }
    window.ballPlaced = false;
    showMessage("");
    let shuffleButton = document.getElementById("shuffle-button");
    shuffleButton.disabled = false;
}
async function shuffle() {
    window.readyToPick = false;
    let shuffleButton = document.getElementById("shuffle-button");
    shuffleButton.disabled = true;
    const NUM_SWAPS = document.getElementById("swap-count").value;
    window.cupContainer = document.getElementById("cupContainer");
    console.log("Shuffling")
    window.cups = Array.from(cupContainer.children);
    let cups = window.cups
    let cup1 = document.getElementById("cup1");
    cup1.addEventListener("click", pickCup)
    let cup2 = document.getElementById("cup2");
    cup2.addEventListener("click", pickCup)
    let cup3 = document.getElementById("cup3");
    cup3.addEventListener("click", pickCup)
    let randomCupNumForBall = Math.floor(Math.random() * cups.length);
    let randomCupForBall = cups[randomCupNumForBall];
    await addBallToCup(randomCupForBall, randomCupNumForBall);
    console.log(cups);
    for(i=0; i < NUM_SWAPS; i++) {
        let randomCupNum1 = Math.floor(Math.random() * cups.length);
        let randomCup1 = cups[randomCupNum1];
        let randomCupNum2 = Math.floor(Math.random() * cups.length);
        while(randomCupNum1 === randomCupNum2) {
            randomCupNum2 = Math.floor(Math.random() * cups.length);
        }
        let randomCup2 = cups[randomCupNum2];
        console.log(randomCupNum1);
        console.log(randomCupNum2);
        animateSwapCups(randomCup1, randomCup2);
        await sleep(500);
    }
    window.readyToPick = true;
    showMessage("Pick a cup");
    
}

function shuffleArray(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        let temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function addBallToCup(cup, cupNum) {
    cup.classList.add("ball");
    cup.classList.add("ball-visible");
    await sleep(1000);
    cup.classList.remove("ball-visible");
    window.ballPlaced = true;
}
function showMessage(message) {
    let messages = document.getElementById("messages");
    messages.textContent = message;
}
function animateSwapCups(cup1, cup2) {
    let cup1Start = cup1.getBoundingClientRect();
    let cup2Start = cup2.getBoundingClientRect();
    swapElements(cup1, cup2);
    let cup1End = cup1.getBoundingClientRect();
    let cup2End = cup2.getBoundingClientRect();
    let cup1Delta = cup1Start.left - cup1End.left;
    let cup2Delta = cup2Start.left - cup2End.left;

    cup1.animate([{
        transforOrigin: 'top left',
        transform: `
            translate(${cup1Delta}px)
        `
    }, {
        transformOrigin: 'top left',
        transform: 'none'
    }], {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'both'
    });
    cup2.animate([{
        transforOrigin: 'top left',
        transform: `
            translate(${cup2Delta}px)
        `
    }, {
        transformOrigin: 'top left',
        transform: 'none'
    }], {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'both'
    });
}

function swapElements(node1, node2) {
    const parent1 = node1.parentNode;
    const parent2 = node2.parentNode;

    if (!parent1 || !parent2 || parent1 !== parent2) {
        console.error("ERROR");
        return
    }
    const nextSibling1 = node1.nextSibling;
    const nextSibling2 = node2.nextSibling;
    parent1.insertBefore(node1, nextSibling2);
    parent1.insertBefore(node2, nextSibling1);
}