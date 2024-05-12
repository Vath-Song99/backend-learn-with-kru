export interface User{
    firstname: string;
    lastname: string;
    email?: string;
    password?: string
}

export interface Login{
    email: string;
    password: string
}