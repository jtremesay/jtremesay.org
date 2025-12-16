import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
    return new Response(String(), {
        headers: {
            'Content-Type': 'application/atom+xml'
        }
    });
};