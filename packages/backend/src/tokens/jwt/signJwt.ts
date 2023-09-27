import runtime from '../../runtime';
import { base64url } from '../../util/rfc4648';
import { getCryptoAlgorithm, importKey } from './algorithms';

export interface SignJwtOptions {
  algorithm?: string;
  header?: Record<string, unknown>;
}

function encodeJwtData(value: unknown): string {
  const stringified = JSON.stringify(value);
  const encoder = new TextEncoder();
  const encoded = encoder.encode(stringified);
  return base64url.stringify(encoded, { pad: false });
}

export async function __unstable__signJwt(
  payload: Record<string, unknown>,
  secret: string | JsonWebKey,
  options: SignJwtOptions,
): Promise<string> {
  if (!options.algorithm) {
    throw new Error('No algorithm specified');
  }
  const encoder = new TextEncoder();

  const algorithm = getCryptoAlgorithm(options.algorithm);
  if (!algorithm) {
    throw new Error(`Unsupported algorithm ${options.algorithm}`);
  }

  const cryptoKey = await importKey(secret, algorithm, 'sign');
  const header = options.header || { typ: 'JWT' };
  header.alg = options.algorithm;

  const encodedHeader = encodeJwtData(header);
  const encodedPayload = encodeJwtData(payload);
  const firstPart = `${encodedHeader}.${encodedPayload}`;

  const signature = await runtime.crypto.subtle.sign(algorithm, cryptoKey, encoder.encode(firstPart));

  return `${firstPart}.${base64url.stringify(new Uint8Array(signature), { pad: false })}`;
}
