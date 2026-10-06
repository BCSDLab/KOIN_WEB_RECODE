// Pages Router는 history.state에 인덱스를 남기지 않는다. 대신 항목마다 key를 두는데,
// push는 새 key를 만들고 replace(shallow 포함)는 유지하므로 첫 진입 key와 비교해 이전 항목 유무를 판단한다
let entryKey: string | undefined;

const getCurrentKey = (): string | undefined => (typeof window === 'undefined' ? undefined : window.history.state?.key);

export function recordEntryHistory() {
  entryKey ??= getCurrentKey();
}

export function hasInAppHistory() {
  return entryKey !== undefined && getCurrentKey() !== entryKey;
}
