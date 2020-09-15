// @flow
/*
    Pillar Wallet: the personal data locker
    Copyright (C) 2019 Stiftung Pillar Project

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
import { fetchPoolData } from 'services/uniswap';
import { UPDATE_POOL_DATA, SET_FETCHING_POOL_DATA } from 'constants/liquidityPoolsConstants';
import type { Dispatch } from 'reducers/rootReducer';

export const fetchPoolDataAction = (poolAddress: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: SET_FETCHING_POOL_DATA, payload: true });
    const poolData = await fetchPoolData(poolAddress);
    if (poolData?.pair) {
      dispatch({ type: UPDATE_POOL_DATA, payload: { poolAddress, poolData } });
    } else {
      dispatch({ type: SET_FETCHING_POOL_DATA, payload: false });
    }
  };
};
