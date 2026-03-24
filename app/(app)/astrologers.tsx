import Header from '@/src/components/header';
import { useAstrologers } from '@/src/features/astrolgers/hooks/useAstrologers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const FILTERS = [
  { id: 'all', label: '✨ All' },
  { id: 'Kundli', label: '🔮 Kundli' },
  { id: 'Tarot', label: '🃏 Tarot' },
  { id: 'Numerology', label: '🔢 Numerology' },
  { id: 'Palmistry', label: '✋ Palmistry' },
  { id: 'Vastu', label: '🏠 Vastu' },
  { id: 'Astrology', label: '⭐ Astrology' },
];

const COLORS = ['#6B21A8', '#9D174D', '#1E40AF', '#065F46', '#92400E', '#1E3A5F'];

const BANNER_GRADIENTS = [
  ['#2D0A4E', '#6B21A8'],
  ['#4A0E2B', '#9D174D'],
  ['#0A1628', '#1E40AF'],
  ['#022B1E', '#065F46'],
  ['#2B1500', '#92400E'],
  ['#050F1F', '#1E3A5F'],
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: 11, color: i <= Math.floor(rating) ? '#F59E0B' : '#DDD' }}>
          ★
        </Text>
      ))}
      <Text style={{ fontSize: 11, color: '#666', marginLeft: 3 }}>{rating}</Text>
    </View>
  );
}

