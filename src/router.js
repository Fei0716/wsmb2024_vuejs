import Index from './views/Index.js';
import Game from './views/Game.js';
import Leaderboard from './views/Leaderboard.js';
import game from './stores/game.js';

const {createRouter, createWebHashHistory} = VueRouter;

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,

    },
    {
        path: '/game',
        name: 'Game',
        component: Game,

    },
    {
        path: '/leaderboard/:mode',
        name: 'Leaderboard',
        component: Leaderboard,

    },
];

const router = createRouter({
   history: createWebHashHistory(),
   routes,
});

router.beforeEach((to,from,next)=>{
    if(to.name !== 'Game' && game.value.mode != undefined){
        alert("Please finish the previous game first!!");
        next({name: 'Game'});
    }else{
        next();
    }
})

export default router;