import {jsonToDocx} from "../helpers.mjs";
import docx from "docx";
import {orderPointsToDocx} from "./../helpers.mjs";
import {extractUsersFromOrderPoints} from "../helpers.mjs";

const {Paragraph, Run, Table, TableRow, TableCell, WidthType, BorderStyle} = docx;

const TYPE_WORKING = 'working';
const TYPE_PERSONNEL = 'personnel';

/**
 * Converts order map to docx markup
 * @param {DocumentDto} document
 * @returns {*[]}
 */
export default function generateOrder(document) {

    let orderUsers = [];

    /** @type {OrderDocumentContentDto} */
    let content = document.content;

    if (content.orderType === TYPE_WORKING) {
        orderUsers = extractUsersFromOrderPoints(content.orders);
    }

    return [
        new Paragraph({
            alignment: 'center',
            indent: {
                firstLine: 0,
            },
            children: [
                new Run({
                    text: 'НАКАЗ',
                    bold: true,
                })
            ]
        }),
        new Paragraph({}),
        new Table({
            width: {
                size: 9355,
                type: WidthType.DXA,
            },
            columnWidths: [3118, 3118, 3118],
            borders: {
                top: {style: BorderStyle.NIL},
                right: {style: BorderStyle.NIL},
                bottom: {style: BorderStyle.NIL},
                left: {style: BorderStyle.NIL},
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    indent: {
                                        firstLine: 0,
                                    },
                                    text: 'Від _________',
                                }),
                            ],
                            width: {
                                size: 3118,
                                widthType: WidthType.DXA
                            },
                            borders: {
                                top: {style: BorderStyle.NIL},
                                right: {style: BorderStyle.NIL},
                                bottom: {style: BorderStyle.NIL},
                                left: {style: BorderStyle.NIL},
                            }
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: 'center',
                                    text: 'м. Запоріжжя',
                                    indent: {
                                        firstLine: 0,
                                    }
                                }),
                            ],
                            width: {
                                size: 3118,
                                widthType: WidthType.DXA
                            },
                            borders: {
                                top: {style: BorderStyle.NIL},
                                right: {style: BorderStyle.NIL},
                                bottom: {style: BorderStyle.NIL},
                                left: {style: BorderStyle.NIL},
                            }
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: 'right',
                                    text: '№ _________',
                                    indent: {
                                        firstLine: 0,
                                    }
                                }),
                            ],
                            width: {
                                size: 3118,
                                widthType: WidthType.DXA
                            },
                            borders: {
                                top: {style: BorderStyle.NIL},
                                right: {style: BorderStyle.NIL},
                                bottom: {style: BorderStyle.NIL},
                                left: {style: BorderStyle.NIL},
                            }
                        })
                    ]
                })
            ]
        }),
        new Paragraph({}),

        ...jsonToDocx(content.preamble),

        new Paragraph({}),

        new Paragraph({
            children: [
                new Run({
                    text: 'НАКАЗУЮ:',
                    bold: true,
                })
            ]
        }),

        ...(content.orderType === TYPE_WORKING
            ? orderPointsToDocx(content.orders)
            : jsonToDocx(content.orderText)
        ),

        new Paragraph({}),
        new Paragraph({}),

        new Table({
            width: {
                size: 9355,
                type: WidthType.DXA,
            },
            columnWidths: [4677, 4677],
            borders: {
                top: {style: BorderStyle.NIL},
                right: {style: BorderStyle.NIL},
                bottom: {style: BorderStyle.NIL},
                left: {style: BorderStyle.NIL},
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: content.director.position
                                }),
                            ],
                            width: {
                                size: 4677,
                                widthType: WidthType.DXA
                            },
                            borders: {
                                top: {style: BorderStyle.NIL},
                                right: {style: BorderStyle.NIL},
                                bottom: {style: BorderStyle.NIL},
                                left: {style: BorderStyle.NIL},
                            }
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: 'right',
                                    text: content.director.name,
                                }),
                            ],
                            width: {
                                size: 4677,
                                widthType: WidthType.DXA
                            },
                            borders: {
                                top: {style: BorderStyle.NIL},
                                right: {style: BorderStyle.NIL},
                                bottom: {style: BorderStyle.NIL},
                                left: {style: BorderStyle.NIL},
                            }
                        })
                    ]
                })
            ]
        }),

        new Paragraph({}),
        new Paragraph({}),


        ...(content.orderType === TYPE_WORKING
            ? (
                orderUsers.length > 0
                ? [
                    new Paragraph('З наказом від _________ №_________ “' + document.name + '” ознайомлені:'),
                    ...(orderUsers.map(userName => new Paragraph(userName + ''))),
                ]
                : []
            )
            : [
                new Paragraph({
                    text: 'Ознайомлений:',
                }),
            ]
        )
    ];
}
