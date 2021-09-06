import Web3 from "web3";
import ABI from "./ABI";
import {useCallback, useEffect, useState} from "react";
import {useMetamask} from "use-metamask";
import {createPortal} from "react-dom";
import {Buy} from "./Buy";
import {DisplayAccount} from "./utils";
import useLocalStorage from "./useLocalStorage";

export default function App() {
	const [contract, setContract] = useState();
	const {connect: metaConnect, metaState} = useMetamask();
	const [connection, setConnection] = useLocalStorage("connection.v1");
	const connect = useCallback(async () => {
		await metaConnect(Web3);
		setConnection(Date.now());
	}, [metaConnect, setConnection]);
	const account = metaState.account[0];
	const navPortalTarget = document.getElementById("tmba-portal-nav");
	const navPortal = navPortalTarget
		? createPortal(
				<div style={{color: "white", fontSize: 16}}>
					{!metaState.isConnected ? (
						<button
							style={{fontSize: 14}}
							className="btn btn--border theme-btn--primary-inverse"
							onClick={connect}
						>
							Connect Wallet
						</button>
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
		if (metaState.isAvailable && connection && !metaState.isConnected) {
			connect();
		}
	}, [metaState.isAvailable, connection]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		async function run() {
			if (!metaState.isConnected) return;
			const contractAddress =
				"0x2ea648b73209817f48c3bb6bc8f28122c2aa27bd";
			const c = new metaState.web3.eth.Contract(ABI, contractAddress);
			setContract(c);
		}
		run();
	}, [metaState.isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			{navPortal}

			{buyPortal}
		</div>
	);
}
