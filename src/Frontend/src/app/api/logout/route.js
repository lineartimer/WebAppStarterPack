'use server'

import { apiImpl } from '../../../lib/server';
import { backend } from '../../../lib/config';

export async function POST(request) {
    return apiImpl(backend.urls.logout, request);
};