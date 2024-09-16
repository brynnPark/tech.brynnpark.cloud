# Project Specific Variables
variable "static_bucket_name" {
  type        = string
  description = "The name of S3 bucket for static website hosting"
  default = "brynnpark-tech-blog"
}