const COUNTER_TYPES = {
    BLUE: "blue",
    RED: "red"
}

let plucks = [];

function clearBoard(board){
    let elements = board.getElementsByClassName("piece");
    while (elements.length > 0){
        elements[0].remove();
    }
}

function updateTallies(board){
    let noRed = board.getElementsByClassName("red_piece").length;
    let noBlue = board.getElementsByClassName("blue_piece").length;

    document.getElementById("red_count").textContent = noRed.toString();
    document.getElementById("blue_count").textContent = noBlue.toString();

    plot = document.getElementById("plot");
    Plotly.react( plot, [{
        x: Array(plucks.length).fill().map((_,idx) => 1 + idx),
        y: plucks
    }], {
        margin: {t: 0},
        yaxis: {range: [0,Math.max(plucks)]},
        xaxis: {dtick: true}
    });
}

function getRandomIntInclusive(min, max) {
    const randomBuffer = new Uint32Array(1);

    window.crypto.getRandomValues(randomBuffer);

    let randomNumber = randomBuffer[0] / (0xffffffff + 1);

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(randomNumber * (max - min + 1)) + min;
}

function generateRandomCounterState(numberOfCounters){
    let counters = [];
    for (let i = 0; i < numberOfCounters; i++){
        counters.push((getRandomIntInclusive(0,1) < 0.5 ? COUNTER_TYPES.BLUE : COUNTER_TYPES.RED));
    }
    return counters;
}

function pushCountersToBoard(counters, board){
    if (board.childElementCount !== 0){
        clearBoard(board);
    }

    for (let i = 0; i < counters.length; i++){
        let node = document.createElement("DIV");
        node.setAttribute("class", "piece " + (counters[i] === COUNTER_TYPES.RED ? "red_piece" : "blue_piece"));
        board.appendChild(node);
    }

    updateTallies(board);
}

function resetBoard(){
    let counters = generateRandomCounterState(100);
    plucks = [];
    pushCountersToBoard(counters, document.getElementById("board"));
}

window.addEventListener('load', function(){
    resetBoard()
})

function pluckCounters(){
    let board = document.getElementById("board");
    let elements = board.getElementsByClassName("red_piece");

    while (elements.length > 0){
        elements[0].remove();
    }
    plucks.push(board.getElementsByClassName("blue_piece").length);
    updateTallies(board);

    document.getElementById("actionButton").setAttribute("onclick", "shakeBag()");
    document.getElementById("actionButton").innerText = "Shake Bag";
}

function shakeBag(){
    let board = document.getElementById("board");

    pushCountersToBoard(generateRandomCounterState(board.childElementCount), board)

    document.getElementById("actionButton").setAttribute("onclick", "pluckCounters()");
    document.getElementById("actionButton").innerText = "Pluck Counters";
}