import { supabase, isMockSupabase } from './supabase';

export interface TankSnapshot {
  id: string;
  date: string;
  fishes: string[]; // types of fishes
  focusHours: number;
  loopsCompleted: number;
  theme: string;
  pinned: boolean;
}

export const saveCurrentTankState = async (fishes: string[], theme: string) => {
  const today = new Date().toDateString();
  const state = {
    date: today,
    fishes,
    theme,
    focusHours: parseInt(localStorage.getItem('toca_focus_today') || '0'),
    loopsCompleted: parseInt(localStorage.getItem('toca_total_loops') || '0'),
  };
  localStorage.setItem('toca_current_tank', JSON.stringify(state));

  if (!isMockSupabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('tank_states').upsert({ user_id: user.id, date: today, state });
    }
  }
};

export const archiveYesterdayTank = async () => {
  const today = new Date().toDateString();
  const lastDay = localStorage.getItem('toca_current_day');
  
  if (lastDay && lastDay !== today) {
    // New day! Archive the previous day
    const prevTankStr = localStorage.getItem('toca_current_tank');
    if (prevTankStr) {
      const prevTank = JSON.parse(prevTankStr);
      
      // Save to archive
      const archivesStr = localStorage.getItem('toca_archives') || '[]';
      const archives: TankSnapshot[] = JSON.parse(archivesStr);
      const newArchive: TankSnapshot = {
        id: crypto.randomUUID(),
        date: lastDay,
        fishes: prevTank.fishes || [],
        focusHours: prevTank.focusHours || 0,
        loopsCompleted: prevTank.loopsCompleted || 0,
        theme: prevTank.theme || 'Ocean',
        pinned: false,
      };
      
      archives.push(newArchive);
      localStorage.setItem('toca_archives', JSON.stringify(archives));

      if (!isMockSupabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('archives').insert({ user_id: user.id, ...newArchive });
        }
      }
    }
    
    // Clear current tank
    localStorage.removeItem('toca_current_tank');
    localStorage.setItem('toca_focus_today', '0');
    localStorage.setItem('toca_fish_today', '0');
  }
  
  localStorage.setItem('toca_current_day', today);
};

export const getArchives = async (): Promise<TankSnapshot[]> => {
  if (!isMockSupabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('archives').select('*').eq('user_id', user.id).order('pinned', { ascending: false }).order('date', { ascending: false });
      if (data) return data;
    }
  }
  
  // Fallback / mock
  const archivesStr = localStorage.getItem('toca_archives') || '[]';
  const archives: TankSnapshot[] = JSON.parse(archivesStr);
  return archives.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
};

export const togglePinArchive = async (id: string, pinned: boolean) => {
  const archivesStr = localStorage.getItem('toca_archives') || '[]';
  const archives: TankSnapshot[] = JSON.parse(archivesStr);
  const updated = archives.map(a => a.id === id ? { ...a, pinned } : a);
  localStorage.setItem('toca_archives', JSON.stringify(updated));

  if (!isMockSupabase) {
    await supabase.from('archives').update({ pinned }).eq('id', id);
  }
};
