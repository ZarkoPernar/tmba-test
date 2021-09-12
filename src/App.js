import Web3 from "web3";
import {useCallback, useEffect} from "react";
import {useMetamask} from "use-metamask";
import {createPortal} from "react-dom";
import {Buy} from "./Buy";
import {DisplayAccount} from "./utils";
import useLocalStorage from "./useLocalStorage";
import {Menu, MenuList, MenuButton, MenuItem} from "@reach/menu-button";

export function Account({account}) {
	return account ? (
		<div style={{display: "flex", position: "relative"}}>
			<button
				style={{
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0,
					border: 0,
				}}
				className="btn btn--border theme-btn--primary-inverse"
			>
				Your Token
			</button>
			<Menu>
				<MenuButton
					className="btn btn--border theme-btn--primary-inverse"
					style={{
						marginLeft: 1,
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
						border: 0,
					}}
				>
					<span aria-hidden>▾</span>
				</MenuButton>
				<MenuList portal={true}>
					<MenuItem>
						<DisplayAccount account={account} />
					</MenuItem>
				</MenuList>
			</Menu>
		</div>
	) : null;
}

export default function App() {
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
					{!metaState.isConnected && !connection ? (
						<button
							style={{fontSize: 14}}
							className="btn btn--border theme-btn--primary-inverse"
							onClick={connect}
						>
							Connect Wallet
						</button>
					) : (
						<Account account={account} />
					)}
				</div>,
				navPortalTarget,
		  )
		: null;
	const buyPortalTarget = document.getElementById("tmba-portal-buy");
	const buyPortal = buyPortalTarget
		? createPortal(
				metaState.isConnected && account ? (
					<Buy metaState={metaState} account={account} />
				) : null,
				buyPortalTarget,
		  )
		: null;

	useEffect(() => {
		if (metaState.isAvailable && connection && !metaState.isConnected) {
			connect();
		}
	}, [metaState.isAvailable, connection]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			{navPortal}

			{buyPortal}
		</div>
	);
}
