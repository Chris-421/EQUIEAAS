import { buildQueryStringFromTracking, getTrackingFromSearchParams } from '@/lib/tracking';
import { LandingView } from '@/components/fit-check/landing-view';

interface HomePageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

function toUrlSearchParams(searchParams: HomePageProps['searchParams']) {
  const nextSearchParams = new URLSearchParams();

  if (!searchParams) {
    return nextSearchParams;
  }

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        nextSearchParams.append(key, item);
      }
      continue;
    }

    if (typeof value === 'string') {
      nextSearchParams.set(key, value);
    }
  }

  return nextSearchParams;
}

export default function HomePage({ searchParams }: HomePageProps) {
  const fitCheckHref = `/fit-check${buildQueryStringFromTracking(
    getTrackingFromSearchParams(toUrlSearchParams(searchParams)),
  )}`;

  return <LandingView fitCheckHref={fitCheckHref} />;
}
