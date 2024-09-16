# locals {
#   content_type_map = {
#    "js" = "application/javascript"
#    "html" = "text/html"
#    "css"  = "text/css"
#   }
# }

# S3 bucket where the object resides
# resource "aws_s3_bucket" "my-web-page" {
#   bucket = "${var.static_bucket_name}"
# }

# # Object to delete
# resource "aws_s3_bucket_object" "example_object" {
#   bucket = "${var.static_bucket_name}"
#   key    = "path/to/my-object.txt" # Replace with your object key

#   # Use the lifecycle block to control the behavior
#   lifecycle {
#     prevent_destroy = false # Allows the object to be deleted when the resource is removed
#   }
# }

# # If you want to force deletion of the object:
# resource "null_resource" "delete_object" {
#   triggers = {
#     delete = "true" # Set this to a condition that triggers the object deletion
#   }

#   provisioner "local-exec" {
#     command = "aws s3 rm s3://${aws_s3_bucket.example_bucket.bucket}/${aws_s3_bucket_object.example_object.key}" # Remove the object using AWS CLI
#   }
# }

resource "null_resource" "delete_all_objects" {
  # Use the local-exec provisioner to run the AWS CLI command
  provisioner "local-exec" {
    command = "echo 'Deleting all objects in S3 bucket' && aws s3 rm s3://${var.static_bucket_name} --recursive && sleep 3"
  }

  # Add a trigger to ensure this command runs when you apply changes
  triggers = {
    always_run = "${timestamp()}"
  }
}

resource "aws_s3_object" "upload-build-file" {
    depends_on = [null_resource.delete_all_objects]
    for_each        = fileset("../../my_web_page/build/", "**")

    bucket          = "${var.static_bucket_name}"
    key             = each.value
    source          = "../../my_web_page/build/${each.value}"
    # etag            = filemd5("../../my_web_page/build/${each.value}")

    content_type = lookup({
    "html" = "text/html",
    "css"  = "text/css",
    "js"   = "application/javascript",
    "png"  = "image/png",
    "jpg"  = "image/jpg",
    "jpeg" = "image/jpeg",
    "gif"  = "image/gif",
    "svg"  = "image/svg+xml",
    "ico"  = "image/x-icon",
    "json" = "application/json",
    "txt" = "text/txt"
  }, split(".", each.value)[length(split(".", each.value)) - 1], "application/octet-stream")
}