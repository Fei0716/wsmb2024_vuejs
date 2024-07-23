const template = `
  <section aria-label="Section Index Page's Navigations" class="h-100 w-100">
      <article class="card w-25 d-flex justify-content-center align-items-center" id="index-wrapper">
      <div class="card-body">
            <h1 class="text-center mb-3">Flip & Match</h1>
            <nav class="d-flex justify-content-center mb-3 flex-column gap-2">
               <button @click="redirectTo('Game', 'easy')"  class="btn btn-danger w-100">Easy Mode</button>
               <button  @click="redirectTo('Game', 'hard')"  class="btn btn-danger w-100">Hard Mode</button>
               <button   @click="redirectTo('Leaderboard')" class="btn btn-danger w-100">Leaderboard Mode</button>
            </nav>        
        </div>
    </article>
  </section>
`;

import router from '../router.js';
import game from '../stores/game.js';

export default{
    template,
    setup(){

        function redirectTo(name, mode = ''){
            if(mode !== ''){
                //redirect to game page
                game.value.mode = mode;
            }
            router.push({name: name});
        }

        return{
            redirectTo,
        }
    }
};