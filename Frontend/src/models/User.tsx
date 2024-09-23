export default interface User{
    access_token: string;
    refresh_token: string;
    id: string;
    name: string;
    role: string;
    password: string;
    devices: string[];
}