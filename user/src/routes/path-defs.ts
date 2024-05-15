
export const PATH_USER = {
    BASE: "/v1",
    CREATE_USER: "/users",
    GET_USER_BY_AUTH_ID: "/users/:authId",
    GET_USER_BY_USER_ID: "/users/:userId"
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