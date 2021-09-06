import Web3 from "web3";
import ABI from "./ABI";
import {useEffect, useState} from "react";
import {useMetamask} from "use-metamask";
import {createPortal} from "react-dom";
import {Buy} from "./Buy";
import {DisplayAccount, formatAccount} from "./utils";

export default function App() {
	const [contract, setContract] = useState();
	const {connect: metaConnect, metaState} = useMetamask();
	const connect = async () => {
		const res = await metaConnect(Web3);
		console.log(res);
	};
	const account = metaState.account[0];
	const navPortalTarget = document.getElementById("tmba-portal-nav");
	const navPortal = navPortalTarget
		? createPortal(
				<div style={{color: "white"}}>
					{!metaState.isConnected ? (
						<button onClick={connect}>Connect Wallet</button>
					) : (
						<DisplayAccount account={account} />
					)}
				</div>,
				navPortalTarget,
		  )
		: null;
	const buyPortalTarget = document.getElementById("tmba-portal-buy");
	const buyPortal = buyPortalTarget
		? createPortal(
				contract && metaState.isConnected && account ? (
					<Buy
						contract={contract}
						metaState={metaState}
						account={account}
					/>
				) : null,
				buyPortalTarget,
		  )
		: null;

	useEffect(() => {
		if (metaState.isAvailable) {
			connect();
		}
	}, [metaState.isAvailable]);

	useEffect(() => {
		async function run() {
			if (!metaState.isConnected) return;
			const contractAddress =
				"0x2ea648b73209817f48c3bb6bc8f28122c2aa27bd";
			const c = new metaState.web3.eth.Contract(ABI, contractAddress);
			setContract(c);
		}
		run();
	}, [metaState.isConnected]);

	return (
		<div>
			{navPortal}

			{buyPortal}
		</div>
	);
}
