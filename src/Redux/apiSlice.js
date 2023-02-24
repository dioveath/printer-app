import config from '../config/config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import qs from 'qs';

const baseQuery = fetchBaseQuery({
  baseUrl: `${config.serverUrl}`,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if(token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
  paramsSerializer: (params) => {
    const paramString = qs.stringify(params);
    return paramString;
  },  
});

export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ['Arenas'],
  endpoints: _builder => ({})
});
