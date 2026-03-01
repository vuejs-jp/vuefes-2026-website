export function createWithBase(baseUrl: string) {
  function withBase(path: string) {
    return (baseUrl + path).replace(/\/\//g, "/");
  }

  return withBase;
}
