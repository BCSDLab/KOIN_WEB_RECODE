import { APIRequest, HTTP_METHOD } from 'interfaces/APIRequest';
import {
  LoginRequest,
  LoginResponse,
  NicknameDuplicateCheckResponse,
  RefreshRequest,
  RefreshResponse,
  UserResponse,
  UserAcademicInfoResponse,
  FindPasswordRequest,
  FindPasswordResponse,
  UserUpdateRequest,
  DeleteResponse,
  CheckPasswordResponse,
  CheckPasswordRequest,
  UpdateAcademicInfoResponse,
  UpdateAcademicInfoRequest,
  CheckPhoneResponse,
  SmsSendRequest,
  SmsSendResponse,
  SmsVerifyResponse,
  SmsVerifyRequest,
  SignupGeneralResponse,
  LoginGeneralRequest,
  SignupStudentResponse,
  LoginStudentRequest,
  CheckIdResponse,
  EmailDuplicateCheckResponse,
  PhoneExistsResponse,
  PhoneExistsRequest,
  VerificationEmailSendResponse,
  VerificationEmailSendRequest,
  VerificationEmailVerifyRequest,
  VerificationEmailVerifyResponse,
  IdFindEmailResponse,
  IdFindEmailRequest,
  EmailExistsResponse,
  EmailExistsRequest,
  IdFindSmsResponse,
  IdFindSmsRequest,
  GeneralUserResponse,
  IdExistsResponse,
  IdExistsRequest,
  IdMatchPhoneResponse,
  IdMatchPhoneRequest,
  IdMatchEmailResponse,
  IdMatchEmailRequest,
  ResetPasswordSmsResponse,
  ResetPasswordSmsRequest,
  ResetPasswordEmailResponse,
  ResetPasswordEmailRequest,
  GeneralUserUpdateRequest,
} from './entity';

export class Login<R extends LoginResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/v2/users/login';

  response!: R;

  auth = false;

  constructor(public data: LoginRequest) { }
}

export class NicknameDuplicateCheck<R extends NicknameDuplicateCheckResponse> implements
  APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(nickname: string) {
    this.path = `/user/check/nickname?nickname=${nickname}`;
  }
}

export class SignupStudent<R extends SignupStudentResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = 'v2/users/students/register';

  response!: R;

  auth = false;

  constructor(public data: LoginStudentRequest) { }
}

export class SignupGeneral<R extends SignupGeneralResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = 'v2/users/register';

  response!: R;

  auth = false;

  constructor(public data: LoginGeneralRequest) { }
}

export class Refresh<R extends RefreshResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/refresh';

  response!: R;

  auth = false;

  constructor(public data: RefreshRequest) { }
}

export class User<R extends UserResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/user/student/me';

  response!: R;

  auth = false;

  constructor(public authorization: string) { }
}

export class GeneralUser<R extends GeneralUserResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/v2/users/me';

  response!: R;

  auth = false;

  constructor(public authorization: string) { }
}

// 추후 User 클래스명으로 아래 API로 통일할 것
export class UserAcademicInfo<R extends UserAcademicInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = '/user/student/me/academic-info';

  response!: R;

  auth = true;

  constructor(public authorization: string) { }
}

export class UpdateUser<R extends UserResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = '/v2/users/students/me';

  response!: R;

  data: UserUpdateRequest;

  auth = true;

  constructor(public authorization: string, data: UserUpdateRequest) {
    this.data = data;
  }
}

export class UpdateGeneralUser<R extends GeneralUserResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = 'v2/users/me';

  response!: R;

  data: UserUpdateRequest;

  auth = true;

  constructor(public authorization: string, data: GeneralUserUpdateRequest) {
    this.data = data;
  }
}

export class DeleteUser<R extends DeleteResponse> implements APIRequest<R> {
  method = HTTP_METHOD.DELETE;

  response!: R;

  path = '/user';

