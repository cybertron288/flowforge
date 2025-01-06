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

                const data = await response.json();

                if (!response.ok) {
                    console.error(`HTTP error! status: ${response.status}`);
                    return {
                        success: false,
                        status: response.status,
                        message: data.message,
                        data: null,
                    };
                }

                return {
                    success: true,
                    status: response.status,
                    message: data.message,
                    response: data.data,
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
