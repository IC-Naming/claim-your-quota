/*
 * @Email: allen0101stanton@outlook.com
 * @Author: Eric
 * @Description: 
 */
import {
  BLIND_BOX_ID,
  DICP_ID,
  DICP_MINTER_ID,
  ICP_FAVORITES_ID,
  ICP_REGISTRAR_ID,
  ICP_REGISTRY_ID,
  ICP_RESOLVER_ID,
  IC_FAVORITES_ID,
  IC_REGISTRAR_ID,
  IC_REGISTRY_ID,
  IC_RESOLVER_ID,
  DNS_ID,
  LEDGER_ID,
  MARKET_ID
} from './';

const getWhiteLists = () => {
  return [
    LEDGER_ID,
    ICP_REGISTRAR_ID,
    ICP_REGISTRY_ID,
    ICP_RESOLVER_ID,
    ICP_FAVORITES_ID,
    IC_REGISTRAR_ID,
    IC_REGISTRY_ID,
    IC_RESOLVER_ID,
    IC_FAVORITES_ID,
    DICP_ID,
    DICP_MINTER_ID,
    DNS_ID,
    MARKET_ID,
    BLIND_BOX_ID
  ];
};

export const whiteLists = getWhiteLists();