  auth = true;

  constructor(public authorization: string) { }
}

export class CheckId<R extends CheckIdResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(loginId: string) {
    this.path = `/user/check/id?loginId=${loginId}`;
  }
}

export class FindPassword<R extends FindPasswordResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/find/password';

  response!: R;

  auth = false;

  constructor(public data: FindPasswordRequest) { }
}

export class CheckPassword<R extends CheckPasswordResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/check/password';

  response!: R;

  auth = false;

  data: CheckPasswordRequest;

  constructor(public authorization: string, data: CheckPasswordRequest) {
    this.data = data;
  }
}

export class UpdateAcademicInfo<R extends UpdateAcademicInfoResponse> implements APIRequest<R> {
  method = HTTP_METHOD.PUT;

  path = 'user/student/academic-info';

  response!: R;

  auth = true;

  constructor(public authorization: string, public data: UpdateAcademicInfoRequest) { }
}

export class CheckPhone<R extends CheckPhoneResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path: string;

  response!: R;

  auth = false;

  constructor(phone: string) {
    this.path = `/user/check/phone?phone=${phone}`;
  }
}

export class SmsSend<R extends SmsSendResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/users/verification/sms/send';

  response!: R;

  auth = false;

  constructor(public data: SmsSendRequest) { }
}

export class SmsVerify<R extends SmsVerifyResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/users/verification/sms/verify';

  response!: R;

  auth = false;

  constructor(public data: SmsVerifyRequest) { }
}

export class EmailDuplicateCheck<R extends EmailDuplicateCheckResponse> implements APIRequest<R> {
  method = HTTP_METHOD.GET;

  path = 'user/check/email';

  response!: R;

  auth = false;

  constructor(email: string) {
    this.path = `/user/check/email?email=${email}`;
  }
}
export class EmailExists<R extends EmailExistsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/email/exists';

  response!: R;

  auth = false;

  constructor(public data: EmailExistsRequest) { }
}

export class VerificationEmailSend<
  R extends VerificationEmailSendResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/users/verification/email/send';

  response!: R;

  auth = false;

  constructor(public data: VerificationEmailSendRequest) { }
}

export class VerificationEmailVerify<
  R extends VerificationEmailVerifyResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/users/verification/email/verify';

  response!: R;

  auth = false;

  constructor(public data: VerificationEmailVerifyRequest) { }
}

export class IdFindEmail<R extends IdFindEmailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/users/id/find/email';

  response!: R;

  auth = false;

  constructor(public data: IdFindEmailRequest) { }
}

export class PhoneExists<R extends PhoneExistsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/phone/exists';

  response!: R;

  auth = false;

  constructor(public data: PhoneExistsRequest) { }
}

export class IdFindSms<R extends IdFindSmsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/users/id/find/sms';

  response!: R;

  auth = false;

  constructor(public data: IdFindSmsRequest) { }
}

export class IdExists<R extends IdExistsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/user/id/exists';

  response!: R;

  auth = false;

  constructor(public data: IdExistsRequest) { }
}

export class IdMatchPhone<R extends IdMatchPhoneResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/users/id/match/phone';

  response!: R;

  auth = false;

  constructor(public data: IdMatchPhoneRequest) { }
}

export class IdMatchEmail<R extends IdMatchEmailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/users/id/match/phone';

  response!: R;

  auth = false;

  constructor(public data: IdMatchEmailRequest) { }
}

export class ResetPasswordSms<R extends ResetPasswordSmsResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/users/password/reset/sms';

  response!: R;

  auth = false;

  constructor(public data: ResetPasswordSmsRequest) { }
}

export class ResetPasswordEmail<R extends ResetPasswordEmailResponse> implements APIRequest<R> {
  method = HTTP_METHOD.POST;

  path = '/users/password/reset/email';

  response!: R;

  auth = false;

  constructor(public data: ResetPasswordEmailRequest) { }
}
