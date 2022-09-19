import Web3Modal from "web3modal";


const getSSXConfig = async () => {
	const driver = await new Web3Modal().connect();

  return { 
		provider: {
			web3: { driver },
			backend: { host: process.env.REACT_APP_SSX_METRICS_SERVER ?? "" },
		},
  };
};

export default getSSXConfig; 