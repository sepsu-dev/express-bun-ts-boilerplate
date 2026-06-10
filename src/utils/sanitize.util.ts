/**
 * Removes the `password` field from an object.
 * Useful for sanitizing profile/user objects before sending to client.
 *
 * @example
 * const safe = omitPassword(profile);
 * // safe no longer has a `password` property
 */
export const omitPassword = <T extends { password?: string | null }>(obj: T): Omit<T, 'password'> => {
    const { password: _omit, ...safe } = obj;
    return safe;
};