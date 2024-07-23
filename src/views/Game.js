const template = `
  <section aria-label="Section Index Page's Navigations" class="w-50 mx-auto top-50 d-flex justify-content-center align-items-center py-2 px-3 vh-100" id="section-game">
       <article id="game-cards" :style="gameStyle">
            <game-card @click="toggleTimer" v-for="c of game.cards" :key="c.position" :card="c"></game-card>
        </article>
        <article id="game-info">
            <div class="mb-3">
                <div class="mb-2">
                    Mode: <strong class="text-capitalize">{{game.mode}}</strong>
                </div>
                <div class="mb-2">
                    Move: <strong>{{game.moveCount}}</strong>
                </div>
                <div class="mb-2">
                    Time: <strong>{{game.formattedTime}}</strong>
                </div>
                <div class="mb-2">
                    Match: <strong>{{game.matchCards.length}} / {{game.mode === 'easy' ? '6' : '12'}}</strong>
                </div>            
            </div>
            <div class="d-flex flex-column gap-2">
                <button class="btn btn-danger flex-grow-1" @click ="pause" data-bs-target="#modal-pause" data-bs-toggle="modal">Pause</button>
                <button  @click ="restart" class="btn btn-danger flex-grow-1">Restart</button>
                <button   @click ="exit" class="btn btn-danger flex-grow-1">Exit</button>
            </div>

        </article>
  </section>
  
<!--  pause modal-->
<div class="modal fade" id="modal-pause">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
                <div class="modal-body text-center">
                       <h1>Pause</h1>
                       <button class="btn btn-danger" @click="continueGame" data-bs-dismiss="modal">Continue</button>
                </div>
        </div>
    </div>
</div>
`;

const {computed} = Vue;
import game from '../stores/game.js';
import GameCard  from '../components/GameCard.js';
import router from '../router.js';
export default{
    template,
    components: {
        GameCard,
    },
    setup(){
        //states
        let gameStarted = false;
        let interval= null;
        //computed properties
        const gameStyle = computed(()=>{
            return game.value.mode === 'easy' ? 'grid-template-columns : repeat(4,1fr);' : 'grid-template-columns : repeat(5,1fr);';
        });
        console.log( game.value.mode == undefined)
        if(game.value.cards?.length == 0){
            game.value.initialCards();
        }

        //functions
        function restart(){
            game.value.resetGame();
        }
        function pause(){
            clearInterval(interval);
        }

        function exit(){
            clearInterval(interval);
            game.value.mode = undefined;
            game.value.resetGame();
            router.push({name: 'Index'});
        }

        function toggleTimer(){
            if(gameStarted){
                return;
            }
            gameStarted = !gameStarted;
            interval = setInterval(()=>{
                game.value.time++;
            } , 1000);
        }
        function continueGame(){
            interval = setInterval(()=>{
                game.value.time++;
            } , 1000);
        }
        return{
            game,
            gameStyle,
            restart,
            pause,
            exit,
            toggleTimer,
            continueGame,
        }
    }
};