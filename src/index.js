import React, {StrictMode} from "react";
import ReactDOM from "react-dom";
import {MetamaskStateProvider, store} from "use-metamask";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@reach/menu-button/styles.css";
import "./App.css";

const root = document.createElement("div");
document.body.append(root);

ReactDOM.render(
	<MetamaskStateProvider store={store}>
		<StrictMode>
			<App />
		</StrictMode>
	</MetamaskStateProvider>,
	root,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
