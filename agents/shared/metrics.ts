export function emitQdrantQueryError(agent: "composer"): void {
  process.stdout.write(
    JSON.stringify({
      _aws: {
        Timestamp: Date.now(),
        CloudWatchMetrics: [
          {
            Namespace: "SiteGen/Qdrant",
            Dimensions: [["Agent", "Stage"]],
            Metrics: [{ Name: "QueryError", Unit: "Count" }],
          },
        ],
      },
      Agent: agent,
      Stage: process.env.STAGE ?? "dev",
      QueryError: 1,
    }) + "\n",
  );
}
