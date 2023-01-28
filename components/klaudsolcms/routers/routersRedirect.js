
export const redirectToBuilderTypeSlug = (router,slug) => {
  router.push(`/admin/content-type-builder/${slug}`);
}

export const redirectToManagerEntitySlug = (router,slug) => {
  router.push(`/admin/content-manager/${slug}`)
}