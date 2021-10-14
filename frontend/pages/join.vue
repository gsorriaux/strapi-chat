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
import { mapMutations } from 'vuex'
export default {
    name: "chat-join",
    data() {
        return {
            username: '',
            room: '',
        }
    },
    methods: {
        joinRoom(){
            let username = this.username;
            let room = this.room;
            if(username && room) {
                this.addLoginUser({
                    username,
                    room
                });
                this.$router.push(`/chat/rooms/${room}`)
            }
        },
        addLoginUser(data){
            this.$store.commit("addUser", data);
        },
        ...mapMutations['addUser'],
        
    },
}
</script>