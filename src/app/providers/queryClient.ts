import { QueryClient } from "@tanstack/react-query";
import config from '../../../public/config.json'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      retry: 1,
      staleTime: config.CACHE_FRESHNESS_TIME,
      gcTime: config.CACHE_LIFETIME,
    },
  },
})