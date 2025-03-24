import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = '홈서버에서 Minikube로 쿠버네티스 설치하기 (Ubuntu)';

const postContent = `

집에서 노트북을 홈서버로 구성하여 MSA 프로젝트를 쿠버네티스 환경에 배포하기 위해 Minikube를 설치한 과정이다. \`--driver=none\` 옵션으로 **Docker 없이 베어메탈 환경**에서 직접 Kubernetes를 설치했다. Ubuntu에서 새로운 유저를 생성해서 사용하고 있기 때문에 root가 아닌 일반 사용자로 \`kubectl\`을 사용하기 위한 처리 과정이 포함됐다.

---

## 사양

- 노트북 사양: 2코어 4쓰레드 / RAM 16GB  
- OS: Ubuntu 22.04  
- 목적: Jenkins, ArgoCD, Istio, Grafana 포함된 MSA 기반 아키텍처 로컬 클러스터 테스트  



# 1. 시스템 초기 세팅

## 1-1. 필요한 패키지 설치 (기본 패키지 설치)

\`\`\`bash
sudo apt update
sudo apt install -y curl wget apt-transport-https ca-certificates gnupg \
  conntrack socat ebtables iptables git build-essential pkg-config libseccomp-dev
\`\`\`

## 1-2. CNI 플러그인 설치 (Pod 네트워킹용)

\`\`\`bash
cd /tmp
curl -LO https://github.com/containernetworking/plugins/releases/download/v1.4.0/cni-plugins-linux-amd64-v1.4.0.tgz
sudo mkdir -p /opt/cni/bin
sudo tar -C /opt/cni/bin -xzf cni-plugins-linux-amd64-v1.4.0.tgz
\`\`\`


# 2. kubectl 및 minikube 설치

## 2-1. kubectl 설치

\`\`\`bash
curl -LO "https://dl.k8s.io/release/v1.29.0/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
\`\`\`

## 2-2. Minikube 설치

\`\`\`bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
\`\`\`

# 3. cri-dockerd 설치 (Kubernetes v1.24+부터 필요)

## 3-1. Go 1.21 이상 설치

\`\`\`bash
cd /tmp
curl -LO https://go.dev/dl/go1.21.7.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.7.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
\`\`\`

## 3-2. cri-dockerd 빌드 및 배포 (Docker runtime shim)

\`\`\`bash
cd ~
git clone https://github.com/Mirantis/cri-dockerd.git
cd cri-dockerd
go mod tidy
go build -o bin/cri-dockerd
sudo mv bin/cri-dockerd /usr/local/bin/cri-dockerd
\`\`\`

## 3-3. cri-dockerd systemd 서비스 등록

\`\`\`bash
sudo cp -a packaging/systemd/* /etc/systemd/system/
sudo sed -i 's:/usr/bin/cri-dockerd:/usr/local/bin/cri-dockerd:' /etc/systemd/system/cri-docker.service
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable --now cri-docker.socket
sudo systemctl enable --now cri-docker.service
\`\`\`


# 4. Minikube 시작

## 4-1. 권한 에러 방지 설정  
(Ubuntu 커널 보안 기능 완화, lock 접근 에러 방지)

\`\`\`bash
sudo sysctl fs.protected_regular=0
echo "fs.protected_regular=0" | sudo tee -a /etc/sysctl.conf
\`\`\`

## 4-2. Minikube 클러스터 생성

\`\`\`bash
sudo minikube start --driver=none --memory=2200mb
\`\`\`

- \`--driver=none\`: Docker를 사용하지 않고 베어메탈에 직접 설치  
- \`--memory=2200mb\`: 실제 Ubuntu에서 허용된 메모리 크기 제한에 맞춤  
  - \`--driver=none\`에서는 무시될 수 있지만, 최소 메모리 요구 조건 충족을 위해 포함  

# 5. 일반 사용자 (\`bohyeon\`)로 쿠버네티스 접근 설정

## 5-1. root 사용자에서 config 파일 (\`.kube\`, \`.minikube\`) 복사

\`\`\`bash
sudo cp -r /root/.kube /home/bohyeon/
sudo cp -r /root/.minikube /home/bohyeon/
sudo chown -R bohyeon:bohyeon /home/bohyeon/.kube /home/bohyeon/.minikube
\`\`\`

## 5-2. config 내부 경로 수정 (\`/root/.minikube\` → \`/home/bohyeon/.minikube\`)

\`\`\`bash
sed -i 's|/root/.minikube|/home/bohyeon/.minikube|g' ~/.kube/config
\`\`\`

# 6. 클러스터 확인

\`\`\`bash
kubectl get nodes
\`\`\`

**✅ 출력 예시**

\`\`\`bash
NAME        STATUS   ROLES           AGE   VERSION
brynnpark   Ready    control-plane   12m   v1.32.0
\`\`\`


이제 Minikube 위에 Istio, Jenkins, ArgoCD, Grafana 등을 올리고, 내 MSA 구조를 배포할 준비가 끝났다.

이후에는 네임스페이스 설계 → Istio Gateway 설정 → 서비스별 Helm Chart 구성 → ArgoCD GitOps 배포 순서로 진행할 예정이다.


# ⚠️ 주요 에러 로그 및 해결 방법

Minikube를 설치하면서 엄청 많은 에러를 마주했고, 마주한 각 에러와 해결 방안을 정리해놨다.
![image1.png](./post10.png)

### 1. \`RSRC_INSUFFICIENT_CONTAINER_MEMORY\`

\`\`\`bash
Exiting due to RSRC_INSUFFICIENT_CONTAINER_MEMORY: docker only has 959MiB available, less than the required 1800MiB for Kubernetes
\`\`\`

- **원인**:
    
  -  Minikube는 기본적으로 Docker를 가상화 드라이버로 사용하려고 시도하는데, 이때 Docker에 할당된 메모리가 1GB도 되지 않을 경우 Kubernetes가 제대로 실행되지 않음.
    
  -    
    Kubernetes는 여러 컴포넌트(API server, etcd, controller-manager 등)가 백그라운드에서 동작하는 구조이므로 최소 요구 메모리(RAM)가 존재함. 특히 Minikube는 가상 머신 또는 컨테이너 내에서 전체 Kubernetes를 실행하므로, 메모리가 부족하면 \`kubelet\`이 뜨지도 못하고 에러 발생.
    
- **해결 방법**:
  - 해결 방법은 2가지라고 생각됨
      - 메모리가 큰 서버를 사용한다 (좋은 노트북 .. )
      - driver=none 으로 진행한다 >> baremetal일 경우 가능
  - 2번째 방법을 채택. home server로 사용하는 baremetal(Ubuntu)이기 때문에 
  -  Docker 메모리 설정을 직접 늘릴 수도 있지만, 가장 간단하고 효과적인 방법은 Docker 자체를 우회하고 **\`--driver=none\`을 이용하여 베어메탈 위에 설치**하는 것임.

### 2. \`NOT_FOUND_CRI_DOCKERD\`

\`\`\`bash
The none driver with Kubernetes v1.24+ and the docker container-runtime requires cri-dockerd.
\`\`\`

- **원인**:
    
  -  Kubernetes는 v1.24 버전부터 **Docker를 직접 지원하지 않음**. 그 대신 **Container Runtime Interface (CRI)**를 통해서만 컨테이너 런타임을 연동함. Docker는 CRI를 기본적으로 지원하지 않기 때문에 **\`cri-dockerd\`라는 shim 계층**이 필요함.
    
  -    
    이전에는 Kubernetes가 dockershim을 통해 Docker를 직접 다루었지만, 유지보수 및 아키텍처 일관성 문제로 제거됨. 따라서 Docker를 계속 쓰고 싶다면 \`cri-dockerd\`라는 별도의 프로젝트를 설치해서 kubelet이 Docker와 통신할 수 있도록 만들어줘야 함.
    
- **해결 방법**:
    
    GitHub의 [Mirantis/cri-dockerd](https://github.com/Mirantis/cri-dockerd) 저장소에서 소스를 클론하고, \`go build\`로 직접 빌드한 뒤 systemd 서비스로 등록하여 데몬으로 실행되도록 설정함.
    

### 3. \`HOST_JUJU_LOCK_PERMISSION\`

\`\`\`bash
boot lock: unable to open /tmp/juju-xxxx: permission denied
Exiting due to HOST_JUJU_LOCK_PERMISSION
\`\`\`

- **원인**:
    
  -  Minikube는 클러스터 락(lock)을 위해 \`/tmp\` 경로에 락 파일을 생성하는데, 해당 파일을 일반 사용자로 만든 뒤, 루트 권한으로 접근하면 Linux 커널이 차단함.
    
  -   
    Ubuntu 22.04부터는 보안 기능 중 하나인 \`fs.protected_regular=1\` 설정이 기본값임. 이 설정은 루트 사용자라도 다른 사용자가 만든 일반 파일을 열지 못하게 막음. 이는 보안상 유용하지만, Minikube처럼 사용자가 락 파일을 만들고 루트가 접근하는 구조에선 에러가 발생함.
    
- **해결 방법**:
    
    다음 커널 파라미터를 설정하여 해당 보안 기능을 끔.
    
    \`\`\`bash
    sudo sysctl fs.protected_regular=0
    echo "fs.protected_regular=0" | sudo tee -a /etc/sysctl.conf
    \`\`\`
    

### 4. \`NOT_FOUND_CNI_PLUGINS\`

\`\`\`bash
Exiting due to NOT_FOUND_CNI_PLUGINS:
\`\`\`

- **원인**:
    
  -  Kubernetes는 Pod 간 통신을 위해 CNI(Container Network Interface) 플러그인을 필요로 하지만, Minikube에서 자동 설치가 되지 않거나 시스템에 존재하지 않으면 이 에러가 발생함.
    
  -  
    Pod 간 통신 및 IP 할당은 Kubernetes가 직접 하지 않고 CNI라는 외부 네트워크 플러그인을 통해 처리함. 기본적으로 \`bridge\`, \`loopback\`, \`host-local\` 등의 CNI 바이너리가 \`/opt/cni/bin\`에 존재해야 하는데, 해당 경로가 비어 있으면 kubelet이 네트워크를 구성하지 못하고 실패함.
    
- **해결 방법**:
공식 CNI 바이너리 번들을 수동 설치:
    
    \`\`\`bash
    bash
    CopyEdit
    curl -LO https://github.com/containernetworking/plugins/releases/download/v1.4.0/cni-plugins-linux-amd64-v1.4.0.tgz
    sudo mkdir -p /opt/cni/bin
    sudo tar -C /opt/cni/bin -xzf cni-plugins-linux-amd64-v1.4.0.tgz
    \`\`\`


### 5. \`permission denied: client.crt\`

\`The connection to the server localhost:8080 was refused\`

\`\`\`bash
unable to read client-cert /root/.minikube/...: permission denied
\`\`\`

- **원인**:
    
  - Minikube를 \`sudo\`로 실행하면 \`.kube/config\`와 \`.minikube/\` 폴더가 **\`/root\` 사용자 기준으로 생성**됨. 이때 일반 사용자 계정 (\`bohyeon\`)에서 \`kubectl\`을 실행하면, 루트의 인증서 파일에 접근 권한이 없기 때문에 실패함.
    
  - 
    \`kubectl\`은 \`~/.kube/config\`에 정의된 클러스터 정보와 인증서를 참조하는데, 여기서 \`client.crt\`, \`client.key\`, \`ca.crt\` 등의 경로가 \`/root/.minikube/\`로 되어 있으면 접근 권한 문제로 실패함. 이때 config 자체는 복사했더라도, 경로 안에 있는 파일을 읽을 수 없기 때문에 여전히 실패함.
    
- **해결 방법**:
    1. \`/root/.kube\`, \`/root/.minikube\` 전체를 \`/home/bohyeon\`으로 복사
    2. config 안의 경로를 sed로 바꿔서 \`.minikube\` 경로를 사용자 홈 기준으로 수정
    \`\`\`bash
    sed -i 's|/root/.minikube|/home/bohyeon/.minikube|g' ~/.kube/config
    \`\`\`

`

const Post10 = {
  id: 10,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['Kubernetes', 'Infra', 'Minikube', 'MSA', 'Homelab'],
  excerpt: '이 포스팅은 클라우드 컴퓨팅의 기초적인 요소와 AWS 서비스를 훑어본다. 특히, 서비스를 설계하기 위해 필요한 기초적인 서비스를..',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
  // content: <MarkdownViewer content={postContent} />,
  // content: <MDEditor.Markdown source={postContent} />,
};

export default Post10;

