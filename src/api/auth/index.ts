import APIClient from 'utils/ts/apiClient';
import {
  Login,
  NicknameDuplicateCheck,
  Refresh,
  SignupStudent,
  SignupGeneral,
  User,
  UserAcademicInfo,
  UpdateUser,
  FindPassword,
  DeleteUser,
  CheckPassword,
  UpdateAcademicInfo,
  CheckPhone,
  SmsSend,
  SmsVerify,
  CheckId,
  EmailDuplicateCheck,
  EmailExists,
  VerificationEmailSend,
  VerificationEmailVerify,
  IdFindEmail,
  PhoneExists,
  IdFindSms,
} from './APIDetail';

export const login = APIClient.of(Login);

export const nicknameDuplicateCheck = APIClient.of(NicknameDuplicateCheck);

export const signupStudent = APIClient.of(SignupStudent);

export const signupGeneral = APIClient.of(SignupGeneral);

export const refresh = APIClient.of(Refresh);

export const getUser = APIClient.of(User);

export const getUserAcademicInfo = APIClient.of(UserAcademicInfo);

export const updateUser = APIClient.of(UpdateUser);

export const deleteUser = APIClient.of(DeleteUser);

export const findPassword = APIClient.of(FindPassword);

export const checkPassword = APIClient.of(CheckPassword);

export const updateAcademicInfo = APIClient.of(UpdateAcademicInfo);

export const checkPhone = APIClient.of(CheckPhone);

export const smsSend = APIClient.of(SmsSend);

export const smsVerify = APIClient.of(SmsVerify);

export const checkId = APIClient.of(CheckId);

export const emailDuplicateCheck = APIClient.of(EmailDuplicateCheck);

export const emailExists = APIClient.of(EmailExists);

export const verificationEmailSend = APIClient.of(VerificationEmailSend);

export const verificationEmailVerify = APIClient.of(VerificationEmailVerify);

export const idFindEmail = APIClient.of(IdFindEmail);

export const phoneExists = APIClient.of(PhoneExists);

export const idFindSms = APIClient.of(IdFindSms);
