Model naming conventions:

1.) The name of the class and instance methods must be in camel-case (e.g. EntityType.whereSlug) to follow JavaScript naming conventions.
2.) The parameters of the method, however, must be in underscore case (e.g. Attribute.create({entity_type_id, name, type, order})) 
so that the parameter names would map neatly to the database field names, which must be in underscore case.
3.) Methods that has the `findBy*` pattern only returns one value.
4.) Methods that has the `where*` pattern returns one or more values.