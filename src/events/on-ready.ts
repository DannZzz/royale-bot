import Event from "../typing/Event";

export default new Event({
    name: "ready",
    callback: async (client) => {        
        client.user.setStatus("dnd");
        console.log(`${client.user.tag} - is ready!`);
    }
})