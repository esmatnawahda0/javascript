import type QUnit from 'qunit';

import {
  mockJwtHeader,
  mockJwtPayload,
  pemEncodedPublicKey,
  pemEncodedSignKey,
  publicJwks,
  signingJwks,
} from '../fixtures';
import { hasValidSignature } from './hasValidSignature';
import { __unstable__signJwt } from './signJwt';
import { decodeJwt } from './verifyJwt';

export default (QUnit: QUnit) => {
  const { module, test } = QUnit;

  module('signJwt(payload, options)', () => {
    test('signs a JWT with a JWK formatted secret', async assert => {
      const jwt = await __unstable__signJwt(mockJwtPayload, signingJwks, {
        algorithm: mockJwtHeader.alg,
        header: mockJwtHeader,
      });

      assert.true(await hasValidSignature(decodeJwt(jwt), publicJwks));
    });

    test('signs a JWT with a pkcs8 formatted secret', async assert => {
      const jwt = await __unstable__signJwt(mockJwtPayload, pemEncodedSignKey, {
        algorithm: mockJwtHeader.alg,
        header: mockJwtHeader,
      });

      assert.true(await hasValidSignature(decodeJwt(jwt), pemEncodedPublicKey));
    });
  });
};
