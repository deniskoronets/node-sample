export default {
    paragraphStyles: [
        {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
                size: 28,
                bold: true,
                font: "Times New Roman",
            },
            paragraph: {
                spacing: {
                    after: 120,
                },
            },
        },
        {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
                size: 26,
                bold: true,
                font: "Times New Roman",
            },
            paragraph: {
                spacing: {
                    before: 240,
                    after: 120,
                },
            },
        },
        {
            id: "Normal",
            name: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
                size: 12 * 2,
                font: "Times New Roman",
            },
            paragraph: {
                indent: {
                    firstLine: 550,
                },
                spacing: {
                    before: 120,
                    after: 90,
                    line: 400,
                },
            },
        },
    ],
};
