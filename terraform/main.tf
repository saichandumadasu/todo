terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

resource "tls_private_key" "todo" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "todo" {
  key_name   = "todo-key"
  public_key = tls_private_key.todo.public_key_openssh
}

resource "local_sensitive_file" "pem" {
  content         = tls_private_key.todo.private_key_pem
  filename        = "${path.module}/.data/todo-key.pem"
  file_permission = "0600"
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}


output "ami_name" {
  value = data.aws_ami.ubuntu.name
}
output "ami_id" {
  value = data.aws_ami.ubuntu.id
}

resource "aws_security_group" "todo_sg" {
  name = "todo-sg"
# why we need 22 port? because we need to ssh into the instance to check the logs and debug if needed.
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
# why we need 8000 port? because our backend server is running on 8000 port and we need to access it from outside.
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
# why we need 3000 port? because our frontend server is running on 3000 port and we need to access it from outside.
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "todo" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t2.micro" # free tier eligible
  vpc_security_group_ids = [aws_security_group.todo_sg.id]
  key_name               = aws_key_pair.todo.key_name

  user_data = <<-EOF
 
  EOF

  tags = {
    Name = "todo-server"
  }
}

output "instance_public_ip" {
  value = aws_instance.todo.public_ip
}

output "ssh_command" {
  value = "ssh -i ${path.module}/.data/todo-key.pem ubuntu@${aws_instance.todo.public_ip}"
}
