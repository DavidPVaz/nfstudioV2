import 'server-only';

import {
    CONTENT_TYPES,
    type DocumentTitle,
    type NFStudioDocument,
    type ItemData
} from '@/server/service/contentful/types';
import {
    contentfulApiGETRequest,
    ContentfulApiRequestError
} from '@/server/service/contentful/core';

/**
 * Performs a query to NFStudio CMS to retrieve a document.
 *
 * @param {object} options - options to query document
 * @param {DocumentTitle} options.title - document title
 *
 * @throws {Error | ContentfulApiRequestError} if request failed
 */
export const queryDocument = async ({ title }: { title: DocumentTitle }) => {
    const {
        items: [{ fields: document } = {} as ItemData<NFStudioDocument>]
    } = await contentfulApiGETRequest<NFStudioDocument>({
        queryArgs: {
            include: 0,
            content_type: CONTENT_TYPES.DOCUMENT,
            fields: { title }
        }
    });

    if (!document) {
        throw new ContentfulApiRequestError(`Document with the title ${title} was not found.`, 404);
    }

    return document;
};
