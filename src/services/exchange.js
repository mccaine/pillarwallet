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
import { EXCHANGE_URL } from 'react-native-dotenv';
import SocketIO from 'socket.io-client';

import type { OfferRequest, TokenAllowanceRequest } from 'models/Offer';
import { extractJwtPayload, getRandomString } from 'utils/common';

const executeCallback = (data?: any, callback?: Function) => {
  if (typeof callback === 'function') callback(data);
};

const buildApiUrl = (path: string) => {
  return `${EXCHANGE_URL}/${path}`;
};

export default class ExchangeService {
  io: SocketIO;
  isConnected: boolean;
  apiConfig: Object;
  tokens: Object;

  connect(accessToken: string, shapeshiftAccessToken?: string) {
    this.stop();
    this.tokens = {
      accessToken,
      shapeshiftAccessToken,
    };
    try {
      this.apiConfig = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
      if (!!shapeshiftAccessToken
        && shapeshiftAccessToken !== '') {
        this.apiConfig.headers = {
          ...this.apiConfig.headers,
          token: shapeshiftAccessToken,
        };
      }
      const wsUrl = EXCHANGE_URL
        .replace(/(https:\/\/)/gi, 'wss://')
        .replace(/(http:\/\/)/gi, 'ws://');
      this.io = new SocketIO(`${wsUrl}:443`, {
        transports: ['websocket'],
        query: {
          token: accessToken,
        },
      });
      this.io.on('disconnect', () => {
        this.setConnected(false);
      });
      this.io.on('error', () => {
        this.setConnected(false);
      });
      this.io.on('connect', () => {
        this.setConnected(true);
      });
    } catch (e) {
      this.setConnected(false);
    }
  }

  stop() {
    this.setConnected(false);
    if (this.io) {
      this.io.close();
      this.io.on('close', () => {
        delete this.io;
      });
    }
  }

  setConnected(value: boolean) {
    this.isConnected = value;
  }

  connected(): boolean {
    return this.isConnected && !!this.io;
  }

  onOffers(callback?: Function) {
    /**
     * may not be connected yet, but event bind can already be done
     * if client is created, however, cannot put this as callback on connect event
     * as it's not recommended since it will be fired each time websocket is reconnected,
     * (see – https://socket.io/docs/client-api/#Event-%E2%80%98connect%E2%80%99)
     */
    if (!this.io) return;
    this.io.off('offers').on('offers', data => executeCallback(data, callback));
  }

  resetOnOffers() {
    if (!this.io) return;
    this.io.off('offers');
  }

  requestOffers(fromAssetCode: string, toAssetCode: string) {
    const urlPath = `offers?name=${fromAssetCode}-${toAssetCode}`;
    return fetch(buildApiUrl(urlPath), this.apiConfig)
      .then(response => response.text())
      .then(response => response.toLowerCase() === 'ok' ? {} : JSON.parse(response))
      .catch(error => ({ error }));
  }

  takeOffer(order: OfferRequest) {
    return fetch(buildApiUrl('orders'), {
      ...this.apiConfig,
      method: 'POST',
      body: JSON.stringify(order),
    })
      .then(response => response.json())
      .catch(error => ({ error }));
  }

  setTokenAllowance(request: TokenAllowanceRequest) {
    return fetch(buildApiUrl('orders/allowance'), {
      ...this.apiConfig,
      method: 'POST',
      body: JSON.stringify(request),
    })
      .then(response => response.json())
      .catch(error => ({ error }));
  }

  getShapeshiftAuthUrl() {
    const { sub: regId } = extractJwtPayload(this.tokens.accessToken) || {};
    const sessionId = getRandomString();
    const urlPath = `authorize?sessionID=${sessionId}&regId=${regId}`;
    return buildApiUrl(urlPath);
  }

  getShapeshiftAccessToken(tokenHash: string) {
    const urlPath = `gettoken?hash=${tokenHash}`;
    return fetch(buildApiUrl(urlPath), this.apiConfig)
      .then(response => response.json())
      .catch(error => ({ error }));
  }
}