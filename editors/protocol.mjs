import docx from "docx";
import {orderPointsToDocx} from "./../helpers.mjs";

const {Paragraph, Run, Table, TableRow, TableCell, WidthType, BorderStyle} = docx;

/**
 * Converts protocol map to docx markup
 * @param {DocumentDto} document
 * @returns {Paragraph[]}
 */
export default function generateProtocol(document) {

    /** @type {ProtocolDocumentContentDto} */
    let content = document.content;

    let result = [
        new Paragraph('від ________'),

        new Paragraph({
            indent: {
                left: 3.54 * 1440,
            },
            text: 'Всього членів ради –',
        }),

        new Paragraph({
            indent: {
                left: 3.54 * 1440,
            },
            text: 'Присутні –',
        }),

        new Paragraph({
            indent: {
                left: 3.54 * 1440,
            },
            text: 'Відсутні з поважних причин –',
        }),

        new Paragraph({}),

        new Paragraph({
            alignment: 'center',
            text: 'Черга денна',
        }),

        new Paragraph({}),
        new Paragraph({}),
    ];

    content.points.map((point, index) => {
        result.push(
            new Paragraph({
                text: (index + 1) + '. ' + point.content
            })
        );
        result.push(
            new Paragraph({
                alignment: 'right',
                text: 'Доповідач: ' + point.user.user.label,
            })
        );
    });

    result.push(new Paragraph({}));

    content.points.map((point, index) => {
        result.push(
            new Paragraph({
                children: [
                    new Run({
                        bold: true,
                        text: (index + 1) + '. СЛУХАЛИ: ',
                    }),
                    new Run({
                        text: point.listened,
                    })
                ]
            })
        );

        result.push(new Paragraph({
            children: [
                new Run({
                    bold: true,
                    text: (index + 1) + '. ВИСТУПИЛИ:',
                })
            ]
        }));

        point.made.map((made, madeIndex) => {
           result.push(
               new Paragraph(
                   (index + 1) + '.' + (madeIndex + 1) + '. ' +
                   made.user.user.label + ' ' + made.content
               )
           );
        });

        result.push(new Paragraph({
            children: [
                new Run({
                    bold: true,
                    text: (index + 1) + '. УХВАЛИЛИ:',
                })
            ]
        }));

        result = result.concat(orderPointsToDocx(point.approved));
    });

    result.push(new Paragraph({}));
    result.push(new Paragraph({}));

    result.push(
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
                                    text: content.head.position
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
                                    text: content.head.name,
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
        })
    );

    result.push(
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
                                    text: 'Секретар',
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
                                    text: content.secretary,
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
        })
    );

    return result;
}
