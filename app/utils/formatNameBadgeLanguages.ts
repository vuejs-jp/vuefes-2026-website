const NAME_BADGE_LANGUAGE_LABELS: Readonly<Record<string, string>> = {
  ja: "JP",
};

export function formatNameBadgeLanguages(lang: string | null | undefined) {
  if (!lang) return "";

  return lang
    .split(",")
    .map((language) => language.trim())
    .filter(Boolean)
    .map((language) => {
      const languageCode = language.toLowerCase();
      return NAME_BADGE_LANGUAGE_LABELS[languageCode] ?? languageCode.toUpperCase();
    })
    .join("/");
}
