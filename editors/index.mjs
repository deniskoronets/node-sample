import generateOrder from "./order.mjs";
import generateProtocol from "./protocol.mjs";

/**
 * Allows to dynamically get generator by editor name
 * @param documentEditor
 * @returns {function|generateOrder|generateProtocol}
 */
export default function documentEditorFactory(documentEditor) {
    switch (documentEditor) {
        case 'order':
            return generateOrder;

        case 'protocol':
            return generateProtocol;

        default:
            throw new Error('Unknown document editor');
    }
}
