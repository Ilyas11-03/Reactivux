import axios from "axios";
import type { OrdersResponse, Order } from "./model";
import { getAccessToken, getUuid } from "../../Login/core/request";

const api_url = "https://api.preprodback.livcollect.com/api";


// Real API: uses token from login and uuid from signin to fetch historic orders
export const getHistoricOrders = async (page: number = 1): Promise<OrdersResponse | null> => {
    try {
        const token = getAccessToken();
        const uuid = getUuid();
        if (!token || !uuid) {
            console.warn("Token ou UUID manquant. Assurez-vous d'être connecté.");
            return null;
        }

        const url = `${api_url}/historiques-orders/${uuid}?page=${page}`;
        const response = await axios.get<OrdersResponse>(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes historiques :", error);
        return null;
    }
}

export const getUnstructuredOrders = async (): Promise<Order[]> => {
    try {
        const token = getAccessToken();
        const uuid = getUuid();
        if (!token || !uuid) {
            console.warn("Token ou UUID manquant. Assurez-vous d'être connecté.");
            return [];
        }
        const url = `${api_url}/orders/unstructured/${uuid}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        const payload = response.data as any;
        if (Array.isArray(payload)) {
            return payload as Order[];
        }
        if (Array.isArray(payload?.data)) {
            return payload.data as Order[];
        }
        if (Array.isArray(payload?.data?.data)) {
            return payload.data.data as Order[];
        }
        return [];
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes non structurées :", error);
        return [];
    }
}

