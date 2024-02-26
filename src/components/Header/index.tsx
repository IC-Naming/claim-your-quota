import { WalletState, useWalletStore } from '../../store';
import logo from '/logo.svg';
const formatAddress = (walletAddress = '') =>
  walletAddress?.slice(0, 5) + '...' + walletAddress?.slice(-3);

const WalletButton = ({ isConnected, onConnect, onDisconnect, principal }) => {
  if (isConnected) {
    return (
      <div>
        <span className='wallet-principal'>{formatAddress(principal)}</span>
        <button type="button" className='btn app-btn' onClick={onDisconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <button type="button" className='btn app-btn' onClick={onConnect}>Connect</button>
  );
};

const Header = () => {
  const { wallet, connectWallet, disconnectWallet } = useWalletStore((state: WalletState) => ({
    wallet: state.wallet,
    connectWallet: state.connectWallet,
    disconnectWallet: state.disconnectWallet,
  }));
  const principal = wallet && wallet.principal;
  return (
    <div className="navbar fixed-top bg-body-tertiary">
      <div className="container-fluid app-header">
        <a className="navbar-brand">
          <img src={logo} className="logo" alt="icnaming logo" />
        </a>
        <div className="text-end">
          <WalletButton
            isConnected={!!principal}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            principal={principal}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;