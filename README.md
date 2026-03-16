# 🩺 HealthTracker — DevSecOps Deployment Guide

This branch contains the full DevSecOps setup: Docker, Kubernetes (EKS Auto Mode), Terraform, and CI/CD pipeline.

> **Source code** lives on the [`main`](../../tree/main) branch.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tech Stack](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)
![Tech Stack](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![Tech Stack](https://img.shields.io/badge/Kubernetes-EKS-326CE5?style=flat-square&logo=kubernetes)
![Tech Stack](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=flat-square&logo=terraform)
![Tech Stack](https://img.shields.io/badge/AWS-ap--south--1-FF9900?style=flat-square&logo=amazonaws)

---

## 📁 Project Structure

```
Healthtracker/
├── frontend/                        # React (Vite) + Nginx
├── backend/                         # Node.js Express API
├── k8s/
│   └── healthtracker.yaml           # Full K8s manifest (Namespace, Secrets, DB, Backend, Frontend)
├── terraform/
│   ├── main.tf                      # EKS Auto Mode + VPC
│   ├── variables.tf                 # Input variables (region: ap-south-1)
│   ├── terraform.tfvars             # Variable values
│   ├── outputs.tf                   # Cluster outputs
│   └── provider.tf                  # AWS provider config
├── deploy/
│   ├── setup.sh                     # EC2 bare-metal setup script
│   └── healthtracker-nginx.conf     # Nginx reverse proxy config
├── .github/workflows/
│   └── ci-cd.yml                    # CI/CD pipeline (triggers on dev branch)
└── docker-compose.yml               # Local / single-server deployment
```

---

## 🐳 Option 1 — Docker Compose (Local / Single Server)

The fastest way to run the full stack.

### Prerequisites
- Docker & Docker Compose installed

### Run

```bash
git clone <repo-url>
cd Healthtracker
docker compose up --build
```

App available at `http://localhost`

### Useful Commands

```bash
docker compose up --build -d     # Run in background
docker compose logs -f           # Stream logs
docker compose down              # Stop and remove containers
docker compose down -v           # Also remove the database volume
```

---

## ☸️ Option 2 — Kubernetes on EKS (AWS ap-south-1)

### Step 1 — Provision EKS with Terraform

#### Prerequisites
- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.5.0
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) configured with sufficient IAM permissions
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

#### Deploy

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

This provisions:
- VPC with public + private subnets across 3 AZs in `ap-south-1`
- EKS cluster (Auto Mode) — EKS manages node lifecycle, CoreDNS, kube-proxy
- gp3 EBS StorageClass for PostgreSQL persistent storage
- Envelope encryption for K8s secrets at rest

#### Configure kubectl

```bash
aws eks update-kubeconfig --region ap-south-1 --name healthtracker-eks
kubectl get nodes
```

### Step 2 — Deploy the Application

```bash
kubectl apply -f k8s/healthtracker.yaml
```

This creates:
- Namespace: `healthtracker`
- Secret: DB credentials
- StorageClass + PVC: EBS gp3 for PostgreSQL
- Deployments: `healthtracker-db`, `healthtracker-backend` (2 replicas), `healthtracker-frontend` (2 replicas)
- Services: ClusterIP for DB and backend, NodePort for frontend
- NetworkPolicies: DB only accepts traffic from backend; backend only from frontend

#### Check Status

```bash
kubectl get all -n healthtracker
kubectl logs -n healthtracker deploy/healthtracker-backend
```

#### Access the App

```bash
# Port-forward to access locally
kubectl port-forward svc/healthtracker-frontend 8080:80 -n healthtracker
# Open http://localhost:8080
```

### Step 3 — Tear Down

```bash
kubectl delete -f k8s/healthtracker.yaml
cd terraform && terraform destroy
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The pipeline triggers on every push and PR to the **`dev`** branch.

### Stages

| Stage | Tool | Description |
|-------|------|-------------|
| 🔍 Lint | ESLint | Lint backend and frontend code |
| 🛡️ SCA | npm audit | Dependency vulnerability scan |
| 🐳 Build | Docker Buildx | Build and push images to GHCR |
| 🔬 Image Scan | Trivy | Scan container images for CVEs |
| 🏗️ IaC Scan | Checkov | Scan Terraform + K8s manifests |
| 📋 Dockerfile Lint | Hadolint | Lint Dockerfiles |
| 🚀 Manifest Update | git | Auto-update K8s image tags on push to `dev` |

### Container Images

Images are pushed to GitHub Container Registry (GHCR):

```
ghcr.io/<your-org>/healthtracker/healthtracker-backend:<sha>
ghcr.io/<your-org>/healthtracker/healthtracker-frontend:<sha>
```

### Required Secrets

No additional secrets needed — the pipeline uses `GITHUB_TOKEN` (auto-provided by GitHub Actions) to push to GHCR and commit manifest updates.

---

## 🌿 Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Application source code only — clean, no infra |
| `dev`  | This branch — Docker, K8s, Terraform, CI/CD, full deployment docs |
