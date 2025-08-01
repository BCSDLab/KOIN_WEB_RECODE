import {
  createContext, useState, useMemo, Dispatch, SetStateAction, useContext,
} from 'react';

interface FormValidation {
  isPasswordValid?: boolean;
  isPhoneValid: boolean;
  isStudentIdValid: boolean;
  isStudentMajorValid: boolean;
  isGenderValid: boolean;
  isNameValid: boolean;
  isEmailValid?: boolean;
  isNicknameValid?: boolean;
  isFieldChanged: boolean;
}

interface ModifyFormValidationContextType {
  isValid: FormValidation;
  setIsValid: Dispatch<SetStateAction<FormValidation>>;
}

export const ModifyFormValidationContext = createContext<
ModifyFormValidationContextType | null>(null);

export function ModifyFormValidationProvider({ children }: { children: React.ReactNode }) {
  const [isValid, setIsValid] = useState<FormValidation>({
    isPhoneValid: false,
    isStudentIdValid: false,
    isStudentMajorValid: false,
    isGenderValid: false,
    isFieldChanged: false,
    isNameValid: false,
  });

  const value = useMemo(() => ({ isValid, setIsValid }), [isValid, setIsValid]);

  return (
    <ModifyFormValidationContext.Provider value={value}>
      {children}
    </ModifyFormValidationContext.Provider>
  );
}

export const useValidationContext = (isStudent?: boolean) => {
  const context = useContext(ModifyFormValidationContext);

  if (!context) {
    throw new Error('useValidationContext must be used within a ModifyFormValidationProvider');
  }

  const { isValid, setIsValid } = context;

  const isStudentFormValid = useMemo(() => (
    isValid.isPhoneValid
      && isValid.isStudentIdValid
      && isValid.isStudentMajorValid
      && isValid.isGenderValid
      && isValid.isNameValid
      && isValid.isFieldChanged
  ), [
    isValid.isPhoneValid,
    isValid.isStudentIdValid,
    isValid.isStudentMajorValid,
    isValid.isGenderValid,
    isValid.isNameValid,
    isValid.isFieldChanged,
  ]) || isValid.isPasswordValid
  || isValid.isEmailValid
  || isValid.isNicknameValid;

  const isGeneralFormValid = useMemo(() => (
    isValid.isPhoneValid
      && isValid.isGenderValid
      && isValid.isNameValid
      && isValid.isFieldChanged
  ), [
    isValid.isPhoneValid,
    isValid.isGenderValid,
    isValid.isNameValid,
    isValid.isFieldChanged,
  ]) || isValid.isPasswordValid
  || isValid.isEmailValid
  || isValid.isNicknameValid;

  const isFormValid = isStudent ? isStudentFormValid : isGeneralFormValid;

  return { isValid, setIsValid, isFormValid };
};
