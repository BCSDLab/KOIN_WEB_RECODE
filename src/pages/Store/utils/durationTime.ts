export const setDurationTime = () => {
  const currentTime = new Date().getTime();
  sessionStorage.setItem('enterMain', currentTime.toString());
};

export const getDurationTime = () => {
  const currentTime = new Date().getTime();
  const enterMainTime = Number(sessionStorage.getItem('enterMain')) || currentTime;
  return (currentTime - enterMainTime) / 1000;
};
