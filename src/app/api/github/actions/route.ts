import { desc, ilike, sql } from "drizzle-orm";
import { NextResponse } from 'next/server';

import { db } from "@/db";
import { ActionList } from "@/db/schema";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const query = searchParams.get('query') || ''; // Default to an empty string
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '30');

        console.log(query);

        // Get total item count
        const totalCountQuery = db
            .select({ count: sql`count(*)` }) // Count query
            .from(ActionList);

        if (query) {
            totalCountQuery.where(ilike(ActionList.name, `%${query}%`));
        }

        const totalCountResult = await totalCountQuery.execute();
        const totalCount = parseInt(totalCountResult[0]?.count, 10);

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / perPage);

        // Fetch paginated results
        const data = await db
            .select()
            .from(ActionList)
            .where(
                query ? ilike(ActionList.name, `%${query}%`) : undefined // Filter only if query is provided
            )
            .orderBy(desc(ActionList.stars)) // Sorting
            .limit(perPage) // Pagination: limit rows
            .offset((page - 1) * perPage); // Pagination: offset rows

        return NextResponse.json({
            success: true,
            message: 'GitHub actions fetched successfully',
            data: {
                data,
                totalCount,
                totalPages,
                currentPage: page,
                perPage,
            }
        });
    } catch (error) {
        console.error('Error fetching GitHub actions:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch GitHub actions', data: null },
            { status: 500 }
        );
    }
}