export const DIFFICULTY = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
export const MEALS = [
  { key: 'sang', label: 'Sáng' },
  { key: 'trua', label: 'Trưa' },
  { key: 'toi', label: 'Tối' },
];
export const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

export const imageUrl = (path) =>
  !path ? '/placeholder.svg' : path.startsWith('http') ? path : path;

export const formatTime = (min) =>
  min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}p` : ''}` : `${min} phút`;
