'use server'

import { apiImpl } from '../../../lib/server';
import { backend } from '../../../lib/config';

export async function GET(request) {
    return apiImpl(backend.urls.data, request);
};