import { ActivityTaskQueues } from "../common/taskQueues";
import { SdkDefinition, SdkMethod, TemporalSdkFactory } from "../sdks";
import {
    TEST_CHAIN_SDK_DEFINITION,
    TestChainSdk,
} from "../sdks/testChainSdk/model";
import { TEST_SDK_DEFINITION, TestSdk } from "../sdks/testSdk/model";
import * as wf from "@temporalio/workflow";
import { ActivityOptions } from "@temporalio/workflow";

const defaultActivityOptions: ActivityOptions = {
    startToCloseTimeout: "1 minute",
    cancellationType: wf.ActivityCancellationType.TRY_CANCEL,
    taskQueue: ActivityTaskQueues.defaultActivityTaskQueue,
    retry: {
        nonRetryableErrorTypes: ["NonRetryableError"],
    },
};

const createSdkFactoryProxyActivities = <T>(
    definition: SdkDefinition
): TemporalSdkFactory<T> => ({
    definition: definition,
    getSdk: () => {
        let res = {} as T;

        definition.methods.forEach((method: SdkMethod) => {
            res[method.methodName as keyof T] = (async (...args: any[]) => {
                // TODO: we should specify options overrides on both SDK level and method level
                const proxy = wf.proxyActivities(defaultActivityOptions);
                return await proxy[`${definition.name}-${method.methodName}`](
                    ...args
                );
            }) as T[keyof T];
        });

        return res;
    },
});

const createChainSdkFactoryProxyActivities = <T>(
    definition: SdkDefinition
): TemporalSdkFactory<T> => ({
    definition: definition,
    getSdk: (chainName: string) => {
        let res = {} as T;

        definition.methods.forEach((method: SdkMethod) => {
            res[method.methodName as keyof T] = (async (...args: any[]) => {
                // TODO: we should specify options overrides on both SDK level and method level
                const proxy = wf.proxyActivities(defaultActivityOptions);
                return await proxy[
                    `${definition.name}-${chainName}-${method.methodName}`
                ](...args);
            }) as T[keyof T];
        });

        return res;
    },
});

export const testSdkFactoryProxyActivities =
    createSdkFactoryProxyActivities<TestSdk>(TEST_SDK_DEFINITION);

export const testChainSdkFactoryProxyActivities =
    createChainSdkFactoryProxyActivities<TestChainSdk>(
        TEST_CHAIN_SDK_DEFINITION
    );
