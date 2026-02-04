import type { JWTPayload } from 'jose'

/**
 * JWT Token payload structure using standard JWT claims
 * - sub (subject): User ID
 * - sid (session ID): Session ID
 * - aud (audience): Hashed user agent string
 * - iss (issuer): Token issuer
 * - typ: Token type (access/refresh)
 * - nbf (not before): Token is valid from this time
 */
export interface JWTClaims extends JWTPayload {
  typ: 'access' | 'refresh' // Type - Token type (standard JWT claim)
  sid?: string // Session ID
}
