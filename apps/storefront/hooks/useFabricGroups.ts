import type { FabricGroup, NewFabricGroup } from '@couture-next/types';
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import useDatabase from './useDatabase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import slugify from 'slugify';
import { firestoreConverterAddRemoveId } from '@couture-next/utils';

type Return = {
  query: UseQueryResult<FabricGroup[]>;
  addGroupMutation: UseMutationResult<FabricGroup, unknown, NewFabricGroup>;
};

type Props = {
  search?: string;
};

export default function useFabricGroups(props?: Props): Return {
  const database = useDatabase();

  const getFabricGroupsQuery = useQuery({
    queryKey: ['fabricGroups.find.namePermutations', props?.search],
    queryFn: async () => {
      const firestoreQuery = !props?.search
        ? collection(database, 'fabricGroups')
        : query(
            collection(database, 'fabricGroups'),
            where(
              'namePermutations',
              'array-contains',
              slugify(props.search, { lower: true })
            )
          );

      const snapshot = await getDocs(
        firestoreQuery.withConverter(
          firestoreConverterAddRemoveId<FabricGroup>()
        )
      );
      return snapshot.docs.map((doc) => doc.data());
    },
    placeholderData: (oldData) => oldData ?? [],
  });

  const addGroupMutation = useMutation({
    mutationKey: ['addGroup'],
    mutationFn: async (group) => {
      const docRef = await addDoc(collection(database, 'fabricGroups'), {
        ...group,
        namePermutations: getNamePermutations(group.name),
      });
      getFabricGroupsQuery.refetch();
      return {
        _id: docRef.id,
        ...group,
      };
    },
  }) satisfies Return['addGroupMutation'];

  return {
    query: getFabricGroupsQuery,
    addGroupMutation,
  };
}

const getNamePermutations = (name: string) => {
  name = slugify(name, { lower: true });
  const r = [];
  for (let i = 0; i < name.length; i++) {
    for (let j = i + 1; j <= name.length; j++) {
      r.push(name.slice(i, j));
    }
  }
  return r;
};
