import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<any>();
  const platformFee = 25;
  const discount = 50;
  const total = Number(params.price) + platformFee - discount;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Booking Item */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Consultation Booking</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardKey}>Service</Text>
            <Text style={styles.cardVal}>{params.serviceName}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardKey}>Type</Text>
            <Text style={styles.cardVal}>{params.bookingType === 'instant' ? '⚡ Instant' : `📅 ${params.selectedDate} ${params.selectedTime}`}</Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Price Details</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardKey}>Service Fee</Text>
            <Text style={styles.cardVal}>₹{params.price}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardKey}>Platform Fee</Text>
            <Text style={styles.cardVal}>₹{platformFee}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardKey}>Discount</Text>
            <Text style={[styles.cardVal, { color: '#22C55E' }]}>- ₹{discount}</Text>
          </View>
          <View style={[styles.cardRow, styles.totalRow]}>
            <Text style={styles.totalKey}>Total</Text>
            <Text style={styles.totalVal}>₹{total}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Pay</Text>
          <Text style={styles.bottomPrice}>₹{total}</Text>
        </View>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => router.push({ pathname: '/(app)/payment-success', params: { total, serviceName: params.serviceName } })}
        >
          <Text style={styles.payBtnText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EDE9FF',
  },
  backIcon: { fontSize: 22, color: '#9d0399' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  content: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#EDE9FF', elevation: 1,
  },
  cardLabel: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 14 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardKey: { fontSize: 13, color: '#888' },
  cardVal: { fontSize: 13, color: '#1A1A2E', fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#EDE9FF', paddingTop: 12, marginTop: 4, marginBottom: 0 },
  totalKey: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  totalVal: { fontSize: 18, fontWeight: '800', color: '#9d0399' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: '#EDE9FF', elevation: 8,
  },
  bottomLabel: { fontSize: 12, color: '#888' },
  bottomPrice: { fontSize: 22, fontWeight: '800', color: '#9d0399' },
  payBtn: { backgroundColor: '#9d0399', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  payBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
