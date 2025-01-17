import * as T from '@elastic/elasticsearch/lib/api/types';

import type { ApiResponseDocument } from '@/types/apiResponseDocument';
import type { BaseDocument } from '@/types/baseDocument';
import { getClient } from '../client';
// import { similarCollectionObjectEmbedding } from './similarObjectEmbedding';
import { similarCollectionObjects } from './similarObjects';

/**
 * Get a document by Elasticsearch id
 *
 * If we're querying the collections index, also return similar objects and similar dominant colors
 *
 * @param index Index to search
 * @param id ID of document to search for
 * @returns ApiResponseDocument containing query, data, similar objects and similar dominant colors
 */
export async function getDocument(
  index: string,
  id: number | string,
  getAdditionalData: boolean = true
): Promise<ApiResponseDocument> {
  const esQuery: T.SearchRequest = {
    index,
    query: {
      match: {
        id,
      },
    },
  };
  // Turn off embeddings for now
  esQuery._source = {
    excludes: ['image.embedding'],
  };
  const client = getClient();
  if (client === undefined) return {};
  const response: T.SearchTemplateResponse = await client.search(esQuery);
  const data = response?.hits?.hits[0]?._source as BaseDocument;
  const apiResponse: ApiResponseDocument = { query: esQuery, data };
  if (index === 'collections' && getAdditionalData) {
    apiResponse.similar = await similarCollectionObjects(data, client);
    /*
    // Turn embeddings off for now
    apiResponse.embeddings = await similarCollectionObjectEmbedding(
      data,
      client
    );
    */
  }
  return apiResponse;
}
