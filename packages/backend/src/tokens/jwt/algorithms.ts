import runtime from '../../runtime';
import isomorphicAtob from '../../shared/isomorphicAtob';

const algToHash: Record<string, string> = {
  RS256: 'SHA-256',
  RS384: 'SHA-384',
  RS512: 'SHA-512',
};
const RSA_ALGORITHM_NAME = 'RSASSA-PKCS1-v1_5';

const jwksAlgToCryptoAlg: Record<string, string> = {
  RS256: RSA_ALGORITHM_NAME,
  RS384: RSA_ALGORITHM_NAME,
  RS512: RSA_ALGORITHM_NAME,
};

const algs = Object.keys(algToHash);

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#pkcs_8_import
function pemToBuffer(secret: string): ArrayBuffer {
  const trimmed = secret
    .replace(/-----BEGIN.*?-----/g, '')
    .replace(/-----END.*?-----/g, '')
    .replace(/\s/g, '');

  const decoded = isomorphicAtob(trimmed);

  const buffer = new ArrayBuffer(decoded.length);
  const bufView = new Uint8Array(buffer);

  for (let i = 0, strLen = decoded.length; i < strLen; i++) {
    bufView[i] = decoded.charCodeAt(i);
  }

  return bufView;
}

export function getCryptoAlgorithm(algorithmName: string): RsaHashedImportParams {
  const hash = algToHash[algorithmName];
  const name = jwksAlgToCryptoAlg[algorithmName];

  if (!hash || !name) {
    throw new Error(`Unsupported algorithm ${algorithmName}, expected one of ${algs.join(', ')}`);
  }

  return {
    hash: { name: algToHash[algorithmName] },
    name: jwksAlgToCryptoAlg[algorithmName],
  };
}

export function importKey(
  secret: JsonWebKey | string,
  algorithm: RsaHashedImportParams,
  keyUsage: 'verify' | 'sign',
): Promise<CryptoKey> {
  if (typeof secret === 'object') {
    return runtime.crypto.subtle.importKey('jwk', secret, algorithm, false, [keyUsage]);
  }

  const keyData = pemToBuffer(secret);
  const format = keyUsage === 'sign' ? 'pkcs8' : 'spki';

  return runtime.crypto.subtle.importKey(format, keyData, algorithm, false, [keyUsage]);
}
