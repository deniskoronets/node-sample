import docx from "docx";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import {__dirname} from "./helpers.mjs";
import docStyles from "./doc-styles.mjs";
import {DocumentModel} from "./models.mjs";
import {SchoolModel} from "./models.mjs";
import documentEditorFactory from "./editors/index.mjs";
const { Document, Packer } = docx;
import dotenv from "dotenv";
dotenv.config();

const args = process.argv.slice(2);
const orderDocumentId = parseInt(args[0]);

if (!orderDocumentId) {
    throw new Error('Document id not specified');
}

(async () => {
    const document = await DocumentModel.getDocument(orderDocumentId);

    if (!document) {
        throw new Error('Unknown document');
    }

    let doc = new Document({
        styles: docStyles.default,
    });

    let header = await SchoolModel.getDocumentHeader(doc, document),
        body = documentEditorFactory(document.document_editor)(document);

    doc.addSection({
        margins: {
            left: 1700,
            right: 849,
        },
        children: [
            ...header,
            ...body,
        ]
    });

    let buffer = await Packer.toBuffer(doc);
    let documentName = document.id + '--' + uuidv4() + '.docx';

    fs.writeFileSync(__dirname + '/../public/_documents/' + documentName, buffer);
    process.stdout.write('success: ' + documentName);

})().catch(e => {
    process.stdout.write('error: ' + e.message + "\n" + e.stack);

}).finally(() => {
    process.exit();
});
