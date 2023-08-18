export const DYNAMO_DB_TABLE = 'klaudsol_cms';
export const DYNAMO_DB_TYPES = {
    content: 'content',
    content_type: 'content_type',
    attribute: 'attribute',
}
export const DYNAMO_DB_INDEXES = {
    entity_slug_index: 'entity-slug-index',
    entity_type_index: 'entity-type-index',
    type_index: 'type-index',
}
export const DYNAMO_DB_ATTRIBUTE_TYPES = {
    text: 'text',
    textarea: 'textarea',
    link: 'link',
    image: 'image',
    float: 'float',
    number: 'number'
}
export const DYNAMO_DB_ID_SEPARATOR = '#';