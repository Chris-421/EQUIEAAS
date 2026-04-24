import { type FitCheckTracking } from '@/lib/types/fit-check';

export const EMPTY_TRACKING: FitCheckTracking = {
  source: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
};

export function getTrackingFromSearchParams(
  searchParams: URLSearchParams,
): FitCheckTracking {
  return {
    source: searchParams.get('source') ?? '',
    utmSource: searchParams.get('utm_source') ?? '',
    utmMedium: searchParams.get('utm_medium') ?? '',
    utmCampaign: searchParams.get('utm_campaign') ?? '',
  };
}

export function getTrackingFromWindow(): FitCheckTracking {
  if (typeof window === 'undefined') {
    return EMPTY_TRACKING;
  }

  return getTrackingFromSearchParams(new URLSearchParams(window.location.search));
}

export function buildQueryStringFromTracking(tracking: FitCheckTracking) {
  const searchParams = new URLSearchParams();

  if (tracking.source) {
    searchParams.set('source', tracking.source);
  }
  if (tracking.utmSource) {
    searchParams.set('utm_source', tracking.utmSource);
  }
  if (tracking.utmMedium) {
    searchParams.set('utm_medium', tracking.utmMedium);
  }
  if (tracking.utmCampaign) {
    searchParams.set('utm_campaign', tracking.utmCampaign);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
