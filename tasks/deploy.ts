import { ethers } from 'ethers'
import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as types from 'hardhat/internal/core/params/argumentTypes'

task('deploy-erc20')
  .setAction(
    async (args: any, hre: HardhatRuntimeEnvironment) => {
      const deployer = await hre.ethers.getSigner()
      const { deploy } = hre.deployments;

      console.log('Deploying the contract')
      const deployedContract = await deploy('MyERC20', {
        from: deployer.address,
        log: true,
      });

      console.log(`deployed: ${deployedContract.address}`)
    }
  )
