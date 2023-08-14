import getClientQueryParams from '~/core/generic/get-client-query-params';

const REDIRECT_URL_QUERY_PARAM = 'returnUrl';
const SIGN_OUT_URL_QUERY_PARAM = 'signOut';

/**
 * @name getRedirectPathWithoutSearchParam
 * @param defaultRedirectPath
 * @description Strip our query parameters and returns a clean URL
 */
export function getRedirectPathWithoutSearchParam(defaultRedirectPath: string) {
  const params = getClientQueryParams();
  const returnUrl = params.get(REDIRECT_URL_QUERY_PARAM) ?? defaultRedirectPath;
  const hasParams = Array.from(params.values()).length - 1 > 0;

  params.delete(REDIRECT_URL_QUERY_PARAM);
  params.delete(SIGN_OUT_URL_QUERY_PARAM);

  // redirect to the URL passed in from the search params
  return [returnUrl, hasParams ? `?${params.toString()}` : ''].join('/');
}
