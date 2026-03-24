import Header from '@/src/components/header';
import { useCancelAppointment, useMyAppointments } from '@/src/features/cart/hooks/useCart';
import type { Appointment, CartItemCategory } from '@/src/features/cart/types/index';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CATEGORIES: { id: CartItemCategory; label: string; emoji: string }[] = [
  { id: 'consultation', label: 'Consultations', emoji: '🔮' },
  { id: 'course', label: 'Courses', emoji: '📚' },
  { id: 'product', label: 'Products', emoji: '🛍️' },
];

function formatScheduledAt(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time };
}

function AppointmentCard({
  item,
  selected,
  onToggleSelect,
  onCancel,
  onEditSlot,
}: {
  item: Appointment;
  selected: boolean;
  onToggleSelect: () => void;
  onCancel: () => void;
  onEditSlot: () => void;
}) {
  const { date, time } = formatScheduledAt(item.scheduledAt);

  return (
    <View style={[styles.itemCard, selected && styles.itemCardSelected]}>
      <View style={[styles.itemStrip, { backgroundColor: selected ? '#9d0399' : '#DDD' }]} />

      <View style={styles.itemInner}>
        {/* Top row */}
        <View style={styles.itemTopRow}>
          {/* Checkbox */}
          <TouchableOpacity style={styles.checkbox} onPress={onToggleSelect}>
            <View style={[styles.checkboxInner, selected && styles.checkboxChecked]}>
              {selected && <Text style={styles.checkboxTick}>✓</Text>}
            </View>
          </TouchableOpacity>

          <View style={styles.itemEmojiWrap}>
            <Text style={styles.itemEmoji}>🔮</Text>
          </View>

          <View style={styles.itemInfo}>
            <Text style={styles.itemServiceName}>{item.service.title}</Text>
            <Text style={styles.itemAstroName}>by {item.astrologerName}</Text>
            <Text style={styles.itemDesc} numberOfLines={1}>
              {item.service.shortDescription}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.itemActions}>
            <TouchableOpacity style={styles.editBtn} onPress={onEditSlot}>
              <Text style={styles.editBtnText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() =>
                Alert.alert('Remove item?', 'This will cancel your booking.', [
                  { text: 'Keep', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: onCancel },
                ])
              }
            >
              <Text style={styles.removeBtnText}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Slot chips */}
        <View style={styles.slotRow}>
          <View style={styles.slotChip}>
            <Text style={styles.slotChipText}>📅 {date}</Text>
          </View>
          <View style={styles.slotChip}>
            <Text style={styles.slotChipText}>🕐 {time}</Text>
          </View>
          <View style={styles.slotChip}>
            <Text style={styles.slotChipText}>⏱ {item.service.durationMinutes} min</Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.itemPriceRow}>
          <Text style={styles.itemPrice}>₹{item.service.price}</Text>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CartItemCategory>('consultation');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { pending, isLoading, refetch } = useMyAppointments();
  const { mutateAsync: cancelAppointment } = useCancelAppointment();

  const filteredItems = pending;
  const activeLabel = CATEGORIES.find((c) => c.id === activeCategory)!;

  // Selection logic
  const allSelected = filteredItems.length > 0 && selectedIds.size === filteredItems.length;
  const selectedItems = filteredItems.filter((i) => selectedIds.has(i.id));
  const totalPrice = selectedItems.reduce((sum, i) => sum + Number(i.service.price), 0);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch {
      Alert.alert('Error', 'Could not remove item. Please try again.');
    }
  };

  return (
    <View style={styles.root}>
      <Header />

      {/* ── Category Dropdown ── */}
      <View style={styles.dropdownWrap}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownOpen((p) => !p)}
          activeOpacity={0.85}
        >
          <Text style={styles.dropdownText}>
            {activeLabel.emoji} {activeLabel.label}
          </Text>
          <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.dropdownItem,
                  activeCategory === cat.id && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setActiveCategory(cat.id);
                  setDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    activeCategory === cat.id && styles.dropdownItemTextActive,
                  ]}
                >
                  {cat.emoji} {cat.label}
                </Text>
                {activeCategory === cat.id && <Text style={{ color: '#9d0399' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* ── Select All bar ── */}
      {filteredItems.length > 0 && (
        <TouchableOpacity style={styles.selectAllBar} onPress={toggleSelectAll}>
          <View style={[styles.checkboxInner, allSelected && styles.checkboxChecked]}>
            {allSelected && <Text style={styles.checkboxTick}>✓</Text>}
          </View>
          <Text style={styles.selectAllText}>{allSelected ? 'Deselect All' : 'Select All'}</Text>
          {selectedIds.size > 0 && (
            <Text style={styles.selectedCount}>{selectedIds.size} selected</Text>
          )}
        </TouchableOpacity>
      )}

      {/* ── Cart Items ── */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#9d0399" />
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        >
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>{activeLabel.emoji}</Text>
              <Text style={styles.emptyTitle}>No {activeLabel.label} in cart</Text>
              <Text style={styles.emptySub}>Add a service to get started</Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => router.push('/(app)/astrologers')}
              >
                <Text style={styles.browseBtnText}>Browse Astrologers</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredItems.map((item) => (
              <AppointmentCard
                key={item.id}
                item={item}
                selected={selectedIds.has(item.id)}
                onToggleSelect={() => toggleSelect(item.id)}
                onCancel={() => handleCancel(item.id)}
                onEditSlot={() =>
                  router.push({
                    pathname: '/(app)/book-slot',
                    params: {
                      astroId: item.astrologerId,
                      serviceId: item.service.id,
                      existingAppointmentId: item.id,
                    },
                  })
                }
              />
            ))
          )}
        </ScrollView>
      )}

      {/* ── Bottom Bar ── */}
      {filteredItems.length > 0 && (
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.subtotalLabel}>
              {selectedIds.size > 0
                ? `${selectedIds.size} item${selectedIds.size > 1 ? 's' : ''} selected`
                : 'Select items'}
            </Text>
            <Text style={styles.subtotalPrice}>
              {selectedIds.size > 0 ? `₹${totalPrice}` : '—'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.payBtn, selectedIds.size === 0 && styles.payBtnDisabled]}
            disabled={selectedIds.size === 0}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: '/(app)/checkout',
                params: { appointmentIds: selectedItems.map((a) => a.id).join(',') },
              })
            }
          >
            <Text style={styles.payBtnText}>
              {selectedIds.size === 0 ? 'Select to Pay' : 'Go to Checkout →'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },
  dropdownWrap: { marginHorizontal: 16, marginTop: 12, zIndex: 10 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#9d0399',
  },
  dropdownText: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  dropdownArrow: { fontSize: 12, color: '#9d0399' },
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    elevation: 10,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  dropdownItemActive: { backgroundColor: '#F9F0FF' },
  dropdownItemText: { fontSize: 14, color: '#555', fontWeight: '500' },
  dropdownItemTextActive: { color: '#9d0399', fontWeight: '700' },

  // Select All
  selectAllBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FF',
  },
  selectAllText: { fontSize: 13, fontWeight: '600', color: '#1A1A2E', flex: 1 },
  selectedCount: { fontSize: 12, color: '#9d0399', fontWeight: '700' },

  // Checkbox
  checkbox: { padding: 2 },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  checkboxChecked: { backgroundColor: '#9d0399', borderColor: '#9d0399' },
  checkboxTick: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  list: { flex: 1, marginTop: 4 },

  // Card
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 1,
  },
  itemCardSelected: { borderColor: '#9d0399', backgroundColor: '#FDF5FF' },
  itemStrip: { width: 5 },
  itemInner: { flex: 1, padding: 14, gap: 10 },
  itemTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  itemEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmoji: { fontSize: 22 },
  itemInfo: { flex: 1 },
  itemServiceName: { fontSize: 14, fontWeight: '800', color: '#1A1A2E' },
  itemAstroName: { fontSize: 12, color: '#9d0399', fontWeight: '600', marginTop: 1 },
  itemDesc: { fontSize: 11, color: '#AAA', marginTop: 2 },
  itemActions: { flexDirection: 'row', gap: 4 },
  editBtn: { padding: 4 },
  editBtnText: { fontSize: 15 },
  removeBtn: { padding: 4 },
  removeBtnText: { fontSize: 15 },
  slotRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  slotChip: {
    backgroundColor: '#F5F0FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  slotChipText: { fontSize: 11, color: '#6B21A8', fontWeight: '600' },
  itemPriceRow: { alignItems: 'flex-end' },
  itemPrice: { fontSize: 18, fontWeight: '800', color: '#9d0399' },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  emptySub: { fontSize: 13, color: '#AAA' },
  browseBtn: {
    marginTop: 16,
    backgroundColor: '#9d0399',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  browseBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EDE9FF',
    elevation: 10,
  },
  subtotalLabel: { fontSize: 12, color: '#AAA' },
  subtotalPrice: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  payBtn: {
    backgroundColor: '#9d0399',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  payBtnDisabled: { backgroundColor: '#CCC' },
  payBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
