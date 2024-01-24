const state ={
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions:{
        button: document.getElementById("next-duel"),
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
};

const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
]; 

async function getRandomCardId(){
    const radomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[radomIndex].id;
}

async function createCardImage(randomIdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(randomIdCard);
        });
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}
async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await ShowHiddenCardFieldsImages(true);

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function ShowHiddenCardFieldsImages(value){
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }else if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Ganhou";
        await playAudio("win");
        state.score.playerScore++;
    }else if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Perdeu";
        await playAudio("lose");
        state.score.computerScore++;
    }else{
        await playAudio("lose");
    }
        
    return duelResults;
}

async function removeAllCardsImages(){
    let {computerBox, player1Box}  = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = 0.3;
    try {
        audio.play();
    } catch {
    
    }
}

function init(){
    ShowHiddenCardFieldsImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();