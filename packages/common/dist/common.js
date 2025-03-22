const n = (e) => e == null, s = (e) => e && typeof e == "object", r = (e) => n(e) || Array.isArray(e) && e.length === 0 || s(e) && Object.keys(e).length === 0 || typeof e == "string" && e.trim().length === 0, i = (e) => n(e) || Array.isArray(e) && e.length === 0 || s(e) && Object.keys(e).length === 0 || typeof e == "string" && e.trim().length === 0;
export {
  r as isBlank,
  n as isEmpty,
  i as isNotBlank,
  s as isObject
};
