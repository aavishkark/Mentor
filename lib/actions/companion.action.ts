"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

interface CreateCompanion {
    name: string;
    subject: string;
    topic: string;
    voice: string;
    style: string;
    duration: number;
}

interface GetAllCompanions {
    limit?: number;
    page?: number;
    subject?: string | string[];
    topic?: string | string[];
}


export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.from('companions')
        .insert({ ...formData, author })
        .select();

    if (error || !data) throw new Error(error?.message ||
        'Failed to create a companion');

    return data[0]
}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const supabase = createSupabaseClient();

    let query = supabase.from('companions').select();

    if (subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }
    else if (subject) {
        query = query.ilike('subject', `%${subject}%`)
    }
    else if (topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if (error) throw new Error(error.message);

    return companions;

}


export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id);

    if (error) return console.log(error);

    return data[0];
}

interface TranscriptMessage {
    role: string;
    content: string;
    timestamp?: string;
}

export const createSession = async (companionId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
            transcript: []
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export const updateSessionTranscript = async (sessionId: string, transcript?: TranscriptMessage[]) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    const timestampedTranscript = transcript?.map(msg => ({
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString()
    }));

    const { data, error } = await supabase
        .from('session_history')
        .update({ transcript: timestampedTranscript })
        .eq('id', sessionId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export const addToSessionHistory = async (companionId: string, transcript?: TranscriptMessage[]) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    const sessionData: any = {
        companion_id: companionId,
        user_id: userId
    };

    if (transcript && transcript.length > 0) {
        const timestampedTranscript = transcript.map(msg => ({
            ...msg,
            timestamp: msg.timestamp || new Date().toISOString()
        }));
        sessionData.transcript = timestampedTranscript;
    }

    const { data, error } = await supabase.from('session_history')
        .insert(sessionData);

    if (error) throw new Error(error.message);

    return data;
}

export const getRecentSessions = async (limit = 10) => {
    const { userId } = await auth();
    if (!userId) return [];

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`
            id,
            created_at,
            transcript,
            companions:companion_id(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(error.message);

    return data.map(({ id, created_at, transcript, companions }) => ({
        ...companions,
        sessionId: id,
        sessionDate: created_at,
        transcript: transcript || []
    }))
}

export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`
            id,
            created_at,
            transcript,
            companions:companion_id(
                id,
                name,
                subject,
                topic,
                duration,
                voice,
                style
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(error.message);

    return data.map((session: any) => ({
        ...session.companions,
        sessionId: session.id,
        sessionDate: session.created_at,
        transcript: session.transcript || []
    }));
}

export const getUserCompanions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(error.message);

    return data
}

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();
    const supabase = createSupabaseClient();
    let limit = 0;

    if (has({ plan: 'pro' })) {
        return true
    }
    else if (has({ feature: "3_companion_limit" })) {
        limit = 3;
    }
    else if (has({ feature: "10_companio_limit" })) {
        limit = 10
    }

    const { data, error } = await supabase
        .from('companions')
        .select('id', { count: 'exact' })
        .eq('author', userId)

    if (error) throw new Error(error.message)

    const companionCount = data?.length

    if (companionCount >= limit) {
        return false;
    }
    else {
        return true;
    }
}

