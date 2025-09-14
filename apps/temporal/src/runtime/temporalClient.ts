import { WorkflowClient, Connection } from "@temporalio/client";

let cachedClients: { [namespace: string]: WorkflowClient } = {};
let cachedConnection: Connection;

const getConnection = async (options: {
    clusterUrl: string;
}): Promise<Connection> => {
    if (!cachedConnection) {
        cachedConnection = await Connection.connect({
            address: options.clusterUrl,
        });
    }
    return cachedConnection;
};

export const getClient = async (options: {
    namespace: string;
    clusterUrl: string;
}): Promise<WorkflowClient> => {
    if (!cachedClients[options.namespace]) {
        cachedClients[options.namespace] = new WorkflowClient({
            connection: await getConnection(options),
            namespace: options.namespace,
            // TODO: setup temporal encryption later
        });
    }
    return cachedClients[options.namespace];
};
