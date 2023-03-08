import { apiSlice } from "../apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    listOrders: builder.query({
      providesTags: (result) => ["Orders"],
      query: () => `/api/orders`,
      method: "GET",
      transformResponse: (response) => {
        response.data.sort((a, b) => { return b.id - a.id });
        return response;
      },
    }),
    getOrder: builder.query({
      providesTags: (result) => ["Orders"],
      query: ({ id }) => ({
        url: `/api/orders/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => { 
        console.log(response.data?.attributes?.status_id)
        return response.data;
       }
    }),
    updateOrder: builder.mutation({
      invalidatesTags: (result) => ["Orders"],
      query: ({ id, ...details }) => ({
        url: `/api/orders/${id}`,
        method: "PATCH",
        body: details,
      }),
    }),
  }),
});

export const { useListOrdersQuery, useGetOrderQuery, useUpdateOrderMutation } =
  ordersApiSlice;
