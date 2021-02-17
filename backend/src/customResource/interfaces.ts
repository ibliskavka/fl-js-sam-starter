import { CfnResponse } from "./cfnHelperService";

/**
 * Provides framework for type checking ResourceProperties
 */
export interface ResourceProps<TProps>{
  RequestType: string;
  ResourceProperties: TProps;
  OldResourceProperties?: TProps;
}


export interface CustomResourceProviders {
    [name: string]: CustomResourceProvider
}

export interface CustomResourceProvider {
    handler: (e: any) => Promise<CfnResponse>
}