import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://ti-ext-appcompanion-server.vercel.app",
});    

export const domainApiSlice = createApi({
    baseQuery: baseQuery,
    reducerPath: 'domainApi',
    tagTypes: ['Domains'],
    endpoints: _builder => ({        
        getDomain: _builder.query({
            query: () => `/api/v1/app`,
            body: (domain) => ({ domain }),
            providesTags: ['Domains']
        }),
    })
});

export const { useGetDomainQuery } = domainApiSlice;
