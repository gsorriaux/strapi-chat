export const state = () => ({
    messages: [],
    user: null,
})

export const mutations = {
    addMessage(state, conversation) {
      state.messages.push(conversation)
    },
    addUser(state, user){
        state.user = user;
    }
}

