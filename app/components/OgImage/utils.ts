export const resolveOgImageUrl = (siteUrl: string, path: string | undefined) => {
  if (!path) {
    return "";
  }

  if (path.startsWith("//")) {
    return `${new URL(siteUrl).protocol}${path}`;
  }

  try {
    return new URL(path).toString();
  } catch {
    const site = new URL(siteUrl);
    const basePath = site.pathname.endsWith("/") ? site.pathname : `${site.pathname}/`;
    const resolvedPath = path.startsWith("/") ? path : `${basePath}${path}`;
    return new URL(resolvedPath, site.origin).toString();
  }
};
