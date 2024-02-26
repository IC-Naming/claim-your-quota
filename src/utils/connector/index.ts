import { IDL } from '@dfinity/candid';
// import { Principal } from '@dfinity/principal';
import { ActorSubclass, Identity } from '@dfinity/agent';

import { WalletConnectError, WalletConnectErrorCode } from '../exception';

import {
  PlugWalletConnector,
  InfinityWalletConnector,
} from './providers';

export enum WalletType {
  PlugWallet,
  InfinityWallet,
}

export interface WalletAuth {
  type: WalletType;
  principal: string;
  // accountId: string;
}

export interface IWalletConnector {
  type: WalletType;
  connected: boolean;
  /**
   * connect to the wallet
   * @returns {Promise<WalletAuth>}
   */
  connect: () => Promise<WalletAuth>;
  /**
   * disconnect from the wallet
   */
  disconnect: () => any;
  createActor: <T>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ) => Promise<ActorSubclass<T>>;
}

export class ICConnector {
  public walletAuth?: WalletAuth;
  private connectors = new Map<WalletType, IWalletConnector>();

  constructor(host: string, whitelist: string[], dev: boolean) {
    this.connectors.set(
      WalletType.PlugWallet,
      new PlugWalletConnector(host, whitelist, dev)
    );
    this.connectors.set(
      WalletType.InfinityWallet,
      new InfinityWalletConnector(host, whitelist, dev)
    );
  }

  /**
   * connect to a wallet
   * @param walletType the type of the wallet
   * @returns
   */
  public connect = async (walletType: WalletType): Promise<WalletAuth> => {
    const connector = this.connectors.get(walletType);

    if (!connector)
      throw new WalletConnectError(
        WalletConnectErrorCode.NoExistProvider,
        `No exist provider: ${walletType}`
      );
    console.debug(
      `check: isConnected ${WalletType[walletType]} ${connector.connected}`
    );
    const { principal } = await connector.connect();

    console.debug(
      `connect ${WalletType[walletType]} success, principal: ${principal}`
    );
    return {
      type: walletType,
      principal,
      // accountId: principalToAccountID(Principal.fromText(principal))
    };
  };

  /**
   * create a canister actor with wallet identity
   *
   * @param idl idl of the canister,didjs
   */
  public async createActor<T>(
    canisterId: string,
    idl: IDL.InterfaceFactory,
    walletType: WalletType
  ): Promise<ActorSubclass<T>> {
    const connector = this.connectors.get(walletType);

    if (!connector.connected && !(await connector.connect()))
      throw new WalletConnectError(
        WalletConnectErrorCode.NotConnected,
        `${WalletType[walletType]} not connected`
      );
    return connector.createActor(canisterId, idl);
  }

  disconnect = (type: WalletType) =>{
    console.log('disconnect', this.connectors.get(type))
    this.connectors.get(type)?.disconnect();
  } 
}
