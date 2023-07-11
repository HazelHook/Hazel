import React from 'react';

function parseMarkdown(markdown: string) {
    const elements = [];
    let accumulator = '';
    for (let i = 0; i < markdown.length; i++) {
        if (markdown[i] === '*') {
            if (markdown[i + 1] === '*') {
                if (accumulator) {
                    elements.push(accumulator);
                    accumulator = '';
                }
                const end = markdown.indexOf('**', i + 2);
                if (end > -1) {
                    elements.push(<b>{markdown.substring(i + 2, end)}</b>);
                    i = end + 1;
                }
            } else {
                if (accumulator) {
                    elements.push(accumulator);
                    accumulator = '';
                }
                const end = markdown.indexOf('*', i + 1);
                if (end > -1) {
                    elements.push(<i>{markdown.substring(i + 1, end)}</i>);
                    i = end;
                }
            }
        } else if (markdown[i] === '[') {
            const endText = markdown.indexOf(']', i + 1);
            const endUrl = markdown.indexOf(')', endText + 1);
            if (endText > -1 && endUrl > -1) {
                if (accumulator) {
                    elements.push(accumulator);
                    accumulator = '';
                }
                elements.push(<a href={markdown.substring(endText + 2, endUrl)} rel="noreferrer" target='_blank' className='underline'>{markdown.substring(i + 1, endText)}</a>);
                i = endUrl;
            }
        } else {
            accumulator += markdown[i];
        }
    }
    if (accumulator) {
        elements.push(accumulator);
    }
    return elements;
}

export function IntegrationMDText({description}: { description?: string }) {
    if(!description) return null

    return (
        <p className="text-gray-500 text-sm">{parseMarkdown(description)}</p>
    )
}