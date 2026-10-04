// Pages Router는 history.state에 인덱스를 남기지 않아 직접 진입 여부를 알 수 없으므로 직접 기록한다
let hasNavigated = false;

export function markInAppNavigation() {
  hasNavigated = true;
}

export function hasInAppHistory() {
  return hasNavigated;
}
