const template = `
<div @click="flipCard" class="game-card-wrapper" :class="{'flip-animation': card.isFlipped}">
   <img class="game-card shadow-sm" :class="{'matched': isMatched}" :src="'/public/image/'+ card.id +'.png' " alt="Game Card Icon" >
</div>

`;

const {ref, watcher, watchEffect,computed} = Vue;
import game from '../stores/game.js';

export default{
    template,
    props: ['card'],
    setup(props){
       let card = ref(props.card);

       watchEffect(()=>{
           card.value  = game.value.cards[props.card.position];
       });
        //computed properties
        const isMatched = computed(()=>{
            return game.value.matchCards.find(c => c.id === card.value.id);
        })

        function flipCard(){
            if(card.value.isFlipped){
                return;
            }
            card.value.isFlipped = true;
            game.value.flipCount++;
            game.value.lastFlippedCards.push(card.value);

            if(game.value.lastFlippedCards.length > 1){
                //else flip two of the cards back to initial position
                setTimeout(()=>{
                    //check whether both the cards has the same id
                    let card1 = game.value.cards[game.value.lastFlippedCards[0].position];
                    //if there are not the same
                    if(card1.id !== card.value.id){
                        card1.isFlipped = false;
                        card.value.isFlipped = false;
                    }
                    game.value.lastFlippedCards = [];

                },200);

            }


        }

        return{
            card,
            isMatched,
            flipCard,
        }
    }
}