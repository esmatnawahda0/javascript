const isomorphicAtob = (data: string) => {
  if (typeof atob !== 'undefined' && typeof atob === 'function') {
    return atob(data);
  } else if (typeof globalThis !== 'undefined' && globalThis.Buffer) {
    return globalThis.Buffer.from(data, 'base64').toString();
  }
  return data;
};

export default isomorphicAtob;
