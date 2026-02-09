import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Server-side proxy for ElevenLabs TTS.
// If ELEVENLABS_API_KEY is not set, the client will fall back to browser speechSynthesis.

const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel (common default)

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ElevenLabs key is not configured' }, { status: 501 });
    }

    const body = await req.json().catch(() => ({}));
    const text = String(body?.text || '').trim();
    const voiceId = String(body?.voiceId || DEFAULT_VOICE_ID).trim();

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    // Guardrail: keep request sizes reasonable.
    if (text.length > 2500) {
      return NextResponse.json({ error: 'Text too long' }, { status: 400 });
    }

    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => '');
      return NextResponse.json(
        { error: 'ElevenLabs TTS failed', details: detail || `HTTP ${resp.status}` },
        { status: 502 }
      );
    }

    const audio = await resp.arrayBuffer();
    return new NextResponse(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('IELTS listening TTS error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
