import { Contract, Wallet, providers, BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { expect } from 'chai'
import { getContractFactory } from '@eth-optimism/contracts'
import { OptimismEnv } from './shared/env'
import { asL2Provider, CrossChainMessenger, MessageStatus } from '@eth-optimism/sdk'

describe('L1-L2 test', async () => {
  let l1Provider
  let l2Provider

  let user1L1: Wallet
  let user2L1: Wallet
  let user1L2: Wallet
  let user2L2: Wallet

  let messenger: CrossChainMessenger


  let env: OptimismEnv

  let L1Factory__ERC20: ContractFactory
  let L2Factory__ERC20: ContractFactory

  let L1__ERC20: Contract
  let L2__ERC20: Contract

  let otherWalletL1: Wallet
  let otherWalletL2: Wallet

  before(async () => {
    l1Provider = new providers.JsonRpcProvider('http://127.0.0.1:9545')
    l2Provider = asL2Provider(new providers.JsonRpcProvider('http://127.0.0.1:8545'))

    const pk = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

    user1L1 = new Wallet(pk, l1Provider)
    user2L1 = Wallet.createRandom().connect(l1Provider)
    user1L2 = user1L1.connect(l2Provider)
    user2L2 = user2L1.connect(l2Provider)

    messenger = new CrossChainMessenger({
      l1SignerOrProvider: user1L1,
      l2SignerOrProvider: user1L2,
      l1ChainId: await getChainId(l1Provider),
      l2ChainId: await getChainId(l2Provider),
    })

    L1Factory__ERC20 = await ethers.getContractFactory('MyERC20', user1L1)
    L2Factory__ERC20 = getContractFactory('L2StandardERC20', user1L2)

    L1__ERC20 = await L1Factory__ERC20.deploy()
    await L1__ERC20.deployed()

    L2__ERC20 = await L2Factory__ERC20.deploy(
      '0x4200000000000000000000000000000000000010',
      L1__ERC20.address,
      'OVM Test',
      'OVM'
    )
    await L2__ERC20.deployed()

    const tx = await L1__ERC20.approve(
      messenger.contracts.l1.L1StandardBridge.address,
      1000000
    )
    await tx.wait()
  })

  it('should deposit tokens into L2', async () => {
    const balance1 = await L1__ERC20.balanceOf(user1L1.address)
    const depositAmount = 1000
    await messenger.waitForMessageReceipt(
      await messenger.depositERC20(
        L1__ERC20.address,
        L2__ERC20.address,
        depositAmount
      )
    )

    expect(balance1.sub(await L1__ERC20.balanceOf(user1L1.address))).to.deep.equal(
      BigNumber.from(depositAmount)
    )
    expect(await L2__ERC20.balanceOf(user1L2.address)).to.deep.equal(
      BigNumber.from(depositAmount)
    )
  })

  it('should transfer tokens on L2', async () => {
    const tx = await L2__ERC20.transfer(user2L1.address, 500)
    await tx.wait()

    expect(await L2__ERC20.balanceOf(user1L2.address)).to.deep.equal(
      BigNumber.from(500)
    )
    expect(await L2__ERC20.balanceOf(user2L2.address)).to.deep.equal(
      BigNumber.from(500)
    )
  })

  it('should withdraw tokens from L2 to the depositor', async () => {
    const balance1 = await L1__ERC20.balanceOf(user1L1.address)
    const withdrawAmount = 500
    const tx = await messenger.withdrawERC20(
      L1__ERC20.address,
      L2__ERC20.address,
      withdrawAmount
    )

    await messenger.waitForMessageStatus(
      tx,
      MessageStatus.READY_FOR_RELAY
    )

    //await messenger.finalizeMessage(tx)
    await messenger.waitForMessageReceipt(tx)

    expect((await L1__ERC20.balanceOf(user1L1.address)).sub(balance1)).to.deep.equal(
      BigNumber.from(withdrawAmount)
    )
    expect(await L2__ERC20.balanceOf(user1L2.address)).to.deep.equal(
      BigNumber.from(0)
    )
  })
})
