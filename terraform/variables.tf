variable "region" {
  description = "AWS region to deploy to"
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  description = "Project prefix used for resources"
  type    = string
  default = "wirachain"
}

variable "vpc_cidr" {
  description = "VPC CIDR. Replace if you later add VPC module."
  type    = string
  default = "10.0.0.0/16"
}

variable "tfstate_bucket" {
  description = "S3 bucket name for remote state. Leave empty to use local state."
  type    = string
  default = ""
}

variable "tfstate_lock_table" {
  description = "DynamoDB table for state locking. Leave empty to skip locking."
  type    = string
  default = ""
}

# DB settings
variable "db_username" {
  description = "Database admin username"
  type    = string
  default = "postgres"
}

variable "db_password" {
  description = "Database admin password. Prefer providing with env TF_VAR_db_password or via secrets manager for production"
  type    = string
  sensitive = true
  default = ""
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type    = number
  default = 20
}

variable "db_instance_class" {
  description = "RDS instance class"
  type    = string
  default = "db.t3.medium"
}