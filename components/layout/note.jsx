"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

function Note() {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchNoteFromSupabase(session.user.id);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchNoteFromSupabase(session.user.id);
      } else {
        setNote('');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchNoteFromSupabase = async (userId) => {
    const { data, error } = await supabase
      .from('notes')
      .select('content')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error loading note:', error);
    } else if (data) {
      setNote(data.content || ''); // Set default empty note if none is found
    }
  };

  const saveNote = useCallback(async (content) => {
    if (!user || !content.trim()) return; // Prevent saving empty or whitespace-only notes

    setSaving(true);
    const { error } = await supabase
      .from('notes')
      .upsert({ user_id: user.id, content: content.trim() }, { onConflict: 'user_id' });

    setSaving(false);

    if (error) {
      console.error('Error saving note:', error);
    } else {
      console.log('Note saved successfully');
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveNote(note);
    }, 1000); // Save 1 second after the user stops typing

    return () => clearTimeout(timer);
  }, [note, saveNote]);

  const handleChange = (e) => {
    setNote(e.target.value);
  };

  return (
    <div className="flex-1">
      <textarea
        name="note"
        id="note"
        placeholder="Note"
        className="bg-note_color p-3 font-cursive text-lg rounded-xl border-0 resize-none text-gray-800 w-full h-52"
        value={note}
        onChange={handleChange}
      ></textarea>
      {saving && <p className="text-sm text-gray-500 mt-2">Saving...</p>}
    </div>
  );
}

export default Note;