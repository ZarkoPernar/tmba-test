import React from "react";
import {useMetamask} from "use-metamask";
import {DisplayAccount} from "./utils";

export function Header() {
	const {metaState} = useMetamask();
	const account = metaState.account[0];

	return (
		<div>
			<DisplayAccount account={account} />
		</div>
	);
}
