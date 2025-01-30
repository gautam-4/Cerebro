"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

function Note() {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const saveTimeoutRef = useRef(null);
  const pendingSaveRef = useRef(null);

  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      if (pendingSaveRef.current) {
        e.preventDefault();
        e.returnValue = '';
        await saveNote(pendingSaveRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

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
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('content')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading note:', error);
        setError('Failed to load note');
      } else if (data) {
        setNote(data.content);
        setError(null);
      }
    } catch (err) {
      console.error('Error in fetchNoteFromSupabase:', err);
      setError('An unexpected error occurred');
    }
  };

  const saveNote = useCallback(async (content) => {
    if (!user) return;
    
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    setSaving(true);
    setError(null);
    pendingSaveRef.current = null;

    try {
      const { error } = await supabase
        .from('notes')
        .upsert(
          { 
            user_id: user.id, 
            content: trimmedContent 
          }, 
          { 
            onConflict: 'user_id',
            returning: true 
          }
        );

      if (error) {
        console.error('Error saving note:', error);
        setError('Failed to save note');
        pendingSaveRef.current = content;
      }
    } catch (err) {
      console.error('Error in saveNote:', err);
      setError('An unexpected error occurred');
      pendingSaveRef.current = content;
    } finally {
      setSaving(false);
    }
  }, [user]);

  const debouncedSave = useCallback((content) => {
    pendingSaveRef.current = content;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveNote(content);
    }, 500);
  }, [saveNote]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (pendingSaveRef.current) {
        saveNote(pendingSaveRef.current);
      }
    };
  }, [saveNote]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setNote(newContent);
    debouncedSave(newContent);
  };

  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel(`notes:${user.id}`)
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new.content !== note) {
            setNote(payload.new.content);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, note]);

  return (
    <div className="flex-1">
      <textarea
        name="note"
        id="note"
        placeholder="Note"
        className="bg-note_color p-3 font-cursive text-lg rounded-xl border-0 resize-none text-gray-800 w-full h-52 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={note}
        onChange={handleChange}
        // disabled={!user}
      ></textarea>
      <div className="mt-2 text-sm">
        {saving && <p className="text-gray-500">Saving...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!user && <p className="text-gray-500">Please sign in to create notes</p>}
      </div>
    </div>
  );
}

export default Note;