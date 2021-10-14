<template>
<div>
    <h1>Chat Vue</h1>
        <label name="username">
            Enter your name
            <input
                v-model="username"
                name="username"
                placeholder="Enter your username"
            />
        </label>
        <label htmlFor="room">
            Enter room number of your choice
            <input
                v-model="room"
                name="room"
                placeholder="Enter your room number"
            />
        </label>
        <button @click="joinRoom">
            Rejoindre le chat
        </button>
</div>
</template>

<script>
import io from 'socket.io-client';
import { mapMutations } from 'vuex'
export default {
    name: "chat-join",
    data() {
        return {
            username: '',
            room: '',
            messages: [],
            socket : io('localhost:1337')
        }
    },
    mounted() {
        this.socket.on('welcome', (data) => {
            console.log(data);
            this.addUser(data);
            this.$router.push(`/chat/rooms/${data.userData.room}`)
        });
    },
    methods: {
        sendMessage(e) {
            e.preventDefault();
        },
        joinRoom(){
            console.log(this.username, this.room);
            let username = this.username;
            let room = this.room;
            if(username && room) {
                this.socket.emit('join', { username, room }, (error) => {
                    if(error) {
                        console.log(error);
                    } else {
                        this.socket.on('welcome', (data) => {
                            console.log(data);
                            this.$router.push(`/chat/rooms/${data.userData.romm}`)
                        });
                    }
                }); 
            }
        },
        addUser(data){
            this.$store.commit("addUser", data.userData);
            console.log(this.$store);
        },
        ...mapMutations['addUser'],
        
    },
}
</script>