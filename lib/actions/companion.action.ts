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

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId
        })

    if (error) throw new Error(error.message);

    return data;
}

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id(*)`)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(error.message);

    return data.map(({ companions }) => companions)
}

export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id(*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw new Error(error.message);

    return data.map(({ companions }) => companions)
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