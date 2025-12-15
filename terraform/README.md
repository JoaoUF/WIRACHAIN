# AWS Infrastructure + CI/CD (starter)

This repository contains a starter Terraform configuration and a GitHub Actions workflow to build/push Docker images and provision AWS infrastructure for a Django + Vite application.

High-level architecture:

- ECS (Fargate) for web + celery
- RDS (Postgres 14) primary + read replica
- ElastiCache (Redis)
- Amazon MQ (RabbitMQ)
- ECR for Docker images
- S3 for static/media + optional CloudFront
- Secrets Manager for secrets

How to use

1. Create an S3 bucket and DynamoDB table for Terraform remote state (or remove backend config).
2. Add the following GitHub secrets:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_REGION
   - TF_VAR_domain_name (if used)
   - TF_BACKEND_BUCKET, TF_BACKEND_DYNAMODB_TABLE (if using remote state)
3. Push the repo. Actions will build images and attempt to run Terraform (adjust workflow to your branch).
4. Review `terraform/variables.tf` and set appropriate sizes and DB passwords via `terraform.tfvars` or Secrets Manager.

This is a starter. After you confirm preferences I will generate the full module implementations for VPC, RDS, ElastiCache, Amazon MQ, ECS services and Task Definitions.
