import { ethers } from 'ethers'
import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as types from 'hardhat/internal/core/params/argumentTypes'

task('transfer-erc20')
  .setAction(
    async (args: any, hre: HardhatRuntimeEnvironment) => {
      const deployer = await hre.ethers.getSigner()
      const receiver = '0x0000000000000000000000000000000000000001';
      const factory = await hre.ethers.getContractFactory('MyERC20');

      let tokenAddress: string;
      if (hre.network.config.chainId == 5) {
        tokenAddress = process.env.TOKEN_ADDRESS_L1
      } else {
        tokenAddress = process.env.TOKEN_ADDRESS_L2
      }
      const token = await factory.attach(
        tokenAddress
      );

      const balanceSender1 = await token.balanceOf(deployer.address);
      const balanceReceiver1 = await token.balanceOf(receiver);
      console.log(`sender balance: ${balanceSender1}`);
      console.log(`receiver balance: ${balanceReceiver1}`);

      const tx = await token.transfer(receiver, 1);
      await tx.wait();

      const balanceSender2 = await token.balanceOf(deployer.address);
      const balanceReceiver2 = await token.balanceOf(receiver);
      console.log(`sender balance: ${balanceSender2}`);
      console.log(`receiver balance: ${balanceReceiver2}`);

      console.log('Done');
    }
  )
