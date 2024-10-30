import { combineReducers } from 'redux';

// Front
import LayoutReducer from './layouts/reducer';

// Authentication
import AddressesReducer from './addresses/reducer';
import ForgetPasswordReducer from './auth/forgetpwd/reducer';
import ProfileReducer from './auth/profile/reducer';
import AccountReducer from './auth/register/reducer';
import Auth2Reducer from './auth2/reducer';
import BlockchainReducer from './blockchainContracts/reducer';
import DataReducer from './transactions/reducer';
// API Key
import APIKeyReducer from './apiKey/reducer';
// Address Name
import AddressNameReducer from './addressName/reducer';

// USER ADDRESSES

import userWalletsReducer from './userWallets/reducer';
// Selected Network
import NetworkTypeReducer from './networkType/reducer';

import JobsReducer from './jobs/reducer';

import NotificationsReducer from './notifications/reducer';

import CommonReducer from './fixedData/reducer';

import LayoutMenuDataReducer from './layoutMenuData/reducer';

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Account: AccountReducer,
  ForgetPassword: ForgetPasswordReducer,
  Profile: ProfileReducer,
  blockchainContracts: BlockchainReducer,
  APIKey: APIKeyReducer,
  auth: Auth2Reducer,
  fetchData: DataReducer,
  addresses: AddressesReducer,
  addressName: AddressNameReducer,
  networkType: NetworkTypeReducer,
  userWallets: userWalletsReducer,
  jobs: JobsReducer,
  notifications: NotificationsReducer,
  Common: CommonReducer,
  layoutMenuData: LayoutMenuDataReducer,
});

export default rootReducer;
