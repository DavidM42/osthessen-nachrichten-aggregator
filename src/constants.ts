export const OSTHESEN_HOST = 'www.osthessen-zeitung.de';
export const OSTHESSEN_BASE_URL = `https://${OSTHESEN_HOST}/`;

// old slow python flask lambda proxy maybe as fallback
// export const PROXY_BASE_URL = 'https://qde7wbe9bg.execute-api.eu-central-1.amazonaws.com/dev/';

// fast cloudfront lambda on edge proxy in cloudfront
export const PROXY_HOST = 'd3rtky4jrzlhag.cloudfront.net'
export const PROXY_BASE_URL = `https://${PROXY_HOST}/`;

export const DARK_MODE_STORAGE_KEY = 'isDarkMode';
export const AGGRESIVE_SPONSOR_HATER_KEY = 'hatesSponsors';