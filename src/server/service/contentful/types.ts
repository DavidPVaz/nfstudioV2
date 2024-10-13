import { Document as ContentfulDocument } from '@contentful/rich-text-types';

export const CONTENT_TYPES = {
    DOCUMENT: 'document'
} as const;
export type Content = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

export const DOCUMENTS = {
    TERMS_OF_SERVICE: 'Terms of Service',
    PRIVACY_POLICY: 'Privacy Policy'
} as const;
export type DocumentTitle = (typeof DOCUMENTS)[keyof typeof DOCUMENTS];

export type NFStudioDocument = {
    content: ContentfulDocument;
    title: DocumentTitle;
};

type DocumentSearchParams = {
    title: DocumentTitle;
};

export type NFStudioCMSQueryArgs = {
    include: 0 | 1;
    content_type: Content;
    fields: DocumentSearchParams;
};

export type ItemData<T> = {
    fields: T;
    metadata: object;
    sys: {
        id: number;
        createdAt: string;
        updatedAt: string;
        contentType: { sys: { id: Content } };
    };
};
