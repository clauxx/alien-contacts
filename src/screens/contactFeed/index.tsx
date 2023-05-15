import { Container, H1, H2 } from '@/components/styled';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { User, Api } from '@/utils/api';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
} from 'react-native';
import { colors } from '@/utils/styles';
import { ContactCard } from '@/components/ContactCard';
import styled from 'styled-components/native';
import { flattenPaginated } from '@/utils/contacts';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigation } from '@react-navigation/native';
import { usePostViewability } from '@/utils/usePostViewability';
import { randomInt } from '@/utils/random';
import { setCanvas, useAppDispatch } from '@/store';

export const StyledList = styled(FlatList as typeof FlatList<User>)`
  flex: 1;
  padding-top: 60px;
  padding-bottom: 80px;
  padding-left: 40px;
`;
const CenterContainer = styled(Container)`
  justify-content: center;
  align-items: center;
`;
const FloatingBtn = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: ${colors.card};
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 4px;
`;
const ShuffleImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const PAGINATION_LIMIT = 8 as const;
export const FEED_QUERY_KEY = 'feed' as const;

const ContactsScreen = memo(() => {
  const listRef = useRef<FlatList<User>>(null);
  const [page, setPage] = useState(1);
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isLoading,
    //@ts-ignore TS doesn't like the empty intialData
  } = useInfiniteQuery({
    queryKey: [FEED_QUERY_KEY],
    queryFn: Api.posts({ limit: PAGINATION_LIMIT }),
    keepPreviousData: false,
    getNextPageParam: () => {
      return page;
    },
    useErrorBoundary: true,
    initialData: [],
  });
  const listData = useMemo(() => flattenPaginated(data), [data]);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  console.log({ l: listData.length });

  useEffect(() => {
    listData.forEach(({ id }) => {
      dispatch(setCanvas(id));
    });
  }, [dispatch, listData]);

  const { visiblePosts, handleViewPosts, viewabilityConfig } =
    usePostViewability();

  const handleRenderItem: ListRenderItem<User> = useCallback(
    ({ item }) => {
      return (
        <ContactCard
          queryKey={FEED_QUERY_KEY}
          id={item.id}
          visible={visiblePosts.includes(item.id)}
        />
      );
    },
    [visiblePosts]
  );

  const fetchMore = useCallback(() => {
    if (!isFetchingNextPage) {
      fetchNextPage({ pageParam: page + 1 }).then(() => {
        setPage(page + 1);
      });
    }
  }, [fetchNextPage, isFetchingNextPage, page]);

  const refresh = useCallback(() => {
    if (!isRefetching) {
      setPage(1);
      queryClient
        .resetQueries({ queryKey: [FEED_QUERY_KEY], exact: true })
        .then(() => {
          refetch();
        });
    }
  }, [refetch, isRefetching, queryClient]);

  const handleShuffle = useCallback(() => {
    const index = randomInt(1, listData.length - 1);
    listRef.current?.scrollToIndex({
      animated: true,
      index,
    });
  }, [listData]);

  return isLoading ? (
    <CenterContainer>
      <ActivityIndicator size={'large'} />
    </CenterContainer>
  ) : (
    <Container>
      <StyledList
        ref={listRef}
        data={listData}
        keyExtractor={(item) => `item-${item.id}`}
        renderItem={handleRenderItem}
        onEndReached={fetchMore}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ paddingBottom: 80 }}
        onEndReachedThreshold={2}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refresh}
            tintColor={colors.textLight}
          />
        }
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={handleViewPosts}
      />
      <FloatingBtn onPress={handleShuffle}>
        <ShuffleImage source={require('@/assets/shuffle.png')} />
      </FloatingBtn>
    </Container>
  );
});

const ErrorFallback = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <CenterContainer>
      <H1 theme={'light'}>:(</H1>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <H2 theme={'light'} style={{ marginTop: 20 }}>
        Something went wrong
      </H2>
    </CenterContainer>
  );
};

export const ContactFeed = () => (
  <ErrorBoundary fallback={<ErrorFallback />}>
    <ContactsScreen />
  </ErrorBoundary>
);
