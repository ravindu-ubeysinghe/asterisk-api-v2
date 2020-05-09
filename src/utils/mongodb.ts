import { Document } from 'mongoose';
import isArray from 'lodash/isArray';

export const filterOutFields = (documents: Document | Document[], fields: string[]) => {
    if (!documents || !fields) return documents;

    let filteredDocuments: any = [];
    const removeFields = (document: Document) => {
        const documentObj = document.toObject();
        fields.forEach((field) => {
            documentObj[field] && delete documentObj[field];
        });
        return documentObj;
    };

    if (isArray(documents)) {
        documents.forEach((document) => {
            const modifiedDocument = removeFields(document);
            filteredDocuments = [...filteredDocuments, modifiedDocument];
        });
        return filteredDocuments;
    }

    return removeFields(documents);
};
