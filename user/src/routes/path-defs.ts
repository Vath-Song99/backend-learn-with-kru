
export const PATH_USER = {
    BASE: "/v1",
    CREATE_USER: "/users",
    GET_USER_BY_AUTH_ID: "/users/by-auth-id/:authId",  // Fetch user by their authentication ID
    GET_USER_BY_USER_ID: "/users/by-user-id/:userId",  // Fetch user by their user ID

}

export const PATH_SERVICE = {
    BASE: "/v1",
    AUTH: {
        BASE: "/auth",
        GET: "/users"
    },
    STUDENT: {
        BASE: "/student",
    },
    TEACHER: "/teacher"
}