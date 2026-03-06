import { Integrations } from '$lib/types/integrations';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({}) => {
	redirect(301, '/' + Integrations.ALL + '/page/1');
};
