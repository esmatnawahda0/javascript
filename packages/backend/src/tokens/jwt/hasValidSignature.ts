import type { Jwt } from '@clerk/types';

// DO NOT CHANGE: Runtime needs to be imported as a default export so that we can stub its dependencies with Sinon.js
// For more information refer to https://sinonjs.org/how-to/stub-dependency/
import runtime from '../../runtime';
import { getCryptoAlgorithm, importKey } from './algorithms';

export async function hasValidSignature(jwt: Jwt, key: JsonWebKey | string) {
  const { header, signature, raw } = jwt;
  const encoder = new TextEncoder();
  const data = encoder.encode([raw.header, raw.payload].join('.'));
  const algorithm = getCryptoAlgorithm(header.alg);

  const cryptoKey = await importKey(key, algorithm, 'verify');

  return runtime.crypto.subtle.verify(algorithm.name, cryptoKey, signature, data);
}
