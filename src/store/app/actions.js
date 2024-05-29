import store from "~/store";
import { _setError, _setImage } from "~/store/app";

export const setImage = (data) => store.dispatch(_setImage(data));
export const setError = (data) => store.dispatch(_setError(data));