function AstrologerCard({
  item,
  index,
  onNamePress,
  onBookPress,
}: {
  item: any;
  index: number;
  onNamePress: () => void;
  onBookPress: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = COLORS[index % COLORS.length];
  const bannerColors = BANNER_GRADIENTS[index % BANNER_GRADIENTS.length];

  const handleCardPress = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <View style={styles.cardWrapper}>
      {/* Main Card Row */}
      <TouchableOpacity style={styles.card} onPress={handleCardPress} activeOpacity={0.95}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarEmoji}>{item.meta?.emoji ?? '🔮'}</Text>
          <View
            style={[
              styles.onlineDot,
              { backgroundColor: item.meta?.online ? '#22C55E' : '#9CA3AF' },
            ]}
          />
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.cardTopRow}>
            {/* Naam click → profile */}
            <TouchableOpacity onPress={onNamePress} activeOpacity={0.7}>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Follow +</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardSpeciality}>{item.meta?.speciality}</Text>
          <Text style={styles.cardMeta}>{item.meta?.languages}</Text>
          <Text style={styles.cardMeta}>Exp: {item.meta?.exp}</Text>

          <View style={styles.cardBottomRow}>
            <View>
              <StarRating rating={item.meta?.rating ?? 0} />
              <Text style={styles.reviewCount}>{item.meta?.reviews} reviews</Text>
            </View>

            {/* Book Now → profile */}
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => onBookPress()}
              activeOpacity={0.85}
            >
              <Text style={styles.bookBtnPrice}>₹{item.meta?.price ?? '—'}</Text>
              <Text style={styles.bookBtnText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Accordion Dropdown */}
      {expanded && (
        <View style={styles.accordion}>
          {/* About text */}
          <Text style={styles.accordionAbout} numberOfLines={3}>
            {item.meta?.about ??
              `${item.name} is an experienced ${item.meta?.speciality ?? 'astrologer'} with ${item.meta?.exp ?? 'several years'} of experience. Specializes in providing guidance on life, relationships, and career.`}
          </Text>
          <TouchableOpacity onPress={onNamePress}>
            <Text style={styles.seeMore}>See more...</Text>
          </TouchableOpacity>

          {/* Banner */}
          <View style={[styles.bannerCard, { backgroundColor: bannerColors[0] }]}>
            {/* Decorative circles */}
            <View style={[styles.bannerCircle1, { backgroundColor: bannerColors[1] }]} />
            <View style={[styles.bannerCircle2, { backgroundColor: bannerColors[1] + '80' }]} />

            {/* Banner content */}
            <View style={styles.bannerContent}>
              <View style={styles.bannerLeft}>
                <Text style={styles.bannerEmoji}>{item.meta?.emoji ?? '🔮'}</Text>
                <Text style={styles.bannerName}>{item.name}</Text>
                <Text style={styles.bannerSpeciality}>{item.meta?.speciality}</Text>
              </View>
              <View style={styles.bannerRight}>
                <Text style={styles.bannerTag}>AstroBook</Text>
                <View
                  style={[
                    styles.bannerOnline,
                    { backgroundColor: item.meta?.online ? '#22C55E' : '#9CA3AF' },
                  ]}
                >
                  <Text style={styles.bannerOnlineText}>
                    {item.meta?.online ? '● Online' : '● Offline'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.bannerBookBtn} onPress={onBookPress}>
                  <Text style={styles.bannerBookBtnText}>Book ₹{item.meta?.price}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default function AstrologersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { astrologers, isLoading, error } = useAstrologers();

  const filtered = astrologers.filter((a) => {
    const matchFilter = activeFilter === 'all' || a.interests?.includes(activeFilter);
    const matchSearch =
      search === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.meta?.speciality.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (isLoading) {
    return (
      <View style={styles.root}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#9d0399" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.root}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#9d0399' }}>Failed to load astrologers</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Header />

      <View style={styles.searchBar}>
        <Text style={styles.searchBarIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search astrologers..."
          placeholderTextColor="#AAA"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: '#9d0399', fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.chip, activeFilter === f.id && styles.chipActive]}
            onPress={() => setActiveFilter(f.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, activeFilter === f.id && styles.chipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.countText}>{filtered.length} Astrologers found</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AstrologerCard
            item={item}
            index={index}
            onNamePress={() =>
              router.push({ pathname: '/(app)/astrologer-profile', params: { id: item.id } })
            }
            onBookPress={() =>
              router.push({
                pathname: '/(app)/astrologer-profile',
                params: { id: item.id, tab: 'services' },
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#EDE9FF',
    gap: 10,
  },
  searchBarIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A2E' },

  // Filters
  filtersRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#EDE9FF',
  },
  chipActive: {
    backgroundColor: '#9d0399',
    borderColor: '#9d0399',
  },
  chipText: { fontSize: 13, color: '#666', fontWeight: '500' },
  chipTextActive: { color: '#FFF', fontWeight: '700' },

  // Count
  countText: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  // List
  listContent: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },

  // Card wrapper (card + accordion together)
  cardWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EDE9FF',
    elevation: 2,
    backgroundColor: '#FFF',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 14,
    gap: 14,
  },

  // Avatar
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarEmoji: { fontSize: 32 },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  // Card Info
  cardInfo: { flex: 1 },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    flex: 1,
    textDecorationLine: 'underline',
  },
  followBtn: {
    borderWidth: 1,
    borderColor: '#9d0399',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  followBtnText: { color: '#9d0399', fontSize: 11, fontWeight: '600' },
  cardSpeciality: { fontSize: 13, color: '#9d0399', fontWeight: '600', marginBottom: 2 },
  cardMeta: { fontSize: 12, color: '#888', marginBottom: 1 },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  reviewCount: { fontSize: 11, color: '#AAA', marginTop: 2 },
  bookBtn: {
    backgroundColor: '#9d0399',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  bookBtnPrice: { color: '#FFD700', fontSize: 11, fontWeight: '700' },
  bookBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

  // Accordion
  accordion: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#EDE9FF',
  },
  accordionAbout: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 4,
  },
  seeMore: {
    fontSize: 13,
    color: '#9d0399',
    fontWeight: '600',
    marginBottom: 12,
  },

  // Banner inside accordion
  bannerCard: {
    borderRadius: 14,
    height: 110,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  bannerCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -30,
    right: -20,
    opacity: 0.5,
  },
  bannerCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    bottom: -20,
    left: 30,
    opacity: 0.3,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  bannerLeft: { gap: 2 },
  bannerEmoji: { fontSize: 28, marginBottom: 2 },
  bannerName: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  bannerSpeciality: { fontSize: 11, color: '#FFFFFFBB' },
  bannerRight: { alignItems: 'flex-end', gap: 6 },
  bannerTag: {
    fontSize: 10,
    color: '#FFFFFFAA',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bannerOnline: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bannerOnlineText: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  bannerBookBtn: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  bannerBookBtnText: { color: '#9d0399', fontSize: 12, fontWeight: '800' },
});
