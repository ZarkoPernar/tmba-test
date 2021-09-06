import {useState} from "react";

/**
 * A custom hook for persisting variables like authState using localStorage
 * @param key String name of the variable to be stored
 * @param initialValue Stringifiable value to be used to initialise the storage
 * @returns {*[]} storedValue: value of the variable, setValue: fn to update the storage value
 */
const useLocalStorage = (key, initialValue) => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.log(error);
			return initialValue;
		}
	});

	/**
	 * Function used to update the stored value
	 * We allow passing the actual updated value as well as a function to update
	 * the existing value here to keep the hook in line with how useState works
	 * Ref: https://reactjs.org/docs/hooks-reference.html#functional-updates
	 * @param valueUpdate
	 */
	const setValue = (valueUpdate) => {
		try {
			const updatedValue =
				valueUpdate instanceof Function
					? valueUpdate(storedValue)
					: valueUpdate;
			setStoredValue(updatedValue);
			if (updatedValue !== null && updatedValue !== undefined) {
				window.localStorage.setItem(key, JSON.stringify(updatedValue));
			} else {
				window.localStorage.removeItem(key);
			}
		} catch (error) {
			// TODO send to Sentry
			console.log(error);
		}
	};

	return [storedValue, setValue];
};

export default useLocalStorage;
