import { apiSlice } from "../apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
    overrideExisting: false,
    endpoints: builder => ({        
        listOrders: builder.query({
            providesTags: 'Orders',
            query: () => `/api/orders`,
            method: 'GET'
        }),
        updateOrder: builder.query({
            query: (id) => `/api/orders/${id}`,
            method: 'POST',
        })
    })
});


export const { useListOrdersQuery } = ordersApiSlice;