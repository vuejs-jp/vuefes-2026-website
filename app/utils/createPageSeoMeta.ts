import type { UseSeoMetaInput } from "@unhead/vue";

export type PageSeoMetaInput = {
  title?: UseSeoMetaInput["ogTitle"];
  titleTemplate?: UseSeoMetaInput["titleTemplate"];
  socialTitle?: UseSeoMetaInput["ogTitle"];
  description?: UseSeoMetaInput["description"];
  image?: UseSeoMetaInput["twitterImage"];
};

export function createPageSeoMeta({
  title,
  titleTemplate,
  socialTitle = title,
  description,
  image,
}: PageSeoMetaInput): UseSeoMetaInput {
  return {
    ...(title === undefined ? {} : { title }),
    ...(titleTemplate === undefined ? {} : { titleTemplate }),
    ...(socialTitle === undefined
      ? {}
      : {
          ogTitle: socialTitle,
          twitterTitle: socialTitle,
        }),
    ...(description === undefined
      ? {}
      : {
          description,
          ogDescription: description,
          twitterDescription: description,
        }),
    ...(image === undefined
      ? {}
      : {
          ogImage: image,
          twitterImage: image,
        }),
    twitterCard: "summary_large_image",
  };
}
