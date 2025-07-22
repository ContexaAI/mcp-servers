import { type PGliteInterface } from '@electric-sql/pglite';
import type { components } from '../src/management-api/types.js';
export declare const API_URL = "https://api.supabase.com";
export declare const CONTENT_API_URL = "https://supabase.com/docs/api/graphql";
export declare const MCP_SERVER_NAME = "supabase-mcp";
export declare const MCP_SERVER_VERSION: any;
export declare const MCP_CLIENT_NAME = "test-client";
export declare const MCP_CLIENT_VERSION = "1.0.0";
export declare const ACCESS_TOKEN = "dummy-token";
export declare const COUNTRY_CODE = "US";
export declare const CLOSEST_REGION = "us-east-2";
export declare const contentApiMockSchema: string;
type Organization = components['schemas']['V1OrganizationSlugResponse'];
type Project = components['schemas']['V1ProjectWithDatabaseResponse'];
type Branch = components['schemas']['BranchResponse'];
export type Migration = {
    version: string;
    name: string;
    query: string;
};
export declare const mockOrgs: Map<string, {
    id: string;
    name: string;
    plan?: "free" | "pro" | "team" | "enterprise";
    opt_in_tags: ("AI_SQL_GENERATOR_OPT_IN" | "AI_DATA_GENERATOR_OPT_IN" | "AI_LOG_GENERATOR_OPT_IN")[];
    allowed_release_channels: ("internal" | "alpha" | "beta" | "ga" | "withdrawn" | "preview")[];
}>;
export declare const mockProjects: Map<string, MockProject>;
export declare const mockBranches: Map<string, MockBranch>;
export declare const mockContentApi: import("msw").HttpHandler[];
export declare const mockManagementApi: import("msw").HttpHandler[];
export declare function createOrganization(options: MockOrganizationOptions): Promise<MockOrganization>;
export declare function createProject(options: MockProjectOptions): Promise<MockProject>;
export declare function createBranch(options: {
    name: string;
    parent_project_ref: string;
}): Promise<MockBranch>;
export type MockOrganizationOptions = {
    name: Organization['name'];
    plan: Organization['plan'];
    allowed_release_channels: Organization['allowed_release_channels'];
    opt_in_tags?: Organization['opt_in_tags'];
};
export declare class MockOrganization {
    id: string;
    name: Organization['name'];
    plan: Organization['plan'];
    allowed_release_channels: Organization['allowed_release_channels'];
    opt_in_tags: Organization['opt_in_tags'];
    get details(): Organization;
    constructor(options: MockOrganizationOptions);
}
export type MockEdgeFunctionOptions = {
    name: string;
    entrypoint_path: string;
    import_map_path?: string;
};
export declare class MockEdgeFunction {
    projectId: string;
    id: string;
    slug: string;
    version: number;
    name: string;
    status: 'ACTIVE' | 'REMOVED' | 'THROTTLED';
    entrypoint_path: string;
    import_map_path?: string;
    import_map: boolean;
    verify_jwt: boolean;
    created_at: Date;
    updated_at: Date;
    files: File[];
    setFiles(files: File[]): Promise<void>;
    get deploymentId(): string;
    get pathPrefix(): string;
    get details(): {
        id: string;
        slug: string;
        version: number;
        name: string;
        status: "ACTIVE" | "REMOVED" | "THROTTLED";
        entrypoint_path: string;
        import_map_path: string | undefined;
        import_map: boolean;
        verify_jwt: boolean;
        created_at: string;
        updated_at: string;
    };
    constructor(projectId: string, { name, entrypoint_path, import_map_path }: MockEdgeFunctionOptions);
    update({ name, entrypoint_path, import_map_path }: MockEdgeFunctionOptions): void;
}
export type MockStorageBucketOptions = {
    name: string;
    isPublic: boolean;
};
export declare class MockStorageBucket {
    id: string;
    name: string;
    public: boolean;
    created_at: Date;
    updated_at: Date;
    constructor({ name, isPublic }: MockStorageBucketOptions);
}
export type MockProjectOptions = {
    name: string;
    region: string;
    organization_id: string;
};
export declare class MockProject {
    #private;
    id: string;
    organization_id: string;
    name: string;
    region: string;
    created_at: Date;
    status: Project['status'];
    database: {
        host: string;
        version: string;
        postgres_engine: string;
        release_channel: string;
    };
    migrations: Migration[];
    edge_functions: Map<string, MockEdgeFunction>;
    storage_buckets: Map<string, MockStorageBucket>;
    get db(): PGliteInterface;
    get details(): Project;
    constructor({ name, region, organization_id }: MockProjectOptions);
    applyMigrations(): Promise<void>;
    resetDb(): Promise<PGliteInterface>;
    deployEdgeFunction(options: MockEdgeFunctionOptions, files?: File[]): Promise<MockEdgeFunction>;
    destroy(): Promise<void>;
    createStorageBucket(name: string, isPublic?: boolean): MockStorageBucket;
}
export type MockBranchOptions = {
    name: string;
    project_ref: string;
    parent_project_ref: string;
    is_default: boolean;
};
export declare class MockBranch {
    id: string;
    name: string;
    project_ref: string;
    parent_project_ref: string;
    is_default: boolean;
    persistent: boolean;
    status: Branch['status'];
    created_at: Date;
    updated_at: Date;
    get details(): Branch;
    constructor({ name, project_ref, parent_project_ref, is_default, }: MockBranchOptions);
}
export {};
//# sourceMappingURL=mocks.d.ts.map