<template>
<div class="chooseRoom">
    <h1 class="text-black text-2xl m-2">Welcome to the chat</h1>
        <label name="username">
            Enter your username
            <input
                v-model="username"
                name="username"
                placeholder="Enter your username"
                class="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
        </label>
        <label htmlFor="room">
            Enter room number of your choice
            <input
                v-model="room"
                name="room"
                placeholder="Enter your room number"
                class="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
        </label>
        <button @click="joinRoom" class="bg-blue-500 hover:bg-blue-400 p-4 m-2 rounded-lg text-white">
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
<style scoped>
    .chooseRoom{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 20vh;
    }
</style>