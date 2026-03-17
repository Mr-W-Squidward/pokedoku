import { useRef, useState, useCallback, useEffect } from 'react';

const MUSIC_TRACKS = [
  { title: 'Unwavering Emotions', src: '/audio/music/bw-unwavering-emotions.mp3' },
  { title: 'Canalave City', src: '/audio/music/canalave-city.mp3' },
  { title: 'Driftveil City', src: '/audio/music/driftveil-city.mp3' },
  { title: 'Floaroma Town', src: '/audio/music/floaroma-town.mp3' },
  { title: 'FireRed Ending', src: '/audio/music/fr-ending-theme.mp3' },
  { title: 'Goldenrod City', src: '/audio/music/goldenrod-city.mp3' },
  { title: 'Heartgold Surfing Theme', src: '/audio/music/hg-surfing.mp3' },
  { title: 'Heartgold Vermillion City', src: '/audio/music/hg-vermillion-city.mp3' },
  { title: 'New Bark Town', src: '/audio/music/new-bark-town.mp3' },
  { title: 'Random Piano OST', src: '/audio/music/random-piano-theme.mp3' },
  { title: 'Ruby Dewford Town', src: '/audio/music/ruby-dewford-town.mp3' },
  { title: 'Ruby Fallarbor Town', src: '/audio/music/ruby-fallarbor-town.mp3' },
  { title: 'Ruby Lilycove City ', src: '/audio/music/ruby-lilycove-city.mp3' },
  { title: 'Ruby Littleroot Town', src: '/audio/music/ruby-littleroot-town.mp3' },
  { title: 'Ruby Route 101', src: '/audio/music/ruby-route-101.mp3' },
  { title: 'Ruby Rustboro City', src: '/audio/music/ruby-rustboro-city.mp3' },
  { title: 'Ruby Science Museum', src: '/audio/music/ruby-science-museum.mp3' },
  { title: 'Ruby Surfing Theme', src: '/audio/music/ruby-surfing.mp3' },
  { title: 'Ruby Verdanturf Town', src: '/audio/music/ruby-verdanturf-town.mp3' },
]

export function useAudio() {
  // SFX
  const [sfxOn, setSfxOn] = useState(true);

  const playSfx = useCallback((path: string) => {
    if (!sfxOn) return;
    const audio = new Audio(path);
    audio.play().catch(() => {}); // cuz browsers block auto play, we catch the error to avoid console warnings
  }, [sfxOn]);

  const playCorrect = useCallback(() => playSfx('/audio/sfx/pokemon_plink.mp3'), [playSfx]);
  const playIncorrect = useCallback(() => playSfx('/audio/sfx/wall_bump.mp3'), [playSfx]);
  const playFinished = useCallback(() => playSfx('/audio/sfx/pokemon_battle_win.mp3'), [playSfx]);
  const playGameOver = useCallback(() => playSfx('/audio/sfx/pokemon_faint.mp3'), [playSfx]);

  // Music
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const randomTrackIndex = useCallback(() => Math.floor(Math.random() * MUSIC_TRACKS.length), []);
  const [trackIndex, setTrackIndex] = useState<number>(() => randomTrackIndex());
  const [musicOn, setMusicOn] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.5);

  // Swap tracks on index change and volume/play state
  useEffect(() => {
    if (!musicRef.current) return;
    const audio = musicRef.current;
    audio.src = MUSIC_TRACKS[trackIndex].src;
    audio.volume = musicVolume;
    audio.loop = true;

    if (musicOn) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [trackIndex, musicOn, musicVolume]);

  // Initiate audio
  useEffect(() => {
    const audio = new Audio(MUSIC_TRACKS[trackIndex].src);
    audio.loop = true;
    audio.volume = musicVolume;
    musicRef.current = audio;
    if (musicOn) {
      audio.play().catch(() => {});
    }
    return () => {
      audio.pause();
      audio.src = '';
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = musicRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    }
    else {
      audio.play().catch(() => {});
      setMusicOn(true);
    }
  }, [musicOn])

  const nextTrack = useCallback(() => {
    setTrackIndex(i => (i + 1) % MUSIC_TRACKS.length);
  }, [])

  const prevTrack = useCallback(() => {
    setTrackIndex(i => (i - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
  }, [])

  return {
    sfxOn, setSfxOn, playCorrect, playIncorrect, playFinished, playGameOver,
    trackTitle: MUSIC_TRACKS[trackIndex].title, musicOn, togglePlay, nextTrack, prevTrack, musicVolume, setMusicVolume
  }
}