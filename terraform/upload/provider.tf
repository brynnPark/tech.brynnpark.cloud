terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = ">= 4.33.0"
    }
  }
}

// This block tells Terraform that we're going to provision AWS resources.
provider "aws" {
  region = "ap-northeast-2"
}