ALTER TABLE
    `attributes`
MODIFY COLUMN
    `type` enum(
        'text',
        'textarea',
        'float',
        'image',
      	'link'
    )
NOT NULL AFTER `name`;