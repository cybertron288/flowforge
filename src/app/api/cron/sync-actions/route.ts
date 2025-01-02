import { syncActions } from '@/cron/fetch-actions';

export const runtime = 'edge';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    await syncActions();
    return new Response('OK');
}