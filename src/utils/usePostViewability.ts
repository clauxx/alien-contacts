import { useCallback, useState, useMemo } from 'react';
import { ViewToken } from 'react-native';

export const usePostViewability = () => {
  const [visible, setVisible] = useState<number[]>([]);

  const handleViewPosts = useCallback(
    <T extends { id: number }>(info: {
      viewableItems: Array<ViewToken>;
      changed: Array<ViewToken>;
    }) => {
      const visiblePosts: T[] = info.viewableItems.map((v) => v.item);
      const visibleIds = visiblePosts.map((p) => p.id);
      setVisible(visibleIds);
    },
    []
  );

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 25,
    }),
    []
  );

  return {
    visiblePosts: visible,
    handleViewPosts,
    viewabilityConfig,
  };
};
