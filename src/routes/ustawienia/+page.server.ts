import type {Actions} from "./$types";

export async function load({cookies}) {
    const data = {
        serwer: cookies.get('serwer'),
        token: cookies.get('token'),
        mies_rozl: cookies.get('mies_rozl'),
        data_raport: cookies.get('data_raport'),
        email: cookies.get('email')
    }
    return {
        props: data
    }
}

export const actions = {
    ustawienia: async ({cookies, request}) => {
        const data = await request.formData();

        const serwer : string = <string>data.get('serwer');
        const token : string = <string>data.get('token');
        const mies_rozl : string = <string>data.get('mies_rozl');
        const data_raport : string = <string>data.get('data_raport');
        const email : string = <string>data.get('email');

        const cookieMaxAge = 60 * 60 * 24 * 30 * 12 * 10;

        cookies.set('serwer', serwer, {path: "/", maxAge: cookieMaxAge});
        cookies.set('token', token, {path: "/", maxAge: cookieMaxAge});
        cookies.set('mies_rozl', mies_rozl, {path: "/", maxAge: cookieMaxAge});
        cookies.set('data_raport', data_raport, {path: "/", maxAge: cookieMaxAge});
        cookies.set('email', email, {path: "/", maxAge: cookieMaxAge});
        return {
            redirect: '/ustawienia'
        }
    }
} satisfies Actions;