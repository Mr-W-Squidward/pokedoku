interface Props {
  trackTitle: string,
  musicOn: boolean,
  onTogglePlay: () => void,
  onNextTrack: () => void,
  onPrevTrack: () => void,
  musicVolume: number,
  onVolumeChange: (volume: number) => void
  sfxOn: boolean,
  onToggleSfx: () => void
}

export default function MusicPlayer({ trackTitle, musicOn, onTogglePlay, onNextTrack, onPrevTrack, musicVolume, onVolumeChange, sfxOn, onToggleSfx }: Props) {
  return (
    <div className="flex items-center gap-3 bg-[#1a2535] border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-300">
      <div className="text-sm font-medium">{trackTitle}</div>

      {/* Music Controls */}
      <div className="flex items-center space-x-4">
        <button onClick={onPrevTrack} className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors">◀◀</button>
        <button onClick={onTogglePlay} className={`px-2 py-1 rounded transition-colors ${musicOn ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
          {musicOn ? '⏸' : '▶'}
        </button>
        <button onClick={onNextTrack} className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors">▶▶</button>
      </div>

      {/* Volume Control */}
      <span className="text-gray-500">🎧</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={musicVolume}
        onChange={e => onVolumeChange(Number(e.target.value))}
        className="w-20 accent-yellow-400"
      />

      {/* SFX Toggle */}
      <button onClick={onToggleSfx} className={`px-2 py-0.5 rounded border text-xs transition ${
          sfxOn
            ? 'border-gray-600 text-gray-300 hover:bg-yellow-400 hover:text-black'
            : 'border-red-500 text-red-400 hover:bg-red-500 hover:text-white'
        }`}>
        {sfxOn ? '🔊 SFX' : '🔇 SFX'}
      </button>
    </div>
  )
}