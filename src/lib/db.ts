import { supabase, isMockSupabase } from './supabase';
import { getTodayInUserTimezone } from './dateUtils';

export interface TankSnapshot {
  id: string;
  date: string;
  fishes: string[]; // types of fishes
  focusHours: number;
  loopsCompleted: number;
  theme: string;
  pinned: boolean;
  isGolden?: boolean;
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
        isGolden: prevTank.isGolden || false,
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

// 1. Get or create today's tank
export const getTodayTank = async (userId: string, timezone: string) => {
  const today = getTodayInUserTimezone(timezone);
  
  let { data } = await supabase
    .from('daily_tanks')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (!data) {
    // New day = new empty tank
    const { data: newTank } = await supabase
      .from('daily_tanks')
      .insert({ user_id: userId, date: today, fish_list: [] })
      .select().single();
    return newTank;
  }
  return data;
};

// 2. Save tank state (call this every few minutes + on tab close)
export const saveTankState = async (userId: string, timezone: string, tankData: any) => {
  const today = getTodayInUserTimezone(timezone);
  await supabase
    .from('daily_tanks')
    .upsert({
      user_id: userId,
      date: today,
      ...tankData,
      snapshot_data: tankData
    });
};

// 3. Get archive (all past days)
export const getArchive = async (userId: string) => {
  const { data } = await supabase
    .from('daily_tanks')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  return data;
};

// 4. Log a completed focus session
export const logSession = async (userId: string, timezone: string, minutes: number, loops: number) => {
  const today = getTodayInUserTimezone(timezone);
  await supabase.from('focus_sessions').insert({
    user_id: userId,
    date: today,
    started_at: new Date().toISOString(),
    duration_minutes: minutes,
    loops_completed: loops
  });
  
  // Also update daily tank stats
  const { data: tank } = await supabase
    .from('daily_tanks')
    .select('loops_completed, focus_minutes')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (tank) {
    await supabase.from('daily_tanks')
      .update({ 
        loops_completed: (tank.loops_completed || 0) + loops,
        focus_minutes: (tank.focus_minutes || 0) + minutes
      })
      .eq('user_id', userId)
      .eq('date', today);
  }
};
