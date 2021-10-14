<template>
    <div>
        <h1>Welcome in Chat Room {{user.username}}</h1>
        <div id="messages" style="height: 80vh; width: 500px; background-color: azure;">
            <div class="messages" v-for="(msg, index) in messages" :key="index">
                <p><span class="font-weight-bold">{{ msg.user }}: </span>{{ msg.text }}</p>
            </div>
        </div>
        <div>
            <input v-model="messageToSend" type="text">
            <button @click.prevent="sendMessage">Envoyer</button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
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
        this.socket.on('message', (data) => {
            console.log(data);
            this.messages = [...this.messages, data];
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
        }
    }
}
</script>