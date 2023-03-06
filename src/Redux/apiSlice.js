import config from '../config/config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import qs from 'qs';

const rawBaseQuery = fetchBaseQuery({
  // baseUrl: `${config.serverUrl}`,
  baseUrl: '',
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

const dynamicBaseQuery = async (args, api, extraOptions) => {
  const apiUrl = api.getState().setup.domain;
  if(!apiUrl) return {  error: { status: 404, statusText: "Bad Request", message: 'No domain received!' } };

  const urlEnd = typeof args === 'string' ? args : args?.url;
  const adjustedUrl = apiUrl + urlEnd;
  const adjustedArgs = { ...args, url: adjustedUrl };

  return rawBaseQuery(adjustedArgs, api, extraOptions);
};

export const apiSlice = createApi({
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Orders', 'Customers'],
  endpoints: _builder => ({})
});