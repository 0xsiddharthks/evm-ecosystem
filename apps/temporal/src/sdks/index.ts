export interface SdkMethod {
    methodName: string;

    // temporal overrides here
}

export interface SdkDefinition {
    name: string;
    methods: SdkMethod[];
}

export interface ChainSdkFactory<T> {
    definition: SdkDefinition;
    getSdk: (chainName: string) => T;
}

export interface SdkFactory<T> {
    definition: SdkDefinition;
    getSdk: () => T;
}

export interface TemporalOverrides {
    // temporal options
}

export interface TemporalSdkFactory<T> extends SdkFactory<T> {
    getSdk: (overrides?: TemporalOverrides) => T;
}
