import { apiSlice } from "../apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
    overrideExisting: false,
    endpoints: builder => ({        
        listOrders: builder.query({
            query: () => `/api/orders`,
            method: 'GET'
        })
    })
});



export const { useListOrdersQuery } = ordersApiSlice;