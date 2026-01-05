# Dynamodb Relational Store
Store Relational Entities in a Dynamodb Table using Single Table Design principles

# Specifications
- Specifications and Guardrails can be found here: [./specs/](/specs/)
- Stories and their tasks [./specs/stories/](/specs/stories/)


# Publish
Authenticate: `aws codeartifact login --tool npm --repository npm-store --domain jamesearlywine --domain-owner 546515125053 --region us-east-2`
Test: `npm run publish:dry-run`
Publish: `npm run publish:private`