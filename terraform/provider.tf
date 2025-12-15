terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket         = var.tfstate_bucket
    key            = "infra/terraform.tfstate"
    region         = var.region
    dynamodb_table = var.tfstate_lock_table
    encrypt        = true
  }
}

provider "aws" {
  region = var.region
}