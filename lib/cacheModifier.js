export const setDefaultEntityType = async (req, defaultEntityType) => {
  req.session.cache.defaultEntityType = defaultEntityType;
    await req.session.save();
}