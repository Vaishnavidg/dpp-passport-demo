export const WatrMainnet = {
  id: 192,
  name: "WatrMainnet",
  network: "WatrMainnet",
  nativeCurrency: {
    decimals: 18,
    name: "WATR",
    symbol: "WATR",
  },
  rpcUrls: {
    default: {
      http: [
        "https://rpc.watr.org/ext/bc/EypLFUSzC2wdbFJovYS3Af1E7ch1DJf7KxKoGR5QFPErxQkG1/rpc",
      ],
    },
    public: {
      http: ["https://rpc.watr.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "WATR Explorer",
      url: "https://explorer.watr.org",
    },
  },
};
