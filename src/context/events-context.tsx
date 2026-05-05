import React, { createContext, useContext, useState } from 'react';

import { Event } from '@/types/event';

interface EventsContextValue {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
}

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

  function addEvent(event: Omit<Event, 'id'>) {
    setEvents(prev => [...prev, { ...event, id: Date.now().toString() }]);
  }

  function updateEvent(updated: Event) {
    setEvents(prev => prev.map(e => (e.id === updated.id ? updated : e)));
  }

  function deleteEvent(id: string) {
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used within EventsProvider');
  return ctx;
}
