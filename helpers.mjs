import docx from "docx";
import database from "./database.mjs";
import fs from "fs";
import {dirname} from "path";
import {fileURLToPath} from "url";
import shevchenko from "shevchenko";

const { Paragraph, Run } = docx;

export const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Конвертирует json-dom объект в docx разметку
 * Поддерживает текст, переносы строки, списки и заголовки
 * @param json
 */
export function jsonToDocx(json) {
    // Sample:
    // {"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "qweqweqwe", "type": "text"}]}]}}]

    let recursive = (childContent) => {
        let result = [];

        childContent.map((item) => {
            switch (item.type) {
                case 'hard_break':
                    result.push(new Paragraph({}));
                    break;

                case 'paragraph':
                    result.push(new Paragraph({
                        children: item.content && item.content.length > 0 ? recursive(item.content) : [],
                    }));
                    break;

                case 'text':
                    let marks = {};

                    if (item.marks) {
                        item.marks.map((mark) => {
                            switch(mark.type) {
                                case 'bold':
                                    marks.bold = true;
                                    break;

                                case 'italic':
                                    marks.italic = true;
                                    break;

                                default:
                                    throw new Error('Unknown mark: ' + mark.type);
                            }
                        });
                    }

                    result.push(new Run({
                        text: item.text,
                        ...marks,
                    }));
                    break;

                case 'bullet_list':
                    result = result.concat(
                        item.content.map((i) => {
                            return new Paragraph({
                                children: recursive(i.content[0].content),
                                bullet: {
                                    level: 0,
                                }
                            });
                        })
                    );
                    break;

                case 'ordered_list':
                    result = result.concat(
                        item.content.map((i, index) => {
                            return new Paragraph({
                                children: [
                                    new Run({
                                        text: index + '. ',
                                    }),

                                    ...recursive(i.content[0].content),
                                ]
                            });
                        })
                    );
                    break;

                default:
                    throw new Error('Unknown type: ' + item.type);
            }
        });

        return result;
    };

    return recursive(json.content);
}

/**
 * Форматирует пользователей в давательном падеже
 */
export function selectedUsersToDative(selectedUsers)
{
    return selectedUsers.map((item) => {
        return (item.group.dative_name ? item.group.dative_name : item.group.name) + ' (' +
            item.users.map(user => {
                if (!user) {
                    return '';
                }

                let tmp = shevchenko.inDative({
                    firstName: user.first_name,
                    middleName: user.surname,
                    lastName: user.last_name,
                    gender: user.surname.substring(-1, 3) === 'вич' ? 'male' : 'female',
                });

                return tmp.lastName + ' '
                    + tmp.firstName.substring(0, 1).toUpperCase() + '. '
                    + tmp.middleName.substring(0, 1).toUpperCase() + '.';
            }).filter(v => v.length > 0).join(', ')
            + ')';
    }).join(', ');
}

/**
 * Конвертирует пункты приказа в docx разметку
 */
export function orderPointsToDocx(points) {
    let result = [];

    for (let index in points) {
        let point = points[index],
            content = point.content,
            users = point.users ? selectedUsersToDative(point.users.picked) + ' ' : '';

        if (!content.content) {

            if (!users) {
                throw new Error('Пункт приказа ' + (index + 1) + ' не содержит содержимого');
            }

            result.push(
                new Paragraph({
                    text: (index * 1 + 1) + '. ' + users + ':',
                })
            );
        } else {
            content.content[0].content[0].text = (index * 1 + 1) + '. ' + users + content.content[0].content[0].text;

            result = result.concat(
                jsonToDocx(content)
            );
        }

        if (point.terms) {
            result.push(new Paragraph({
                alignment: 'right',
                text: point.terms.formatted,
            }));
        }

        if (point.sub.length > 0) {
            for (let subIndex in point.sub) {
                let sub = point.sub[subIndex],
                    content = sub.content;

                content.content[0].content[0].text = (index * 1 + 1) + '.' + (subIndex * 1 + 1) + '. ' + content.content[0].content[0].text;

                result = result.concat(
                    jsonToDocx(content)
                );

                if (sub.terms) {
                    result.push(new Paragraph({
                        alignment: 'right',
                        text: sub.terms.formatted,
                    }));
                }

                if (sub.sub.length > 0) {
                    for (let subSubIndex in sub.sub) {
                        let subSub = sub.sub[subSubIndex],
                            content = subSub.content;

                        content.content[0].content[0].text = (index * 1 + 1) + '.' + (subIndex * 1 + 1) + '.' + (subSubIndex * 1 + 1) + '. ' + content.content[0].content[0].text;

                        result = result.concat(
                            jsonToDocx(content)
                        );
                    }
                }
            }
        }
    }

    return result;
}

/**
 * Позволяет получить плоский список пользователей, указанных как исполнители приказа
 * @param orders
 * @returns {*[]}
 */
export function extractUsersFromOrderPoints(orders) {
    let result = [];

    for (let order of orders) {
        if (order.users) {
            order.users.picked.map(g => {
                result = result.concat(
                    g.users.map(u => u.label)
                );
            });
        }
    }

    return result;
}
