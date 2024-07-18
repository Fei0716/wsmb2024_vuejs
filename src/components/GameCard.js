const template = `
   <img  class="game-card shadow-sm" :src="'/public/image/'+ card.id +'.png' " alt="Game Card Icon" >
`;

const {ref, watcher} = Vue;
export default{
    template,
    props: ['card'],
    setup(props){
        const card = ref(props.card);

        return{
            card,
        }
    }
}