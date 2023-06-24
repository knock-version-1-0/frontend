export const getCurrentTime = (): number => {
  return Math.round(Date.now() / 1000);
}

export const generateUUID = (): string => {
  // UUID는 버전 4의 랜덤 UUID를 생성합니다.
  // 예: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
