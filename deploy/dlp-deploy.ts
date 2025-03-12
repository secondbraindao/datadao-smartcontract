import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deployProxy, verifyProxy } from "./helpers";
import { parseEther } from "../utils/helpers";

// get the contract abi
let DAT = require("../token/DAT.json");
const implementationContractName = "DataLiquidityPoolImplementation";
const proxyContractName = "DataLiquidityPoolProxy";
const proxyContractPath =
  "contracts/dlp/DataLiquidityPoolProxy.sol:DataLiquidityPoolProxy";
const tokenAddress = process.env.TOKEN_ADDRESS ?? "";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const [deployer] = await ethers.getSigners();

  const ownerAddress = process.env.OWNER_ADDRESS ?? deployer.address;
  const trustedForwarder =
    process.env.TRUSTED_FORWARDER_ADDRESS ?? deployer.address;

  const teePoolContractAddress = process.env.TEE_POOL_CONTRACT_ADDRESS ?? "";
  const dataRegistryContractAddress =
    process.env.DATA_REGISTRY_CONTRACT_ADDRESS ?? "";

  const dlpPublicKey = process.env.DLP_PUBLIC_KEY ?? "publicKey";
  const proofInstruction =
    process.env.DLP_PROOF_INSTRUCTION ?? "proofInstruction";
  const dlpName = process.env.DLP_NAME ?? "DLP Name";
  const dlpFileRewardFactor =
    process.env.DLP_FILE_REWARD_FACTOR ?? parseEther(1);

  // Validate environment variables
  if (!process.env.TOKEN_ADDRESS) {
    throw new Error("TOKEN_ADDRESS environment variable is not set");
  }
  if (!process.env.OWNER_ADDRESS) {
    throw new Error("OWNER_ADDRESS environment variable is not set");
  }
  if (!process.env.TRUSTED_FORWARDER_ADDRESS) {
    throw new Error("TRUSTED_FORWARDER_ADDRESS environment variable is not set");
  }
  if (!process.env.TEE_POOL_CONTRACT_ADDRESS) {
    throw new Error("TEE_POOL_CONTRACT_ADDRESS environment variable is not set");
  }
  if (!process.env.DATA_REGISTRY_CONTRACT_ADDRESS) {
    throw new Error("DATA_REGISTRY_CONTRACT_ADDRESS environment variable is not set");
  }
  if (!process.env.DLP_PUBLIC_KEY) {
    throw new Error("DLP_PUBLIC_KEY environment variable is not set");
  }
  if (!process.env.DLP_PROOF_INSTRUCTION) {
    throw new Error("DLP_PROOF_INSTRUCTION environment variable is not set");
  }
  if (!process.env.DLP_NAME) {
    throw new Error("DLP_NAME environment variable is not set");
  }
  if (!process.env.DLP_FILE_REWARD_FACTOR) {
    throw new Error("DLP_FILE_REWARD_FACTOR environment variable is not set");
  }

  console.log(``);
  console.log(``);
  console.log(``);
  console.log(`**************************************************************`);
  console.log(`**************************************************************`);
  console.log(`**************************************************************`);

  const token = new ethers.Contract(tokenAddress, DAT.abi, deployer);

  const params = {
    trustedForwarder: trustedForwarder,
    ownerAddress: ownerAddress,
    name: dlpName,
    dataRegistryAddress: dataRegistryContractAddress,
    teePoolAddress: teePoolContractAddress,
    tokenAddress: token.target,
    publicKey: dlpPublicKey,
    proofInstruction: proofInstruction,
    fileRewardFactor: dlpFileRewardFactor,
  };

  const proxyDeploy = await deployProxy(
    deployer,
    proxyContractName,
    implementationContractName,
    [params],
  );

  await verifyProxy(
    proxyDeploy.proxyAddress,
    proxyDeploy.implementationAddress,
    proxyDeploy.initializeData,
    proxyContractPath,
  );

  console.log(``);
  console.log(``);
  console.log(``);
  console.log(`**************************************************************`);
  console.log(`**************************************************************`);
  console.log(`**************************************************************`);

  return;
};

export default func;
func.tags = ["DLPDeploy"];
