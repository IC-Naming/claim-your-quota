import { sleep } from 'web-utility';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { ActorSubclass, Agent } from '@dfinity/agent';

import { WalletConnectError, WalletConnectErrorCode } from '../../exception';
// import { principalToAccountID } from '../../helper';
import { IWalletConnector, WalletAuth, WalletType } from '..';

declare const window: any;

interface InfinityWallet {
  createActor: <T>(args: {
    canisterId: string;
    interfaceFactory: IDL.InterfaceFactory;
  }) => Promise<ActorSubclass<T>>;
  getPrincipal: () => Promise<Principal>;
  isConnected: () => Promise<boolean>;
  disconnect: () => Promise<any>;
  requestConnect: (Config) => Promise<boolean>;
}

export class InfinityWalletConnector implements IWalletConnector {
  public type = WalletType.InfinityWallet;
  public connected = false;

  private whiteList: string[] = [];
  private icHost: string;
  private dev: boolean;
  private ic?: InfinityWallet;

  constructor(icHost: string, whitelist: string[] = [], dev = false) {
    this.icHost = icHost;
    this.whiteList = whitelist;
    this.dev = dev;
  }

  connect = async (): Promise<WalletAuth> => {
    if (!window.ic?.infinityWallet) {
      window.open(
        'https://chrome.google.com/webstore/detail/infinity-wallet/jnldfbidonfeldmalbflbmlebbipcnle',
        '_blank'
      );
      throw new WalletConnectError(
        WalletConnectErrorCode.InfinityWalletNotInstall,
        'InfinityWalletConnector.connect: Infinity wallet not install'
      );
    }
    this.ic = window.ic?.infinityWallet;
    try {
      this.connected =
        (await this.ic.isConnected()) ||
        (await this.ic?.requestConnect({
          whitelist: this.whiteList,
          host: this.icHost
        }));

      if (!this.connected)
        throw new WalletConnectError(
          WalletConnectErrorCode.InfinityWalletConnectFailed,
          `InfinityWalletConnector.connect: connect failed`
        );
      console.debug(`InfinityWalletConnector.connect: connected`);

      const principalId = await this.ic.getPrincipal();
      // const accountId = principalToAccountID(principalId);

      return {
        type: WalletType.InfinityWallet,
        principal: principalId.toString(),
        // accountId
      };
    } catch (error) {
      throw new WalletConnectError(
        WalletConnectErrorCode.InfinityWalletConnectFailed,
        `InfinityWalletConnector.connect: connect failed ${error}`
      );
    }
  };

  createActor = async <T>(
    canisterId: string,
    idlFactory: IDL.InterfaceFactory
  ) => {
    if (!this.connected || !this.ic)
      throw new WalletConnectError(
        WalletConnectErrorCode.InfinityWalletConnectFailed,
        `InfinityWalletConnector.createActor: check connect failed`
      );

    /*     if (this.dev) await this.ic?.agent.fetchRootKey().catch(e => {
          console.error(`fetchRootKey error: ${e}`);
        }); */

    return this.ic?.createActor<T>({
      canisterId,
      interfaceFactory: idlFactory
    });
  };

  disconnect = () =>
    Promise.race([
      (async () => {
        // InfinityWallet disconnect promise never resolves despite being disconnected
        // This is a hacky workaround
        await sleep(0.01);

        const isConnected = await this.ic?.isConnected();

        if (!isConnected) return isConnected;

        throw new Error();
      })(),
      this.ic?.disconnect()
    ]);
}
