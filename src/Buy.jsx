import {useState, useEffect} from "react";
import Web3 from "web3";
import useLocalStorage from "./useLocalStorage";

const getTokens = ({account}) => {
	const url = new URL("https://api-rinkeby.etherscan.io/api");
	const params = new URLSearchParams();
	const arr = [
		["module", "account"],
		["action", "tokennfttx"],
		["contractaddress", "0x2ea648b73209817f48c3bb6bc8f28122c2aa27bd"],
		["address", account],
		["page", "1"],
		["offset", "100"],
		["sort", "asc"],
		["apikey", "MXSI1Z5CGYV1B2MK6PE2SNJHI83AI5RRQG"],
	];
	arr.forEach(([key, value]) => {
		params.append(key, value);
	});
	url.search = params.toString();
	return fetch(url)
		.then((res) => res.json())
		.then((res) => res.result);
};

const image = (
	<div>
		<img
			style={{maxWidth: "100%"}}
			loading="lazy"
			alt="TokenMBA v0.9.jpeg"
			src="https://images.squarespace-cdn.com/content/v1/610529496a328a3dd8acce64/1629879527689-Z9YAZAO8NET7XW2VS8CB/TokenMBA+v0.9.jpeg?format=2500w"
		/>
	</div>
);

export function Buy({metaState, account, contract}) {
	const [totalSupply, setTotalSupply] = useState();
	const [balance, setBalance] = useState(0);
	const [processing, setProcessing] = useState(false);
	const [transactionHash, setTransactionHash] =
		useLocalStorage("transactionHash.v1");
	const [tokens, setTokens] = useState([]);
	useEffect(() => {
		getTokens({account}).then((res) => {
			setTokens(res);
		});
	}, [account]);

	useEffect(() => {
		if (!transactionHash) return;

		metaState.web3.eth.getTransactionReceipt(
			transactionHash,
			(err, data) => {
				if (data && data.status) {
					setTransactionHash("");
				}
			},
		);
	}, [transactionHash, setTransactionHash, metaState.web3.eth]);

	useEffect(() => {
		async function run() {
			const balance = await contract.methods.balanceOf(account).call();
			setBalance(balance);
		}
		run();
	}, [account, contract]);

	useEffect(() => {
		async function run() {
			const totalSupply = await contract.methods.totalSupply().call();
			setTotalSupply(totalSupply);
		}
		run();
	}, [contract.methods]);

	// const tokens = new Array(balance).fill(1).map((_, index) => ({id: index}));

	const mint = async () => {
		try {
			setProcessing(true);
			await contract.methods
				.mint(1)
				.send({
					type: "0x2",
					value: Web3.utils.toWei("0.09", "ether"),
					from: account,
					// gasLimit:
				})
				.once("transactionHash", (hash) => {
					setTransactionHash(hash);
				});
			setProcessing(false);
			const [totalSupply, balance] = Promise.all([
				await contract.methods.totalSupply().call(),
				contract.methods.balanceOf(account).call(),
			]);
			setBalance(balance);
			setTotalSupply(totalSupply);
		} catch (error) {
			setProcessing(false);
			console.log(error);
		}
	};

	return (
		<div>
			<p>Balance: {balance}</p>

			{contract ? (
				<p className="sqs-block-button-container--center">
					<button
						className="sqs-block-button-element--medium sqs-block-button-element"
						onClick={mint}
						disabled={transactionHash || processing}
					>
						{transactionHash || processing
							? "Processing..."
							: "Buy NFT"}
					</button>
				</p>
			) : null}

			{totalSupply ? (
				<p style={{textAlign: "center"}}>
					<strong>{1000 - totalSupply} / 1000</strong> editions
					remaining
				</p>
			) : null}

			{transactionHash && metaState?.chain?.name ? (
				<p className="sqs-block-button-container--center">
					<a
						rel="noopener noreferrer"
						target="_blank"
						className="list-section-button sqs-block-button-element--medium"
						href={`https://${metaState.chain.name}.etherscan.io/tx/${transactionHash}`}
					>
						View on etherscan.io
					</a>
				</p>
			) : null}

			{tokens && tokens.length ? (
				<div className="row sqs-row">
					{tokens.map((token) => (
						<div className="col sqs-col-3 span-3">
							<div
								style={{
									paddingLeft: 6,
									paddingRight: 6,
									paddingBottom: 12,
								}}
							>
								<div>{image}</div>
								<h3 style={{marginTop: 10, marginBottom: 10}}>
									T-MBA #{token.tokenID}
								</h3>
								<div>
									<a
										rel="noopener noreferrer"
										target="_blank"
										className="list-section-button sqs-block-button-element--medium"
										href={`https://testnets.opensea.io/assets/0x2ea648b73209817f48c3bb6bc8f28122c2aa27bd/${token.tokenID}`}
									>
										View on opensea.io
									</a>
								</div>
							</div>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
}
