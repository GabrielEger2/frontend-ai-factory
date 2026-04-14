#!/usr/bin/env bash
#
# setup-ssm.sh — Store Claude API key and Vercel token in AWS SSM Parameter Store.
#
# Usage:
#   bash agents/scripts/setup-ssm.sh
#   bash agents/scripts/setup-ssm.sh --region us-east-1 --env production
#
# Parameters created:
#   /sitegen/<env>/claude-api-key   (SecureString)
#   /sitegen/<env>/vercel-token     (SecureString)
#   /sitegen/<env>/neo4j-uri        (SecureString)
#   /sitegen/<env>/neo4j-password   (SecureString)

set -euo pipefail

# ── Defaults ─────────────────────────────────────────────────────────

REGION="${AWS_DEFAULT_REGION:-us-east-1}"
ENV="dev"

# ── Parse CLI args ───────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    --region)
      REGION="$2"
      shift 2
      ;;
    --env)
      ENV="$2"
      shift 2
      ;;
    --help|-h)
      echo "Usage: $0 [--region REGION] [--env ENVIRONMENT]"
      echo ""
      echo "Options:"
      echo "  --region   AWS region (default: us-east-1 or AWS_DEFAULT_REGION)"
      echo "  --env      Environment name (default: dev)"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# ── Collect secrets ──────────────────────────────────────────────────

echo "SiteGen SSM Parameter Setup"
echo "==========================="
echo "Region: ${REGION}"
echo "Environment: ${ENV}"
echo ""

read -rsp "Enter Claude API key: " CLAUDE_KEY
echo ""

if [[ -z "${CLAUDE_KEY}" ]]; then
  echo "Error: Claude API key cannot be empty."
  exit 1
fi

read -rsp "Enter Vercel token: " VERCEL_TOKEN
echo ""

if [[ -z "${VERCEL_TOKEN}" ]]; then
  echo "Error: Vercel token cannot be empty."
  exit 1
fi

read -rsp "Enter Neo4j URI (bolt+s://...): " NEO4J_URI
echo ""

if [[ -z "${NEO4J_URI}" ]]; then
  echo "Error: Neo4j URI cannot be empty."
  exit 1
fi

read -rsp "Enter Neo4j password: " NEO4J_PASSWORD
echo ""

if [[ -z "${NEO4J_PASSWORD}" ]]; then
  echo "Error: Neo4j password cannot be empty."
  exit 1
fi

# ── Write to SSM ─────────────────────────────────────────────────────

CLAUDE_PARAM="/sitegen/${ENV}/claude-api-key"
VERCEL_PARAM="/sitegen/${ENV}/vercel-token"
NEO4J_URI_PARAM="/sitegen/${ENV}/neo4j-uri"
NEO4J_PASSWORD_PARAM="/sitegen/${ENV}/neo4j-password"

echo ""
echo "Writing parameters..."

aws ssm put-parameter \
  --region "${REGION}" \
  --name "${CLAUDE_PARAM}" \
  --type SecureString \
  --value "${CLAUDE_KEY}" \
  --overwrite \
  --description "Claude API key for SiteGen ${ENV}" \
  > /dev/null

echo "  ${CLAUDE_PARAM} ... OK"

aws ssm put-parameter \
  --region "${REGION}" \
  --name "${VERCEL_PARAM}" \
  --type SecureString \
  --value "${VERCEL_TOKEN}" \
  --overwrite \
  --description "Vercel deploy token for SiteGen ${ENV}" \
  > /dev/null

echo "  ${VERCEL_PARAM} ... OK"

aws ssm put-parameter \
  --region "${REGION}" \
  --name "${NEO4J_URI_PARAM}" \
  --type SecureString \
  --value "${NEO4J_URI}" \
  --overwrite \
  --description "Neo4j Aura URI for SiteGen ${ENV}" \
  > /dev/null

echo "  ${NEO4J_URI_PARAM} ... OK"

aws ssm put-parameter \
  --region "${REGION}" \
  --name "${NEO4J_PASSWORD_PARAM}" \
  --type SecureString \
  --value "${NEO4J_PASSWORD}" \
  --overwrite \
  --description "Neo4j Aura password for SiteGen ${ENV}" \
  > /dev/null

echo "  ${NEO4J_PASSWORD_PARAM} ... OK"

echo ""
echo "Done. All parameters stored as SecureString in ${REGION}."
