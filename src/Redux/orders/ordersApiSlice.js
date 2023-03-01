import { apiSlice } from "../apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    listOrders: builder.query({
      // providesTags: (result) => {
      //   console.log(result);
      //   return result
      //   ? [
      //       ...result.data.map((order) => ({ type: "Orders", id: order.id })),
      //       { type: "Orders", id: "LIST" }
      //     ]
      //   : [{ type: "Orders", id: "LIST" }];
      // },
      providesTags: (result) => ["Orders"],
      query: () => `/api/orders`,
      method: "GET",
    }),
    getOrder: builder.query({
      // providesTags: (result) =>
      //   result
      //     ? [
      //         ...{ type: "Orders", id: result.data.id },
      //         [{ type: "Orders", id: "LIST" }],
      //       ]
      //     : [{ type: "Orders", id: "LIST" }],
      providesTags: (result) => ["Orders"],
      query: ({ id }) => ({
        url: `/api/orders/${id}`,
        method: "GET",
      }),
    }),
    updateOrder: builder.mutation({
      // invalidatesTags: (result) =>
      //   result
      //     ? [
      //         ...{ type: "Orders", id: result.data.id },
      //         { type: "Orders", id: "LIST" },
      //       ]
      //     : [{ type: "Orders", id: "LIST" }],
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
