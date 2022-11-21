import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from 'dotenv'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import "@nomiclabs/hardhat-etherscan";
import 'hardhat-deploy';
import './tasks'

dotenv.config()

const config: HardhatUserConfig = {
  mocha: {
    timeout: 20000,
  },
  solidity: "0.8.0",
  networks: {
    hardhat: {
      live: false,
      saveDeployments: false,
    },
    goerli: {
      live: true,
      chainId: 5,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
    },
    goerli_tokamak: {
      chainId: 5050,
      url: 'https://goerli.optimism.tokamak.network',
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
    }
  },
};

export default config;
