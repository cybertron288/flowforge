import { db } from '@/db';
import { ActionList } from '@/db/schema';

const BATCH_SIZE = 100; // Define the size of each batch for insertion
const MAX_RETRIES = 5; // Maximum number of retries per request
const INITIAL_DELAY = 1000; // Initial delay in milliseconds

const insertDataInBatches = async (data: typeof ActionList[]) => {
    console.log(`💾 Inserting ${data.length} records into the database in batches of ${BATCH_SIZE}...`);

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch: typeof ActionList[] = data.slice(i, i + BATCH_SIZE);
        try {
            await db.insert(ActionList).values(batch);
            console.log(`✅ Successfully inserted batch ${i / BATCH_SIZE + 1}`);
        } catch (error) {
            console.error(`❌ Error inserting batch ${i / BATCH_SIZE + 1}:`, error);
            throw error; // Re-throw the error if insertion fails
        }
    }

    console.log('🎉 All data batches have been inserted successfully.');
};

// Helper function to fetch with retry
const fetchWithRetry = async (url: string, options = {}, retries = MAX_RETRIES, delay = INITIAL_DELAY) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`⏭️ Attempt ${attempt} for URL: ${url}`);
            const response = await fetch(url, options);

            if (response.status === 429) {
                // Handle rate limiting
                const retryAfter = response.headers.get('Retry-After');
                const waitTime = retryAfter
                    ? parseInt(retryAfter, 10) * 1000
                    : delay * attempt; // Default exponential backoff
                console.warn(`⏳ Rate limited! Retrying in ${waitTime / 1000} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, waitTime));
                console.log('🔄 Resuming data fetch after rate limit...');
                continue; // Retry the request
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log(`✨ Request succeeded for URL: ${url}`);
            return await response.json(); // Parse and return JSON data
        } catch (error) {
            if (attempt === retries) {
                console.error(`❌ Failed after ${retries} retries: ${error}`);
                throw new Error(`Failed after ${retries} retries: ${error}`);
            }

            console.warn(`⚠️ Attempt ${attempt} failed. Retrying in ${delay * attempt}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
    }
};

const syncActions = async () => {
    const url = 'https://github.com/marketplace?type=actions';
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
    };

    let currentPage = 1;
    let totalPages = 1;
    const allData = [];

    try {
        // Fetch the first page to determine the total number of pages
        console.log('🚀 Starting data sync...');
        const initialData = await fetchWithRetry(`${url}&page=${currentPage}`, {
            method: 'GET',
            headers,
        });

        const { results, totalPages: total } = initialData;
        totalPages = total; // Set the totalPages
        allData.push(...results); // Store results from the first page

        console.log(`📄 Total pages to fetch: ${totalPages}`);

        // Fetch remaining pages, retrying until all data is loaded
        while (currentPage < totalPages) {
            currentPage++; // Move to the next page
            let pageDataLoaded = false;

            while (!pageDataLoaded) {
                try {
                    console.log(`🔄 Fetching page ${currentPage}...`);
                    const pageData = await fetchWithRetry(`${url}&page=${currentPage}`, {
                        method: 'GET',
                        headers,
                    });

                    console.log(`✅ Page ${currentPage}/${totalPages} loaded successfully.`);
                    const { results: pageResults } = pageData;
                    allData.push(...pageResults); // Accumulate results
                    pageDataLoaded = true; // Mark the page as successfully loaded
                } catch (error) {
                    console.warn(`⚠️ Error fetching page ${currentPage}. Retrying...`);
                }
            }
        }

        // Store data into the database
        console.log(`💾 Storing ${allData.length} records into the database...`);
        await insertDataInBatches(allData);

        console.log('🎉 All data loaded and stored successfully.');
    } catch (error) {
        console.error('❌ Error syncing actions:', error);
    }
};

export { syncActions };
