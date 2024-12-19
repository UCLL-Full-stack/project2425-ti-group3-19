import { User } from "@/types";

const api = process.env.NEXT_PUBLIC_API_URL;


//Ik gebruik geen type van user omdat hij anders een error gooit in de log.
const registerNewUser = async (firstName: string, lastName: string, email: string, password: string, role: string) => {
    return await fetch(api + '/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
    });
}


const loginUser = async (email: string, password: string) => {
    return await fetch(api + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
}
export default { registerNewUser, loginUser };