export const getUserAnalytics = async (userId: string) => {
    const supabase = createSupabaseClient();

    const { data: sessions, error } = await supabase
        .from('session_history')
        .select(`
            id,
            created_at,
            companions:companion_id(
                id,
                name,
                subject,
                topic,
                duration
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    const subjectStats = new Map<string, number>();
    const dailyActivity = new Map<string, number>();
    let totalTime = 0;
    let totalSessions = sessions.length;

    sessions.forEach((session: any) => {
        const companion = session.companions;
        if (!companion) return;

        const subject = companion.subject || 'Unknown';
        const duration = companion.duration || 15; // default 15 mins
        const date = new Date(session.created_at).toISOString().split('T')[0];

        subjectStats.set(subject, (subjectStats.get(subject) || 0) + duration);

        dailyActivity.set(date, (dailyActivity.get(date) || 0) + 1);

        totalTime += duration;
    });

    const subjectData = Array.from(subjectStats.entries()).map(([name, value]) => ({
        name,
        value,
        percentage: totalTime > 0 ? Math.round((value / totalTime) * 100) : 0
    }));

    const trendData = Array.from(dailyActivity.entries()).map(([date, sessions]) => ({
        date,
        sessions
    }));

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
    });

    const weeklyActivity = last7Days.map(date => ({
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: dailyActivity.get(date) || 0
    }));

    return {
        totalTime,
        totalSessions,
        avgSessionLength: totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0,
        subjectData: subjectData.sort((a, b) => b.value - a.value),
        trendData,
        weeklyActivity
    };
}

export const getMentorRecommendations = async (limit = 6) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    if (!userId) {
        const { data: trending, error: trendingError } = await supabase
            .from('companions')
            .select()
            .order('created_at', { ascending: false })
            .limit(limit);

        if (trendingError) throw new Error(trendingError.message);
        return trending || [];
    }

    const { data: sessions, error: sessionsError } = await supabase
        .from('session_history')
        .select(`
            companion_id,
            created_at,
            companions:companion_id(
                id,
                subject,
                topic,
                duration
            )
        `)
        .eq('user_id', userId);

    if (sessionsError) throw new Error(sessionsError.message);

    if (!sessions || sessions.length === 0) {
        const { data: popular, error: popularError } = await supabase
            .from('companions')
            .select()
            .order('created_at', { ascending: false })
            .limit(limit);

        if (popularError) throw new Error(popularError.message);
        return popular || [];
    }

    const subjectScores = new Map<string, number>();
    const usedMentorIds = new Set<string>();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    sessions.forEach((session: any) => {
        const companion = session.companions;
        if (!companion) return;

        usedMentorIds.add(companion.id);
        const subject = companion.subject || 'General';
        const duration = companion.duration || 15;
        const sessionDate = new Date(session.created_at);

        let score = duration;

        if (sessionDate >= sevenDaysAgo) {
            const daysAgo = Math.floor((now.getTime() - sessionDate.getTime()) / (24 * 60 * 60 * 1000));
            score += Math.max(0, 20 - (daysAgo * 3));
        }

        subjectScores.set(subject, (subjectScores.get(subject) || 0) + score);
    });

    const topSubjects = Array.from(subjectScores.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([subject]) => subject);

    let query = supabase.from('companions').select();

    if (usedMentorIds.size > 0) {
        query = query.not('id', 'in', `(${Array.from(usedMentorIds).join(',')})`);
    }

    const { data: allMentors, error: mentorsError } = await query.limit(100);

    if (mentorsError) throw new Error(mentorsError.message);
    if (!allMentors || allMentors.length === 0) {
        const { data: fallback } = await supabase
            .from('companions')
            .select()
            .limit(limit);
        return fallback || [];
    }

    const scoredMentors = allMentors.map((mentor: any) => {
        let score = 0;
        const mentorSubject = mentor.subject || 'General';

        const subjectIndex = topSubjects.indexOf(mentorSubject);
        if (subjectIndex !== -1) {
            score += 50 - (subjectIndex * 15);
        } else {
            score += 15;
        }

        const mentorAge = now.getTime() - new Date(mentor.created_at).getTime();
        const daysOld = mentorAge / (24 * 60 * 60 * 1000);
        if (daysOld < 30) {
            score += Math.max(0, 15 - Math.floor(daysOld / 2));
        }

        return { ...mentor, recommendationScore: score };
    });

    const recommendations = scoredMentors
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, limit);

    return recommendations;
}

interface CreateNote {
    sessionId?: string;
    companionId?: string;
    title: string;
    content: string;
    tags?: string[];
}

interface UpdateNote {
    id: string;
    title?: string;
    content?: string;
    tags?: string[];
    aiSummary?: string;
}

export const createNote = async (noteData: CreateNote) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('notes')
        .insert({
            user_id: userId,
            session_id: noteData.sessionId || null,
            companion_id: noteData.companionId || null,
            title: noteData.title,
            content: noteData.content,
            tags: noteData.tags || []
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export const updateNote = async (noteData: UpdateNote) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    const updatePayload: any = {};
    if (noteData.title !== undefined) updatePayload.title = noteData.title;
    if (noteData.content !== undefined) updatePayload.content = noteData.content;
    if (noteData.tags !== undefined) updatePayload.tags = noteData.tags;
    if (noteData.aiSummary !== undefined) updatePayload.ai_summary = noteData.aiSummary;

    const { data, error } = await supabase
        .from('notes')
        .update(updatePayload)
        .eq('id', noteData.id)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export const deleteNote = async (noteId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return { success: true };
}

export const getNote = async (noteId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('notes')
        .select(`
            *,
            session:session_id(*),
            companion:companion_id(id, name, subject, topic)
        `)
        .eq('id', noteId)
        .eq('user_id', userId)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export const getNotesBySession = async (sessionId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

interface GetUserNotesParams {
    limit?: number;
    page?: number;
    companionId?: string;
    tags?: string[];
}

export const getUserNotes = async ({ limit = 20, page = 1, companionId, tags }: GetUserNotesParams = {}) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    let query = supabase
        .from('notes')
        .select(`
            *,
            companion:companion_id(id, name, subject, topic)
        `, { count: 'exact' })
        .eq('user_id', userId);

    if (companionId) {
        query = query.eq('companion_id', companionId);
    }

    if (tags && tags.length > 0) {
        query = query.overlaps('tags', tags);
    }

    query = query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
        notes: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
    };
}

export const searchNotes = async (searchQuery: string, limit = 20) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('notes')
        .select(`
            *,
            companion:companion_id(id, name, subject, topic)
        `)
        .eq('user_id', userId)
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw new Error(error.message);
    return data || [];
}

export const generateAISummary = async (noteId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    const { data: note, error: noteError } = await supabase
        .from('notes')
        .select('content, title')
        .eq('id', noteId)
        .eq('user_id', userId)
        .single();

    if (noteError) throw new Error(noteError.message);

    const words = note.content.split(' ');
    const summary = words.length > 50
        ? `Summary of "${note.title}": ${words.slice(0, 50).join(' ')}...`
        : `Summary of "${note.title}": ${note.content}`;

    const { data, error } = await supabase
        .from('notes')
        .update({ ai_summary: summary })
        .eq('id', noteId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export const getAllTags = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('notes')
        .select('tags')
        .eq('user_id', userId);

    if (error) throw new Error(error.message);

    const allTags = new Set<string>();
    data?.forEach(note => {
        note.tags?.forEach((tag: string) => allTags.add(tag));
    });

    return Array.from(allTags).sort();
}