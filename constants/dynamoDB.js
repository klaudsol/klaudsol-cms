export const DYNAMO_DB_TABLE = 'klaudsol_cms';
export const DYNAMO_DB_TYPES = {
    content: 'content',
    content_type: 'content_type',
    attribute: 'attribute',
}
export const DYNAMO_DB_INDEXES = {
    slug_type_index: 'slug-type-index',
    type_index: 'type-index',
}
export const DYNAMO_DB_ATTRIBUTE_TYPES = {
    text: 'text',
    textarea: 'textarea',
    link: 'link',
    image: 'image',
    double: 'double',
    integer: 'integer',
    map: 'map',
}
export const DYNAMO_DB_ORDER = {
    desc: 'desc',
    asc: 'asc',
}