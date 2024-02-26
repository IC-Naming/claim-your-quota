import * as IDS from './canister_ids.json';
import { isLocalEnv, isTestNetEnv } from './env';

const ENV = isLocalEnv() ? 'local' : isTestNetEnv() ? 'staging' : 'ic';
export const LEDGER_ID = IDS.ledger[ENV];
export const MARKET_ID = IDS.exchange[ENV];
export const BLIND_BOX_ID = IDS.blind_box[ENV];
export const DICP_ID = IDS.dicp[ENV];
export const DICP_MINTER_ID = IDS.dicp_minter[ENV];
export const DNS_ID = IDS.inmg[ENV];
export const IC_REGISTRAR_ID = IDS.ic_registrar[ENV];
export const IC_REGISTRY_ID = IDS.ic_registry[ENV];
export const IC_RESOLVER_ID = IDS.ic_resolver[ENV];
export const IC_FAVORITES_ID = IDS.ic_favorites[ENV];
export const ICP_REGISTRAR_ID = IDS.icp_registrar[ENV];
export const ICP_REGISTRY_ID = IDS.icp_registry[ENV];
export const ICP_RESOLVER_ID = IDS.icp_resolver[ENV];
export const ICP_FAVORITES_ID = IDS.icp_favorites[ENV];
