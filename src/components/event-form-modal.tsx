import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Event } from '@/types/event';

type FormFields = { id?: string; title: string; description: string; date: string; time: string };

interface Props {
  visible: boolean;
  initialEvent: Event | null;
  onSave: (event: FormFields) => void;
  onClose: () => void;
}

const empty: FormFields = { title: '', description: '', date: '', time: '' };

export function EventFormModal({ visible, initialEvent, onSave, onClose }: Props) {
  const theme = useTheme();
  const [fields, setFields] = useState<FormFields>(empty);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (visible) {
      setFields(
        initialEvent
          ? { id: initialEvent.id, title: initialEvent.title, description: initialEvent.description, date: initialEvent.date, time: initialEvent.time }
          : empty
      );
      setTitleError(false);
    }
  }, [visible, initialEvent]);

  function set(key: keyof FormFields) {
    return (value: string) => setFields(prev => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!fields.title.trim()) {
      setTitleError(true);
      return;
    }
    onSave(fields);
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.backgroundSelected },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ThemedView style={styles.header}>
            <Pressable onPress={onClose} style={styles.headerButton}>
              <ThemedText type="default" themeColor="textSecondary">Cancel</ThemedText>
            </Pressable>
            <ThemedText type="smallBold">
              {initialEvent ? 'Edit Event' : 'New Event'}
            </ThemedText>
            <Pressable onPress={handleSave} style={styles.headerButton}>
              <ThemedText type="smallBold" themeColor="textSecondary">Save</ThemedText>
            </Pressable>
          </ThemedView>

          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              style={styles.flex}
              contentContainerStyle={styles.form}
              keyboardShouldPersistTaps="handled">

              <ThemedText type="small" themeColor="textSecondary" style={styles.label}>Title *</ThemedText>
              <TextInput
                style={[inputStyle, titleError && { borderColor: '#e05252' }]}
                placeholder="Event title"
                placeholderTextColor={theme.textSecondary}
                value={fields.title}
                onChangeText={v => { set('title')(v); setTitleError(false); }}
              />
              {titleError && (
                <ThemedText type="small" style={styles.error}>Title is required</ThemedText>
              )}

              <ThemedText type="small" themeColor="textSecondary" style={styles.label}>Date</ThemedText>
              <TextInput
                style={inputStyle}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textSecondary}
                value={fields.date}
                onChangeText={set('date')}
                keyboardType="numbers-and-punctuation"
              />

              <ThemedText type="small" themeColor="textSecondary" style={styles.label}>Time</ThemedText>
              <TextInput
                style={inputStyle}
                placeholder="HH:MM"
                placeholderTextColor={theme.textSecondary}
                value={fields.time}
                onChangeText={set('time')}
                keyboardType="numbers-and-punctuation"
              />

              <ThemedText type="small" themeColor="textSecondary" style={styles.label}>Description</ThemedText>
              <TextInput
                style={[inputStyle, styles.textArea]}
                placeholder="Event description"
                placeholderTextColor={theme.textSecondary}
                value={fields.description}
                onChangeText={set('description')}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
  headerButton: {
    minWidth: 60,
  },
  form: {
    padding: Spacing.three,
    gap: Spacing.one,
    paddingBottom: Spacing.six,
  },
  label: {
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.two,
  },
  error: {
    color: '#e05252',
    marginTop: Spacing.one,
  },
});
