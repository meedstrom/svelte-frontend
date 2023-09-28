/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
  return /^\d{4}-\d{2}-\d{2}$/.test(param);
}
