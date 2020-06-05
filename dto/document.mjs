/**
 * Represents document object from database
 *
 * @property {number} id
 * @property {number} school_id
 * @property {string} name
 * @property {string} document_editor
 * @property {BaseDocumentContentDto} content
 */
export class DocumentDto {
    constructor(data) {
        for (let key in data) {
            if (key === 'content') {
                this.content = BaseDocumentContentDto.makeFromContent(data.document_editor, data[key]);
            } else {
                this[key] = data[key];
            }
        }
    }
}

export class BaseDocumentContentDto {
    constructor(data) {
        for (let key in data) {
            this[key] = data[key];
        }
    }

    static makeFromContent(editor, content) {
        content = JSON.parse(content);

        switch (editor) {
            case 'order':
                return new OrderDocumentContentDto(content);

            case 'protocol':
                return new ProtocolDocumentContentDto(content);

            default:
                throw new Error('Unknown document editor');
        }
    }
}

/**
 * Represents order content map
 *
 * @property {Array} orders
 * @property {?object} orderText
 * @property {?object} preamble
 * @property {director} director
 * @property {string} orderType
 */
export class OrderDocumentContentDto extends BaseDocumentContentDto {
}

/**
 * Represents protocol content map
 *
 * @property {Array} points
 * @property {string} protocolType
 * @property {object} head
 * @property {string} secretary
 */
export class ProtocolDocumentContentDto extends BaseDocumentContentDto {
}
