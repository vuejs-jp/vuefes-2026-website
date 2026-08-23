export function formatNameBadgeLanguages(lang: string | null | undefined) {
  if (!lang) return "";

  return lang
    .split(",")
    .map((language) => language.trim())
    .filter(Boolean)
    .join("/");
}
