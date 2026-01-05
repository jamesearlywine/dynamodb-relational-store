# Dynamodb Relational Store
Store Relational Entities in a Dynamodb Table using Single Table Design principles

# Specifications
- Product Requirements Document [/specs/PRD.md](/specs/PRD.md)
- Stories and their Tasks [/specs/stories/](/specs/stories/)
- Implementation Plan [/specs/PLAN.md](/specs/PLAN.md)
- Technical Guardrails and Coding Conventions [/specs/CONSTITUTION.md](/specs/CONSTITUTION.md)
- Schema [/specs/SCHEMA.md](/specs/SCHEMA.md)

# Publish
Authenticate: `aws codeartifact login --tool npm --repository npm-store --domain jamesearlywine --domain-owner 546515125053 --region us-east-2`
Test: `npm run publish:dry-run`
Publish: `npm run publish:private`