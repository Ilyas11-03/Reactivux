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
        const token = response.data?.data?.accessToken;
        if (token) {
            //Stocke le token dans le localStorage
            localStorage.setItem("access_token", token)
            console.log("Token stocké avec succès :", token);

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

//Fonction pour déconnexion
export const logout = (): void => {
    localStorage.removeItem("access_token");
}


