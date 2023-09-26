import type QUnit from 'qunit';

import { pemEncodedPublicKey, publicJwks, signedJwt, someOtherPublicKey } from '../fixtures';
import { hasValidSignature } from '../jwt/hasValidSignature';
import { decodeJwt } from './verifyJwt';

export default (QUnit: QUnit) => {
  const { module, test } = QUnit;

  module('hasValidSignature(jwt, key)', () => {
    test('verifies the signature with a JWK formatted key', async assert => {
      assert.true(await hasValidSignature(decodeJwt(signedJwt), publicJwks));
    });

    test('verifies the signature with a PEM formatted key', async assert => {
      assert.true(await hasValidSignature(decodeJwt(signedJwt), pemEncodedPublicKey));
    });

    test('it returns false if the key is not correct', async assert => {
      assert.false(await hasValidSignature(decodeJwt(signedJwt), someOtherPublicKey));
    });
  });
};
