const template = `
  <section aria-label="Section Index Page's Navigations" class="w-50 mx-auto top-50 d-flex justify-content-center align-items-center py-2 px-3 gap-2 vh-100" id="sectionm-game">
       <article id="game-cards" :style="gameStyle">
            <game-card v-for="c of game.cards" :key="c.position" :card="c"></game-card>
        </article>
        <article id="game-info">
                Game INfo
        </article>
  </section>
`;

const {computed} = Vue;
import game from '../stores/game.js';
import GameCard  from '../components/GameCard.js';
export default{
    template,
    components: {
        GameCard,
    },
    setup(){
        //states

        //computed properties
        const gameStyle = computed(()=>{
            return game.value.mode === 'easy' ? 'grid-template-columns : repeat(4,1fr);' : 'grid-template-columns : repeat(5,1fr);';
        });


        if(game.value.cards.length === 0 ){
            game.value.initialCards();
        }

        return{
            game,
            gameStyle,
        }
    }
};