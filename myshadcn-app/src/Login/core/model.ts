export interface LoginModel {
    data: {
        id: number,
        first_name: string,
        last_name: string,
        email: string,
        phone: string,
        roles: string,
        created_at: string,
        updated_at: string,
        city_id: number | null,
        store_id: number,
        store_name: string | null,
        store_type: string | null,
        uuid: string,
    },
    accessToken: string
}