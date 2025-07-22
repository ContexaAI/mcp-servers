import { codeBlock } from 'common-tags';
export function getDeploymentId(projectId, functionId, functionVersion) {
    return `${projectId}_${functionId}_${functionVersion}`;
}
export function getPathPrefix(deploymentId) {
    return `/tmp/user_fn_${deploymentId}/`;
}
export const edgeFunctionExample = codeBlock `
  import "jsr:@supabase/functions-js/edge-runtime.d.ts";

  Deno.serve(async (req: Request) => {
    const data = {
      message: "Hello there!"
    };
    
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      }
    });
  });
`;
//# sourceMappingURL=edge-function.js.map