const {ref,reactive,watchEffect,computed} = Vue;
//states
const game = ref(localStorage.getItem('game') !== null ? JSON.parse(localStorage.getItem('game')) : {
    flipCount: 0,
    time: 0,
    lastFlippedCards: [],
});

watchEffect(()=>{
    localStorage.setItem('game', JSON.stringify(game.value));
});


//actions
game.value.initialCards = function(){
    console.log(game.value.mode)
    if(game.value.mode != undefined){
        let cardsCount = game.value.mode === 'easy'? 12 : 20;
        let cards = [];
        let randomId = 0;
        for(let i= 0; i < cardsCount; i++){
            randomId = Math.floor(Math.random() * cardsCount / 2);//generate number from 0 to 5

            if(cards.filter((c) => c.id === randomId).length === 2){
                i--;
                continue;
            }
            cards.push({
                id: randomId,
                isFlipped: false,
                position: i,
            });
        }
        game.value.cards = cards;
    }


}

if(game.value.mode != undefined && game.value.cards == undefined){
    game.value.initialCards();
}

game.value.resetGame = function(){
    game.value.flipCount =  0;
    game.value.time =  0;
    game.value.lastFlippedCards =  [];
    game.value.cards = [];
}
//getters
game.value.moveCount = computed(()=>{
    return Math.floor(game.value.flipCount / 2);
});
game.value.matchCards = computed(()=>{
    let matches = [];
    let temp = [];
    temp = game.value.cards?.filter((c) => c.isFlipped);
    temp?.sort((a,b) => a.id - b.id);

    for(let i = 0; i < temp?.length ; i++){
        if(i+1 < temp.length ){
            if(temp[i].id === temp[i + 1].id)
            matches.push(temp[i]);
        }
    }
    return matches;
});

game.value.formattedTime = computed(()=>{
    let seconds = parseInt(game.value.time % 60);
    let minutes = parseInt(game.value.time / 60);

    return `${minutes.toString().padStart(2 ,'0')}:${seconds.toString().padStart(2 ,'0')}`;
});
export default game;