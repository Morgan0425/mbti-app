export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MBTIResponse {
  type: MBTIType;
  name: string;
  reaction: string; // 简短的第一反应
  view: string;     // 深入的看法/吐槽
}

export interface PersonalityInfo {
  type: MBTIType;
  name: string;
  category: 'Analysts' | 'Diplomats' | 'Sentinels' | 'Explorers';
  color: string;
  avatar: string;
}
