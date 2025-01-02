import { useCallback } from 'react';

export const useApi = () => {
    const apiCall = useCallback(
        async ({ url, type = 'GET', body }: { url: string; type?: string; body?: any }) => {
            try {
                const response = await fetch(url, {
                    method: type,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: body ? JSON.stringify(body) : undefined,
                });

                if (!response.ok) {
                    console.error(`HTTP error! status: ${response.status}`);
                    return {
                        success: false,
                        status: response.status,
                        message: `HTTP error! status: ${response.status}`,
                        data: null,
                    };
                }

                const data = await response.json();
                return {
                    success: true,
                    status: response.status,
                    message: 'Request successful',
                    response: data,
                };
            } catch (error: any) {
                console.error('API call failed:', error);
                return {
                    success: false,
                    status: null,
                    message: error.message || 'An unknown error occurred',
                    data: null,
                };
            }
        },
        []
    );

    return { apiCall };
};
