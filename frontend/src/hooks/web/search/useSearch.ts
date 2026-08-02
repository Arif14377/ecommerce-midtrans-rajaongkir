import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Api from '../../../services/api.ts';
import type { PublicProduct, MetaPaginatedResponse } from '../../../types';

export const useSearch = (debounceMs: number = 300) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, debounceMs])

    const searchResult = useQuery<MetaPaginatedResponse<PublicProduct[]>>({
        queryKey: ['search-product', debouncedQuery],
        queryFn: async () => {
            const response = await Api.get(`/api/public/products?search=${encodeURIComponent(debouncedQuery)}&per_page=8`);
            return response.data;
        },
        enabled: debouncedQuery.length >= 2,
    });

    return {
        query,
        setQuery,
        results: searchResult.data?.data || [],
        isLoading: searchResult.isLoading && debouncedQuery.length >= 2,
        isSearching: query !== debouncedQuery,
    };
}