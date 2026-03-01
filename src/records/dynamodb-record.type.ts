/**
 * Core record type definitions for DynamoDB Relational Store
 *
 * These types define the structure of all records stored in the single DynamoDB table.
 * See specs/SCHEMA.md for detailed schema specifications.
 */

import type { ResourceRecord } from './resource/resource-record.type';
import type { ParentChildRelationshipRecord } from './parent-child-relationship/parent-child-relationship-record.type';
import type { CollectionMembershipRelationshipRecord } from './collection-membership-relationship/collection-membership-relationship-record.type';
import type { UniqueKeyValueRecord } from './unique-key-value/unique-key-value-record.type';

export type { ResourceRecord } from './resource/resource-record.type';
export type { ParentChildRelationshipRecord } from './parent-child-relationship/parent-child-relationship-record.type';
export type { CollectionMembershipRelationshipRecord } from './collection-membership-relationship/collection-membership-relationship-record.type';
export type { UniqueKeyValueRecord } from './unique-key-value/unique-key-value-record.type';

/**
 * Union type of all possible record types.
 */
export type RecordType =
  | "Resource"
  | "ParentChildRelationship"
  | "CollectionMemberRelationship"
  | "UniqueKeyValue";

/**
 * Union type of all possible DynamoDB record types.
 */
export type DynamoDBRecord =
  | ResourceRecord
  | ParentChildRelationshipRecord
  | CollectionMembershipRelationshipRecord
  | UniqueKeyValueRecord;
