export interface ErrorInfo {
  code: number;
  message: string;
}
// CanisterErrorCode
export enum CanisterErrorCode {
  DFTError = 3,
  LedgerError = 4,
  RegisterNameWithQuotaYearMustBe1 = 5,
  RegisterYearMustBeGt1 = 6
}

export class CanisterError extends Error {
  readonly code: number;
  readonly message: string;
  constructor(err: ErrorInfo) {
    super(err.message);
    this.code = err.code;
    this.message = err.message;
    this.name = 'CanisterError';
  }
}

export enum WalletConnectErrorCode {
  ConnectFailed = 1,
  PlugNotInstall = 10,
  PlugConnectFailed = 11,
  AstroxConnectFailed = 20,
  StoicWalletConnectFailed = 30,
  InfinityWalletNotInstall = 40,
  InfinityWalletConnectFailed = 41,
  NFIDConnectFailed = 50,
  InternetIdentityConnectFailed = 60,
  ICPBoxConnectFailed = 70,
  NoExistProvider = 100,
  NotConnected = 101,
  Unknown = 10000
}

export class WalletConnectError extends Error {
  readonly code: number;
  readonly message: string;
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
    this.name = 'WalletConnectError';
  }
}
