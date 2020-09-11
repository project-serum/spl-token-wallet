export class SwapApiError extends Error {
  constructor(msg, status) {
    super(msg);
    this.name = 'SwapApiError';
    this.status = status;
  }
}

export async function swapApiRequest(method, path, body) {
  let headers = {};
  let params = { headers, method };
  if (method === 'GET') {
    params.cache = 'no-cache';
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    params.body = JSON.stringify(body);
  }
  let resp = await fetch(`https://swap.sollet.io/api/${path}`, params);
  return await handleSwapApiResponse(resp);
}

async function handleSwapApiResponse(resp) {
  let json = await resp.json();
  if (!json.success) {
    throw new SwapApiError(json.error, resp.status);
  }
  return json.result;
}
