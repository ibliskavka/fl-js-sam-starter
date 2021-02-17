import { Auth } from "aws-amplify";
import { getLogger, Logger } from "./LoggingService";

interface ICognitoConfig {
    userPoolId: string;
    identityPoolId: string;
    clientId: string;
    domain: string;
    identityProvider: string;
}

export default class ConfigurationService {
    private logger: Logger;

    // These properties are assigned from config.json
    environment: string;
    region: string;
    apiUrl: string;
    cognito: ICognitoConfig;
    buildTime: number;
    version: string;

    constructor() {
        this.logger = getLogger("ConfigurationService");
    }

    public async load() {
        const response = await fetch("config.json");
        const cfg = await response.json();
        Object.assign(this, cfg);
        this.logger.debug("Config Loaded");
        this.configureAmplify();
    }

    get loginUrl(): string {
        return window.location.origin;
    }

    private configureAmplify(): void {
        const options = {
            Auth: {
                region: this.region,
                identityPoolId: this.cognito.identityPoolId,
                userPoolId: this.cognito.userPoolId,
                userPoolWebClientId: this.cognito.clientId,
                mandatorySignIn: false,
                oauth: {
                    domain: this.cognito.domain,
                    scope: ["email", "openid"],
                    redirectSignIn: this.loginUrl,
                    redirectSignOut: `${window.location.origin}/logout`,
                    responseType: "code",
                },
            },
        };

        // https://github.com/aws-amplify/amplify-js/issues/4315
        Auth.configure(options);
    }
}
