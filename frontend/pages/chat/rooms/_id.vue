<template>
    <div class="flex flex-col w-full items-center mt-4">
        <div id="messages" style="height: 70vh; width: 500px; background-color: azure;" class=" rounded-t-lg">
            <div class="messages" v-for="(msg, index) in messages" :key="index">
                <p><span class="font-weight-bold">{{ msg.user }}: </span>{{ msg.text }}</p>
            </div>
        </div>
        <div class="flex flex-row w-full justify-between items-center" style="width: 500px;">
            <input v-model="messageToSend" type="text" class="rounded-bl-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent">
            <button @click.prevent="sendMessage" class="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-br-lg">Envoyer</button>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import io from 'socket.io-client';
export default {
    name: "chat-room",
    data(){
        return {
            messageToSend: null,
            socket : io('localhost:1337'),
            messages : [],
        }
    },
    mounted(){
        const username = this.user.username;
        const room = this.user.room;
        this.socket.emit('join', { username, room }, (error) => {
            if(error) {
                console.log(error);
            }
        }); 
        this.socket.on('welcome', (data) => {
            this.addUserInRoom(data);
        });
        this.socket.on('message', (message) => {
            this.messages = [...this.messages, message];
        });
    },
    computed:{
        ...mapState(['user'])
    },

    methods:{
        sendMessage(){
            if (this.messageToSend) {
                this.socket.emit('sendMessage', {
                    user: this.user,
                    message: this.messageToSend
                });
                this.messageToSend = '';
            }
        },
        addUserInRoom(data){
            this.$store.commit("addUser", data);
        },
        ...mapMutations['addUser'],
    }
}
</script>