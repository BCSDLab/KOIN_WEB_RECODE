import { create } from 'zustand';

export type HomeExperimentVariant = 'legacy' | 'redesign';

interface HomeExperimentState {
  variant: HomeExperimentVariant;
  action: {
    updateVariant: (variant: HomeExperimentVariant) => void;
  };
}

// TODO: 배포 전에 A/B 테스트 배정값으로 초기 variant를 결정하도록 변경해야 합니다.
const DEFAULT_HOME_EXPERIMENT_VARIANT: HomeExperimentVariant = 'redesign';

const useHomeExperimentStore = create<HomeExperimentState>((set) => ({
  variant: DEFAULT_HOME_EXPERIMENT_VARIANT,
  action: {
    updateVariant: (variant) => set({ variant }),
  },
}));

export const useHomeExperimentVariant = () => useHomeExperimentStore((state) => state.variant);

export const useHomeExperimentAction = () => useHomeExperimentStore((state) => state.action);
