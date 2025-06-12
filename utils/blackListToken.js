const blacklistedTokens = new Set();

module.exports = {
    add: (token) => blacklistedTokens.add(token),
    has: (token) => blacklistedTokens.has(token),
};