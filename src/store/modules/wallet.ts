import { create } from 'zustand'
import { ICConnector, WalletType } from '../../utils/connector';
import { IC_HOST, isLocalEnv, whiteLists } from '../../utils/config';

export interface WalletState {
  wallet: {
    principal: string;
    type: WalletType;
  };
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}
const connector = new ICConnector(IC_HOST, whiteLists, isLocalEnv());

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: {
    principal: null,
    type: null,
  },
  connectWallet: async () => {
    const auth = await connector.connect(WalletType.PlugWallet);
    set({ wallet: auth});
  },
  disconnectWallet: () => {
    // const { wallet } = get();
    connector.disconnect(WalletType.PlugWallet);
    set({ wallet: null });
  }
}));