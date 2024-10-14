

export const methods = {
    setUser: "setUser",
    setUsers: "setUsers",
    setPieces: "setPieces"
}


const userReducer = (userState, method) => {

    switch (method.type) {
        case methods.setUser:
            return {
                    ...userState,
                    user: method.user
            }

            default:
                return userState
    }
}

export default userReducer