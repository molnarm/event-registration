import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventFormModal } from '@/components/event-form-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useEvents } from '@/context/events-context';
import { useTheme } from '@/hooks/use-theme';
import { Event } from '@/types/event';

type ModalState = { visible: false } | { visible: true; event: Event | null };

export default function EventsScreen() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const theme = useTheme();
  const [modal, setModal] = useState<ModalState>({ visible: false });

  function openAdd() {
    setModal({ visible: true, event: null });
  }

  function openEdit(event: Event) {
    setModal({ visible: true, event });
  }

  function closeModal() {
    setModal({ visible: false });
  }

  function handleSave(data: { id?: string; title: string; description: string; date: string; time: string }) {
    if (data.id) {
      updateEvent(data as Event);
    } else {
      addEvent(data);
    }
    closeModal();
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.titleRow}>
          <ThemedText type="subtitle">Events</ThemedText>
          <Pressable
            onPress={openAdd}
            style={[styles.addButton, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="default">+</ThemedText>
          </Pressable>
        </ThemedView>

        {events.length === 0 ? (
          <ThemedView style={styles.empty}>
            <ThemedText type="default" themeColor="textSecondary">No events yet. Tap + to add one.</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={events}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <ThemedView type="backgroundElement" style={styles.card}>
                <ThemedView type="backgroundElement" style={styles.cardContent}>
                  <ThemedText type="default" style={styles.cardTitle}>{item.title}</ThemedText>
                  {(item.date || item.time) && (
                    <ThemedText type="small" themeColor="textSecondary">
                      {[item.date, item.time].filter(Boolean).join(' · ')}
                    </ThemedText>
                  )}
                  {item.description ? (
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                      {item.description}
                    </ThemedText>
                  ) : null}
                </ThemedView>
                <ThemedView type="backgroundElement" style={styles.cardActions}>
                  <Pressable
                    onPress={() => openEdit(item)}
                    style={[styles.actionButton, { backgroundColor: theme.backgroundSelected }]}>
                    <ThemedText type="small">Edit</ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={() => deleteEvent(item.id)}
                    style={[styles.actionButton, styles.deleteButton]}>
                    <ThemedText type="small" style={styles.deleteText}>Delete</ThemedText>
                  </Pressable>
                </ThemedView>
              </ThemedView>
            )}
          />
        )}
      </SafeAreaView>

      <EventFormModal
        visible={modal.visible}
        initialEvent={modal.visible ? modal.event : null}
        onSave={handleSave}
        onClose={closeModal}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: Spacing.three,
    gap: Spacing.two,
    paddingBottom: BottomTabInset + Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  card: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardContent: {
    gap: Spacing.one,
  },
  cardTitle: {
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  deleteButton: {
    backgroundColor: '#e0525220',
  },
  deleteText: {
    color: '#e05252',
  },
});
