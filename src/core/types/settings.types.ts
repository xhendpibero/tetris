export interface Settings {
  startingLevel: number
  ghostPieceEnabled: boolean
  gridLinesEnabled: boolean
  nextPieceCount: number
  musicVolume: number
  sfxVolume: number
  muteAll: boolean
  controlType: ControlType
  das: number
  arr: number
  vibrationEnabled: boolean
}

export interface PrivacySettings {
  allowGlobalLeaderboard: boolean
  allowCountryTracking: boolean
  allowDeviceTracking: boolean
  playerName: string
  isAnonymous: boolean
}

export type ControlType = 'keyboard' | 'touch' | 'gestures' | 'hybrid'

export const DEFAULT_SETTINGS: Settings = {
  startingLevel: 1,
  ghostPieceEnabled: true,
  gridLinesEnabled: true,
  nextPieceCount: 1,
  musicVolume: 70,
  sfxVolume: 100,
  muteAll: false,
  controlType: 'keyboard',
  das: 170,
  arr: 70,
  vibrationEnabled: true,
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  allowGlobalLeaderboard: false,
  allowCountryTracking: false,
  allowDeviceTracking: true,
  playerName: 'Anonymous',
  isAnonymous: true,
}
