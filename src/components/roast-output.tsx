import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface RoastOutputProps {
  points: string[];
  error?: string | null;
  onRetry?: () => void;
  modelUsed?: string;
}

export function RoastOutput({
  points,
  error,
  onRetry,
  modelUsed = 'gemini-flash-latest',
}: RoastOutputProps) {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [cardWidth, setCardWidth] = useState(
    Dimensions.get('window').width - Spacing.four * 2
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const handleCopy = async (index: number) => {
    const textToCopy = points[index];
    if (!textToCopy) return;

    await Clipboard.setStringAsync(textToCopy);
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Fallback
      }
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (cardWidth || 1));
    if (index >= 0 && index < points.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const goToCard = (index: number) => {
    if (index >= 0 && index < points.length) {
      scrollViewRef.current?.scrollTo({ x: index * cardWidth, animated: true });
      setActiveIndex(index);
    }
  };

  if (error) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: theme.errorSurface, borderColor: theme.error },
        ]}>
        <ThemedText type="subtitle" style={{ color: theme.error }}>
          Failed to load roast
        </ThemedText>
        <ThemedText type="default" style={{ color: theme.text }}>
          {error}
        </ThemedText>
        {onRetry && (
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: theme.error },
              pressed && styles.pressed,
            ]}>
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </Pressable>
        )}
      </View>
    );
  }

  if (points.length === 0) {
    return null;
  }

  return (
    <View
      style={styles.wrapper}
      onLayout={(e) => {
        const width = e.nativeEvent.layout.width;
        if (width > 0) setCardWidth(width);
      }}>
      {/* Horizontal Swipeable Cards */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={cardWidth}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}>
        {points.map((point, index) => {
          const isCopied = copiedIndex === index;

          return (
            <View
              key={index}
              style={[
                styles.card,
                {
                  width: cardWidth,
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                },
              ]}>
              {/* Top Row: Label 1., 2., 3. and Index Indicator */}
              <View style={styles.cardHeader}>
                <ThemedText type="subtitle" style={styles.cardIndexLabel}>
                  {index + 1}.
                </ThemedText>
                <ThemedText type="caption" themeColor="textMuted">
                  {index + 1} of {points.length}
                </ThemedText>
              </View>

              {/* Roast Body */}
              <View style={styles.cardBody}>
                <ThemedText type="default" style={[styles.roastText, { color: theme.text }]}>
                  {point}
                </ThemedText>
              </View>

              {/* Bottom Row: Model Name & Copy Button */}
              <View
                style={[
                  styles.cardFooter,
                  { borderTopColor: theme.cardBorder },
                ]}>
                <ThemedText type="caption" themeColor="textMuted" numberOfLines={1}>
                  {modelUsed}
                </ThemedText>

                <Pressable
                  onPress={() => handleCopy(index)}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.copyBtn,
                    { backgroundColor: theme.backgroundElement },
                    pressed && styles.pressed,
                  ]}>
                  <ThemedText
                    type="smallBold"
                    themeColor={isCopied ? 'success' : 'textSecondary'}>
                    {isCopied ? 'Copied' : 'Copy'}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Swipe Pagination Dots */}
      <View style={styles.dotsRow}>
        {points.map((_, i) => (
          <Pressable key={i} onPress={() => goToCard(i)} hitSlop={6}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: i === activeIndex ? theme.primary : theme.cardBorder,
                  width: i === activeIndex ? 18 : 6,
                },
              ]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: Spacing.two,
  },
  scrollContent: {
    alignItems: 'stretch',
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    padding: Spacing.four,
    justifyContent: 'space-between',
    minHeight: 220,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  cardIndexLabel: {
    fontSize: 22,
    fontWeight: '800',
  },
  cardBody: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.one,
  },
  roastText: {
    fontSize: 16,
    lineHeight: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.two,
  },
  copyBtn: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: BorderRadius.sm,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.half,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  errorContainer: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.one,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
