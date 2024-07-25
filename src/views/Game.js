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
                <button class="btn btn-danger flex-grow-1" @click ="pause" data-bs-target="#modal-pause" data-bs-toggle="modal" id="btn-pause">Pause</button>
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
                       <h1 class="mb-3">Pause</h1>
                       <button class="btn btn-danger" @click="continueGame" data-bs-dismiss="modal">Continue</button>
                </div>
        </div>
    </div>
</div>


  
<!--  end modal-->
<div class="modal fade" id="modal-end">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
                <div class="modal-body text-center">
                       <h1 class="mb-3">Complete</h1>
                       <div class="mb-2">
                            <span>Mode: </span> <strong class="text-capitalize">{{game.mode}}</strong>
                        </div>
                       <div class="mb-2">
                            <span>Move: </span> <strong>{{game.moveCount}} | Rank #{{playerMoveRank}}</strong>
                        </div>
                        <div class="mb-2">
                                <span>Time: </span> <strong>{{game.formattedTime}} | Rank #{{playerTimeRank}}</strong>
                        </div>
                        <div class="mb-3">
       
                        </div>
                        <form action="#" @submit.prevent="storeRank" class="mb-3" id="form-store-rank">
                            <input type="text" name="name" id="name" placeholder="Enter Name" class="form-control" v-model="name" required>
                        </form>
                       <button type="submit" form="form-store-rank" class="btn btn-danger d-block w-auto mx-auto" data-bs-dismiss="modal">Submit</button>
                       
                       <button id="btn-end" data-bs-target="#modal-end" data-bs-toggle="modal" hidden></button>
                </div>
        </div>
    </div>
</div>
`;

const {computed ,onMounted ,watchEffect ,ref} = Vue;
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
        let pauseFlag = false;
        const name = ref('');
        //computed properties
        const gameStyle = computed(()=>{
            return game.value.mode === 'easy' ? 'grid-template-columns : repeat(4,1fr);' : 'grid-template-columns : repeat(5,1fr);';
        });

        if(game.value.cards?.length == 0){
            game.value.initialCards();
        }else{
            pauseFlag = true;
        }

        //functions
        function restart(){
            game.value.resetGame();
            game.value.initialCards();
            clearInterval(interval);
            gameStarted = false;
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


        //computed
        const playerMoveRank = computed(()=>{
            let playerIndex = game.value?.rankings.filter((g)=> g.mode === game.value.mode).sort((a , b) => a.moveCount - b.moveCount).findIndex((g) => game.value.moveCount <= g.moveCount);
            return playerIndex === -1 || playerIndex === 0 ? 1 : ++playerIndex ;
        });
        const playerTimeRank = computed(()=>{
            let playerIndex = game.value?.rankings.filter((g)=> g.mode === game.value.mode).sort((a , b) => a.time - b.time).findIndex((g) => game.value.time <= g.time);

            return playerIndex === -1 || playerIndex === 0 ? 1 : ++playerIndex ;
        });

        function storeRank(){
            game.value.rankings.push({
                moveCount: game.value.moveCount,
                time: game.value.time,
                name: name.value,
                mode: game.value.mode,
            });

            let mode = game.value.mode;
            game.value.mode = undefined;
            game.value.resetGame();
            router.push({name: 'Leaderboard' , params:{mode: mode}});
        }
        //lifecycle hooks
        onMounted(()=>{
            //toggle pause state for unfinished game
            if(pauseFlag){
                $('#btn-pause').click();
                pauseFlag = false;
            }
            //watcher
            watchEffect(()=>{
                let maxMatches = game.value.mode === 'easy' ? 6 : 10;
                if(game.value.matchCards.length >= maxMatches){
                    clearInterval(interval);
                    $('#btn-end').click();
                }
            });
        });


        return{
            game,
            gameStyle,
            restart,
            pause,
            exit,
            toggleTimer,
            continueGame,

            playerMoveRank,
            playerTimeRank,
            storeRank,
            name,
        }
    }
};