import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';

export default function App() {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<string>('Home');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LIFE-LINK Donor</Text>
        <Text style={styles.headerSubtitle}>Emergency Blood Response</Text>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        {['Home', 'Nearby', 'Availability', 'History'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setCurrentScreen(tab)}
            style={[styles.tabButton, currentScreen === tab && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, currentScreen === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>⚠️ Medical Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            Potentially compatible based on registered blood group. Final eligibility must be confirmed by medical professionals.
          </Text>
        </View>

        {currentScreen === 'Home' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome, Rahul Sharma</Text>
            <Text style={styles.infoText}>Blood Group: O+</Text>
            <Text style={styles.infoText}>Status: Verified Donor</Text>
            
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Donation Availability:</Text>
              <Switch value={isAvailable} onValueChange={setIsAvailable} trackColor={{ true: '#dc2626' }} />
            </View>
          </View>
        )}

        {currentScreen === 'Nearby' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nearby Emergency Requests</Text>
            <View style={styles.requestItem}>
              <Text style={styles.reqTitle}>REQ-1023 • O+ Needed (3 Units)</Text>
              <Text style={styles.reqSub}>Apex Hospital • Approx 3.5 km away</Text>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.buttonText}>Accept Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentScreen === 'Availability' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Availability Controls</Text>
            <Text style={styles.infoText}>Current State: {isAvailable ? 'AVAILABLE (ON)' : 'UNAVAILABLE (OFF)'}</Text>
            <Text style={styles.subInfoText}>Your exact coordinates are kept strictly private.</Text>
          </View>
        )}

        {currentScreen === 'History' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Donation Records</Text>
            <Text style={styles.infoText}>• 1 Unit O+ donated on 2026-08-15 (Apex Hospital)</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#dc2626', padding: 16 },
  headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#fef2f2', fontSize: 12 },
  tabBar: { flexDirection: 'row', backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTabButton: { borderBottomWidth: 2, borderBottomColor: '#dc2626' },
  tabText: { fontSize: 12, color: '#4b5563', fontWeight: '500' },
  activeTabText: { color: '#dc2626', fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  disclaimerBox: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', padding: 12, borderRadius: 6, marginBottom: 16 },
  disclaimerTitle: { fontSize: 12, fontWeight: 'bold', color: '#92400e' },
  disclaimerText: { fontSize: 11, color: '#b45309', marginTop: 2 },
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#374151', marginBottom: 4 },
  subInfoText: { fontSize: 11, color: '#6b7280', marginTop: 4 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  toggleLabel: { fontSize: 13, fontWeight: '600', color: '#111827' },
  requestItem: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  reqTitle: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },
  reqSub: { fontSize: 12, color: '#4b5563', marginVertical: 4 },
  acceptButton: { backgroundColor: '#dc2626', paddingVertical: 8, borderRadius: 4, alignItems: 'center', marginTop: 6 },
  buttonText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
});
