export function formatAccount(account) {
	return `${account.slice(0, 6)}...${account.slice(account.length - 4)}`;
}

export function DisplayAccount({account}) {
	return account ? formatAccount(account) : null;
}
