export type SoundType = 
  | 'move' 
  | 'rotate' 
  | 'land' 
  | 'lineClear' 
  | 'tetris' 
  | 'levelUp' 
  | 'gameOver' 
  | 'hold'
  | 'pause'
  | 'unpause'

export interface AudioSettings {
  musicVolume: number
  sfxVolume: number
  muteAll: boolean
}

export interface SoundEffect {
  type: SoundType
  volume?: number
  loop?: boolean
  preload?: boolean
}

export interface AudioManager {
  playSound: (type: SoundType, volume?: number) => void
  playMusic: (volume?: number) => void
  pauseMusic: () => void
  resumeMusic: () => void
  stopMusic: () => void
  setMusicVolume: (volume: number) => void
  setSfxVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  isLoaded: boolean
}
