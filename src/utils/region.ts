import { useAsync } from 'react-async-hook';

const ENDPOINT = 'https://calm-hat-66c2.project-serum.workers.dev';

export function useRegion() {
  return useAsync(async () => {
    const resp = await fetch(ENDPOINT);
    return await resp.json();
  }, []);
}
