export const state = () => ({
    user: null,
})

export const mutations = {
    addUser(state, user){
        state.user = user;
    }
}

