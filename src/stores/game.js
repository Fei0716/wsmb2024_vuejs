const {ref,reactive,watchEffect} = Vue;
//states
const game = ref(localStorage.getItem('game') !== null ? JSON.parse(localStorage.getItem('game')) : {});

watchEffect(()=>{
    localStorage.setItem('game', JSON.stringify(game.value));
});


//actions
game.value.initialCards = function(){
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

if(game.value.mode !== undefined && game.value.cards === undefined){
    game.value.initialCards();
}
//getters


export default game;