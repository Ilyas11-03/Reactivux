import axios from "axios"; 
import type { LoginModel } from "./model";


// URL de base de ton API
const api_url = "https://api.preprodback.livcollect.com/api";

// Api pour la connexion
const api_signin = `${api_url}/signin`;


//Fonction de requete de connexion
export const loginSuperAdmin = async (email: string, password: string): Promise<LoginModel | null> => {
    
    try {
        const response = await axios.post<LoginModel>(api_signin, {
            email,
            password
        });

        //Vérifie si la réponse contient le token
        const token = response.data?.accessToken;
        const uuid = response.data?.data?.uuid;
        const firstName = response.data?.data?.first_name;
        const lastName = response.data?.data?.last_name;
        if (token) {
            //Stocke le token dans le localStorage
            localStorage.setItem("access_token", token)
            // console.log("Token stocké avec succès :", token);
        }
        if (uuid) {
            localStorage.setItem("uuid", uuid)
        }
        if (firstName || lastName) {
            const fullName = [firstName, lastName].filter(Boolean).join(" ");
            if (fullName) localStorage.setItem("user_name", fullName);
        }

        return response.data; 
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        return null;
    }
};

//Fonction pour récupérer le token 
export const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token");
}

export const getUuid = (): string | null => {
    return localStorage.getItem("uuid");
}

//Fonction pour déconnexion
export const logout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("uuid");
}


