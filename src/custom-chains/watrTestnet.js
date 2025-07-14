
export const watrTestnet = {
    id: 92870,
    name: 'watrTestnet',
    network: 'watrTestnet',
    nativeCurrency: {
      decimals: 18,
      name: 'WATR',
      symbol: 'WATR'
    },
    rpcUrls: {
      default: {
        http: ['https://rpc-watr-testnet.cogitus.io/QbqyUC5QXwBU23/ext/bc/2ZZiR6T2sJjebQguABb53rRpzme8zfK4R9zt5vMM8MX1oUm3g/rpc'], 
      },
      public: {
        http: ['https://rpc-watr-testnet.cogitus.io'],
      },
    },
    blockExplorers: {
      default: {
        name: 'WATR Explorer',
        url: 'https://explorer-watr-testnet.cogitus.io',
      },
    },
    testnet: true,
  }