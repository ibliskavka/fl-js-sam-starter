import React, { Component } from "react";
import AppContext, { IAppContext } from "./AppContext";
import ConfigurationService from "../services/ConfigurationService";
import AmplifyService from "../services/AmplifyService";
import { Hub } from "aws-amplify";
import { ApiClient } from "../services/ApiClient";
import { getLogger } from "../services/LoggingService";
import { Message } from "semantic-ui-react";

interface IState {
    status: "Loading" | "Authentication Failed" | "Ready";
    error: string;
    context: IAppContext;
}
export class AppContextProvider extends Component<{}, IState> {
    logger = getLogger("AppContextProvider");
    cfg: ConfigurationService;

    constructor(props: any) {
        super(props);

        this.cfg = new ConfigurationService();

        this.state = {
            status: "Loading",
            error: "",
            context: {
                authenticated: false,
                groups: [],
                config: null,
                api: null,
            },
        };

        this.authListener = this.authListener.bind(this);
    }

    async componentDidMount() {
        try {
            await this.cfg.load();
            Hub.listen("auth", this.authListener);
            const repo = new ApiClient(this.cfg);
            const authenticated = await AmplifyService.isAuthenticated();
            const groups = await AmplifyService.getUserGroups();

            this.setState({
                ...this.state,
                status: "Ready",
                context: {
                    authenticated: authenticated,
                    groups,
                    config: this.cfg,
                    api: repo,
                },
            });

            if (window.location.href.indexOf("?code=") > -1) {
                this.logger.debug("Processing authentication.");
            }

        } catch (error) {
            this.logger.error(`Configuration Failed: ${error.message}`, error);
        }
    }

    authListener(data: any) {
        this.logger.debug("authListener event", data.payload.event, data);
        switch (data.payload.event) {
            case "signIn":
                this.setState({
                    ...this.state,
                    status: "Ready",
                    context: { ...this.state.context, authenticated: true },
                });
                break;
            case "signIn_failure":
                this.logger.error("signIn_failure", JSON.stringify(data.payload));
                this.setState({
                    ...this.state,
                    status: "Authentication Failed",
                    context: { ...this.state.context, authenticated: false },
                });
                break;
            default:
                break;
        }
    }

    render() {
        if (this.state.error) {
            return (
                <Message error>
                    <p>{this.state.error}</p>
                </Message>
            );
        }
        if (!this.state.context.config) {
            return (
                <div>
                    <p>{this.state.status}</p>
                </div>
            );
        }
        return <AppContext.Provider value={this.state.context}>{this.props.children}</AppContext.Provider>;
    }
}
