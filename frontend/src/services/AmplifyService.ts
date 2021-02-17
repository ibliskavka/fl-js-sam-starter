import Auth from "@aws-amplify/auth";
import { CognitoIdToken } from "amazon-cognito-identity-js";
import { getLogger } from "./LoggingService";

const logger = getLogger("AmplifyService");

/**
 * Provides helpers for working with Amplify
 */
export default abstract class AmplifyService {
  public static async logout(): Promise<void> {
    await Auth.signOut();
    this.federatedLogin();
  }

  public static async sdkCredentials(): Promise<any> {
    try {
      const credentials = await Auth.currentUserCredentials();
      return Auth.essentialCredentials(credentials);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public static async isAuthenticated(): Promise<boolean> {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch (error) {
      logger.error("isAuthenticated()", error);
      return false;
    }
  }

  public static async getUserId(): Promise<string> {
    const user = (await Auth.currentSession()).getIdToken().decodePayload();

    let email = null;
    if (user.identities && user.identities.length > 0) {
      // Federated Auth
      email = user.identities[0].userId;
    } else {
      // User Pool Auth
      email = user.email;
    }

    return email;
  }

  public static async getUserGroups(): Promise<string[]> {
    try {
      const groups = (await Auth.currentSession()).getIdToken().decodePayload()["cognito:groups"];
      return groups ? groups : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Initiates federated sign-in. When custom provider is passed in, will redirect to IDP without showing hosted ui.
   * @param customProvider Cognito Identity Provider Id
   */
  public static federatedLogin(customProvider?: string) {
    if (customProvider) {
      Auth.federatedSignIn({
        customProvider,
      });
    } else {
      Auth.federatedSignIn();
    }
  }

  public static async getAccessJwtToken(): Promise<string> {
    const session = Auth.currentSession();
    const accessToken = (await session).getAccessToken();
    const jwtToken = accessToken.getJwtToken();
    return jwtToken;
  }

  public static async getIdToken(): Promise<CognitoIdToken> {
    try {
      const session = Auth.currentSession();
      const idToken = (await session).getIdToken();
      return idToken;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
