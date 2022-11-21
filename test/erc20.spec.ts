import { Contract, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { expect } from 'chai'

describe('Basic ERC20 interactions', async () => {
  let user1: Wallet
  let user2: Wallet
  let owner: SignerWithAddress
  let myERC20: Contract

  before(async () => {
    [owner] = await ethers.getSigners();
    user1 = Wallet.createRandom().connect(ethers.provider)
    user2 = Wallet.createRandom().connect(ethers.provider)

    const myERC20Factory = await ethers.getContractFactory("MyERC20");

    myERC20 = await myERC20Factory.deploy();
    console.log(`MyERC20 address: ${myERC20.address}`)
  })

  it('basic test', async () => {
    const name = await myERC20.name()
    expect(name).to.equal('MyERC20')

    const symbol = await myERC20.symbol()
    expect(symbol).to.equal('MERC')

    const balance = await myERC20.balanceOf(user1.address)
    expect(balance.toNumber()).to.equal(0)
  })

  it('mint', async () => {
    const mintAmount = 1000
    const balance1 = await myERC20.balanceOf(owner.address)
    await myERC20.mint(owner.address, mintAmount)
    const balance2 = await myERC20.balanceOf(owner.address)

    expect(balance2.sub(balance1)).to.equal(mintAmount)
  })

  it('transfer', async () => {
    const transferAmount = 10
    const user1Balance1 = await myERC20.balanceOf(owner.address)
    const user2Balance1 = await myERC20.balanceOf(user2.address)

    await myERC20.transfer(user2.address, transferAmount)

    const user1Balance2 = await myERC20.balanceOf(owner.address)
    const user2Balance2 = await myERC20.balanceOf(user2.address)

    expect(user1Balance1.sub(user1Balance2)).to.equal(transferAmount)
    expect(user2Balance2.sub(user2Balance1)).to.equal(transferAmount)
  })
})
