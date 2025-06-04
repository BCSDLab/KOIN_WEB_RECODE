import {
  createContext, useState, useMemo, Dispatch, SetStateAction, useContext,
} from 'react';

interface FormValidation {
  isPasswordValid: boolean;
  isPhoneValid: boolean;
  isStudentIdValid: boolean;
  isStudentMajorValid: boolean;
  isEmailValid?: boolean;
  isNicknameValid?: boolean;
}

interface ModifyFormValidationContextType {
  isValid: FormValidation;
  setIsValid: Dispatch<SetStateAction<FormValidation>>;
}

export const ModifyFormValidationContext = createContext<
ModifyFormValidationContextType | null>(null);

export function ModifyFormValidationProvider({ children }: { children: React.ReactNode }) {
  const [isValid, setIsValid] = useState<FormValidation>({
    isPasswordValid: false,
    isPhoneValid: false,
    isStudentIdValid: false,
    isStudentMajorValid: false,
  });

  const value = useMemo(() => ({ isValid, setIsValid }), [isValid, setIsValid]);

  return (
    <ModifyFormValidationContext.Provider value={value}>
      {children}
    </ModifyFormValidationContext.Provider>
  );
}

export const useValidationContext = () => {
  const context = useContext(ModifyFormValidationContext);

  if (!context) {
    throw new Error('useValidationContext must be used within a ModifyFormValidationProvider');
  }

  return context;
};
