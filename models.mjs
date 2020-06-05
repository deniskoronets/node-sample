import db from "./database.mjs";
import fs from "fs";
import {__dirname} from "./helpers.mjs";
import {DocumentDto} from "./dto/document.mjs";

export const DocumentModel = {

    /**
     * Allows to get DTO state of document
     * @param id
     * @returns {Promise<null|DocumentDto>}
     */
    async getDocument(id) {
        let document = await db.selectFirst(`
                SELECT documents.*, document_types.document_editor
                FROM documents
                INNER JOIN document_types ON documents.document_type_id = document_types.id
                WHERE documents.id = ?
        `, [id]);

        if (!document) {
            return null;
        }

        return new DocumentDto(document);
    },
};
export const SchoolModel = {

    /**
     * Allows to get document header
     * @param doc - docx document
     * @param {DocumentDto} document
     * @returns {Promise<*>}
     */
    async getDocumentHeader(doc, document) {
        let school = await db.selectFirst(
            'SELECT subdomain FROM schools WHERE id = ?', [document.school_id]
        );

        const path = __dirname + '/../resources/document-headers/' + school.subdomain + '/index.mjs';

        if (!fs.existsSync(path)) {
            throw new Error('School ' + document.school_id + ' has no header');
        }

        let tmp = (await import(path));

        return tmp[document.document_editor](doc);
    },
}
