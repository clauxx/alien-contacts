import {Container, H1, H2} from '@/components/styled';
import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import {User, Api} from '@/utils/api';
import {FlatList, ListRenderItem, RefreshControl} from 'react-native';
import {colors} from '@/utils/styles';
import {
  ContactCard,
  Fallback as ContactCardFallback,
} from '@/components/ContactCard';
import styled from 'styled-components/native';
import {flattenPaginated} from '@/utils/contacts';
import {ErrorBoundary} from 'react-error-boundary';
import {useNavigation} from '@react-navigation/native';
import {usePostViewability} from '@/utils/usePostViewability';
import {randomInt} from '@/utils/random';
import {setCanvas, useAppDispatch} from '@/store';

export const StyledList = styled(FlatList as typeof FlatList<User>)`
  flex: 1;
  padding-top: 60px;
  padding-bottom: 80px;
  padding-left: 40px;
`;
export const StyledListFallback = styled(FlatList as typeof FlatList<number>)`
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

const defaultData = {
  pages: [],
  pageParams: [],
};

const ContactsScreen = memo(() => {
  const listRef = useRef<FlatList<User>>(null);
  const [page, setPage] = useState(1);
  const {
    data = defaultData,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [FEED_QUERY_KEY],
    queryFn: Api.posts({limit: PAGINATION_LIMIT}),
    getNextPageParam: () => {
      return page;
    },
    useErrorBoundary: true,
  });
  const listData = useMemo(() => flattenPaginated(data), [data]);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    listData.forEach(({id}) => {
      dispatch(setCanvas(id));
    });
  }, [dispatch, listData]);

  const {visiblePosts, handleViewPosts, viewabilityConfig} =
    usePostViewability();

  const handleRenderItem: ListRenderItem<User> = useCallback(
    ({item}) => {
      return (
        <ContactCard
          queryKey={FEED_QUERY_KEY}
          id={item.id}
          visible={visiblePosts.includes(item.id)}
        />
      );
    },
    [visiblePosts],
  );

  const fetchMore = useCallback(() => {
    if (!isFetchingNextPage) {
      fetchNextPage({pageParam: page + 1}).then(() => {
        setPage(page + 1);
      });
    }
  }, [fetchNextPage, isFetchingNextPage, page]);

  const refresh = useCallback(() => {
    if (!isRefetching) {
      setPage(1);
      queryClient.setQueryData([FEED_QUERY_KEY], () => defaultData);
      refetch();
    }
  }, [refetch, isRefetching, queryClient]);

  const handleShuffle = useCallback(() => {
    const index = randomInt(1, listData.length - 1);
    listRef.current?.scrollToIndex({
      animated: true,
      index,
    });
  }, [listData]);

  const fallbackData = useMemo(
    () =>
      Array(10)
        .fill(0)
        .map((_, i) => i),
    [],
  );
  const handleRenderFallback: ListRenderItem<number> = useCallback(
    ({index}) => <ContactCardFallback key={index} />,
    [],
  );

  return !listData.length ? (
    <Container>
      <StyledListFallback
        data={fallbackData}
        renderItem={handleRenderFallback}
      />
      <FloatingBtn>
        <ShuffleImage source={require('@/assets/shuffle.png')} />
      </FloatingBtn>
    </Container>
  ) : (
    <Container>
      <StyledList
        ref={listRef}
        data={listData}
        keyExtractor={item => `item-${item.id}`}
        renderItem={handleRenderItem}
        onEndReached={fetchMore}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{paddingBottom: 80}}
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

    return () => {
      navigation.setOptions({
        headerShown: true,
      });
    };
  }, [navigation]);

  return (
    <CenterContainer>
      <H1 theme={'light'}>:(</H1>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <H2 theme={'light'} style={{marginTop: 20}}>
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
