import React from "react";
import ConfigurationService from "../services/ConfigurationService";
import { ApiClient } from "../services/ApiClient";

export interface IAppContext {
    authenticated: boolean;
    groups: string[];
    config: ConfigurationService;
    api: ApiClient;
}

const defaultContext: IAppContext = {
    authenticated: false,
    groups: [],
    config: null as any,
    api: null as any,
};
const AppContext = React.createContext(defaultContext);

export default AppContext;
