const template = `
  <section aria-label="Section Index Page's Navigations" class="vh-100 w-100 d-flex justify-content-center align-items-center">
   <div class="w-75 my-auto card py-2 px-3">
        <h1 class="text-center mb-3 text-decoration-underline">Leaderboard</h1>
        <nav class="d-flex justify-content-center gap-2 mb-2" id="leaderboard-nav">
               <li><a href="#" @click.prevent="modeOption = 'easy'" class="nav-link" :class="{'selected': modeOption == 'easy'}">Easy Mode</a></li>
               |
               <li><a href="#" @click.prevent="modeOption = 'hard'" class="nav-link" :class="{'selected': modeOption == 'hard'}">Hard Mode</a></li>
        </nav>
        <div class="mb-2 d-flex gap-2 align-items-center">
              <table class="table table-responsive table-danger table-bordered table-striped">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Move</th>
                    </tr>
                    <tr v-for="(rank,i) in moveRanks">
                        <td>
                             {{++i}}
                        </td>
                        <td>
                             {{rank.name}}
                        </td>
                        <td>
                             {{rank.moveCount}}
                        </td>
                    </tr>
                </table>
                
              <table class="table table-responsive table-danger table-bordered table-striped">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Time</th>
                    </tr>
                    <tr v-for="(rank,i) in timeRanks">
                        <td>
                             {{++i}}
                        </td>
                        <td>
                             {{rank.name}}
                        </td>
                        <td>
                             {{formatTime(rank.time)}}
                        </td>
                    </tr>
                </table>
        </div>       
        
        <router-link class="text-decoration-none" :to="{name: 'Index'}">
            <button class="btn btn-danger mx-auto d-block">Exit</button>
        </router-link>
    </div>

  </section>
`;

const {ref, computed} = Vue;
const {useRoute} = VueRouter;
import game from '../stores/game.js';

export default{
    template,
    setup(){
        //states
        const route = useRoute();
        const modeOption = ref(route.params.mode);

        //computed properties
        const moveRanks = computed(()=>{
            return game.value.rankings.filter((g)=> g.mode === modeOption.value).sort((a ,b) => a.moveCount - b.moveCount);
        })


        const timeRanks = computed(()=>{
            return game.value.rankings.filter((g)=> g.mode === modeOption.value).sort((a ,b) => a.time - b.time);
        });

        //functions
        function formatTime(t){
            let seconds = parseInt(t % 60);
            let minutes = parseInt(t / 60);

            return `${minutes.toString().padStart(2 ,'0')}:${seconds.toString().padStart(2 ,'0')}`;
        }

        return{
            modeOption,
            moveRanks,
            timeRanks,
            formatTime,
        }
    }
};