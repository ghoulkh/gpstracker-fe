import { createRoot } from "react-dom/client";
import './index.css';
import App from './App';
import { legacy_createStore as createStore } from 'redux'
import rootReducer from './ActionService'
import { Provider } from 'react-redux'
import {RecoilRoot} from "recoil";

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <RecoilRoot>
        <Provider store={store}>
            <App />
        </Provider>
    </RecoilRoot>

);