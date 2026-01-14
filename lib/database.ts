import { supabase } from './supabase';
import { SurveyState, VentingPost } from '../types';

// Helper to get user IP (basic identification)
const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
};

const getUserAgent = (): string => {
  return navigator.userAgent || 'unknown';
};

const getMoodEmoji = (mood: string): string => {
  const moodEmojiMap: { [key: string]: string } = {
    '糟透了': '😤',
    '不太好': '😑',
    '还凑合': '😐',
    '挺不错': '😊',
    '超棒的': '🤩'
  };
  return moodEmojiMap[mood] || '😐';
};

// ==================== Survey Operations ====================

export const saveSurvey = async (surveyData: SurveyState): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    const userIP = await getUserIP();
    const userAgent = getUserAgent();

    const { data, error } = await supabase
      .from('surveys')
      .insert({
        tasks: surveyData.tasks,
        feedback: surveyData.feedback,
        ai_tasks: surveyData.aiTasks,
        ai_help: surveyData.aiHelp,
        mood: surveyData.mood,
        user_ip: userIP,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) throw error;

    if (surveyData.feedback) {
      const emoji = getMoodEmoji(surveyData.mood);
      await supabase
        .from('venting_posts')
        .insert({
          emoji,
          content: surveyData.feedback,
          likes_count: 0,
          rotation: Math.floor(Math.random() * 5) - 2,
          user_ip: userIP,
          user_agent: userAgent,
        });
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Error saving survey:', error);
    return { success: false, error: error.message || 'Failed to save survey' };
  }
};

export const getSurveys = async (limit = 100): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching surveys:', error);
    return { success: false, error: error.message || 'Failed to fetch surveys' };
  }
};

// ==================== Venting Wall Operations ====================

export const getVentingPosts = async (
  limit = 50,
  sortBy: 'new' | 'likes' = 'new'
): Promise<{ success: boolean; data?: VentingPost[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('venting_posts')
      .select('*')
      .order(sortBy === 'likes' ? 'likes_count' : 'created_at', { ascending: sortBy === 'likes' ? false : true })
      .limit(limit);

    if (error) throw error;

    // Transform database format to app format
    const posts: VentingPost[] = (data || []).map((post: any) => ({
      id: post.id,
      emoji: post.emoji,
      content: post.content,
      likes: formatLikes(post.likes_count),
      rank: post.rank,
      rotation: post.rotation || Math.floor(Math.random() * 5) - 2,
    }));

    return { success: true, data: posts };
  } catch (error: any) {
    console.error('Error fetching venting posts:', error);
    return { success: false, error: error.message || 'Failed to fetch posts' };
  }
};

export const createVentingPost = async (
  emoji: string,
  content: string
): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    const userIP = await getUserIP();
    const userAgent = getUserAgent();
    const rotation = Math.floor(Math.random() * 5) - 2;

    const { data, error } = await supabase
      .from('venting_posts')
      .insert({
        emoji,
        content,
        likes_count: 0,
        rotation,
        user_ip: userIP,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating venting post:', error);
    return { success: false, error: error.message || 'Failed to create post' };
  }
};

// ==================== Like Operations ====================

export const toggleLike = async (
  postId: string
): Promise<{ success: boolean; error?: string; liked?: boolean; likesCount?: number }> => {
  try {
    const userIP = await getUserIP();

    // Check if user already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from('venting_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_ip', userIP)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingLike) {
      // Unlike: remove the like
      const { error: deleteError } = await supabase
        .from('venting_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_ip', userIP);

      if (deleteError) throw deleteError;

      // Fetch updated likes count
      const { data: post } = await supabase
        .from('venting_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      return { success: true, liked: false, likesCount: post?.likes_count || 0 };
    } else {
      // Like: add the like
      const { error: insertError } = await supabase
        .from('venting_likes')
        .insert({
          post_id: postId,
          user_ip: userIP,
        });

      if (insertError) throw insertError;

      // Fetch updated likes count
      const { data: post } = await supabase
        .from('venting_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      return { success: true, liked: true, likesCount: post?.likes_count || 0 };
    }
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return { success: false, error: error.message || 'Failed to toggle like' };
  }
};

export const checkUserLike = async (
  postId: string
): Promise<{ success: boolean; liked?: boolean; error?: string }> => {
  try {
    const userIP = await getUserIP();

    const { data, error } = await supabase
      .from('venting_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_ip', userIP)
      .maybeSingle();

    if (error) throw error;

    return { success: true, liked: !!data };
  } catch (error: any) {
    console.error('Error checking like status:', error);
    return { success: false, error: error.message || 'Failed to check like status' };
  }
};

// ==================== Helper Functions ====================

// Format number to display format (e.g., 2400 -> '2.4k')
const formatLikes = (count: number): string => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};
