import useSWR from 'swr'
import { getThreads } from '../graphql/queries'
import { API } from '@aws-amplify/api'
import { COLLECTIONS } from '../pages/conversations_pages/ConversationSettings'


export default function useThreads(collectionCode) {

    const fetcher = async () => {
        const findCollectionByCode = (code) => COLLECTIONS.find(collection => collection.code === code)
        const collection = findCollectionByCode(collectionCode);
        const response = await API.graphql({
            query: getThreads,
            variables: {
                collection_name: collection.name,
                key: undefined,
                value: undefined
            },
        });
        let threads = response.data.getThreads;
        console.log('Fetch using API : threads : ', threads ? threads.length : 0);
        return threads;
    };

    const { data, error, isLoading } = useSWR(`/api/threads/${collectionCode}`, fetcher)

    return {
        threads: data,
        isLoading,
        isError: error
    }
}