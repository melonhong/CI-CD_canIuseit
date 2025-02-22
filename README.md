# CI/CD_Can I Use It ?
![Image](https://github.com/user-attachments/assets/4b367d1d-443e-4da8-bc1c-23f4c079ce21)
![Image](https://github.com/user-attachments/assets/aa938312-7b7d-4f82-8046-5f068b2c2c12)
![Image](https://github.com/user-attachments/assets/5ecb82dd-d54c-408f-87d9-a2bd0fd2c987)
![Image](https://github.com/user-attachments/assets/c7a3461e-255a-4ff4-8ec0-e5ed82eb8e2c)
![Image](https://github.com/user-attachments/assets/6303fad1-07f8-4757-b015-c4e489dfc4ce)
![Image](https://github.com/user-attachments/assets/7d7775e4-02fd-4e60-92b9-6bf1c0228dc7)
![Image](https://github.com/user-attachments/assets/b346da7e-2c7f-476a-a8d8-349d28509966)
![Image](https://github.com/user-attachments/assets/9088c1c1-950a-4291-9682-5d646eaddc76)
![Image](https://github.com/user-attachments/assets/08ad057e-f697-4da1-9baf-15c994550eac)
![Image](https://github.com/user-attachments/assets/ad0e4c05-a8cc-434c-83e5-65932510aaa5)
![Image](https://github.com/user-attachments/assets/30c9bc65-3a15-4fc8-8bd2-91f7bcf9d7c3)
![Image](https://github.com/user-attachments/assets/b4a39c95-7a82-41ac-b05f-13470750678c)
![Image](https://github.com/user-attachments/assets/d272baed-e0f7-464e-b0d7-de3842361ef7)
![Image](https://github.com/user-attachments/assets/cbc7a1bf-9323-4e06-ab98-9f56fc345116)
![Image](https://github.com/user-attachments/assets/0829e24b-58c7-47e2-ae9a-7c78cfd6d3ca)
![Image](https://github.com/user-attachments/assets/005ace58-d7fb-47f3-815a-03adeb3555e2)
![Image](https://github.com/user-attachments/assets/a8454e3f-cf5d-4e53-8a0d-0e0f081f2801)
![Image](https://github.com/user-attachments/assets/b5d52e6f-7012-4e46-bdf0-dc65c9aaa832)
![Image](https://github.com/user-attachments/assets/23e18cda-a267-4b57-b357-a117d31af396)
![Image](https://github.com/user-attachments/assets/04503b1a-6d50-4008-b784-57784410e172)
![Image](https://github.com/user-attachments/assets/08e2a946-0228-447d-a3a4-05cec52f7736)
![Image](https://github.com/user-attachments/assets/547d99b5-49e9-4edc-a325-05d79c5f1d1b)
![Image](https://github.com/user-attachments/assets/f4e113fd-4aec-43b5-a95f-df86d3aaeb80)
![Image](https://github.com/user-attachments/assets/9b8356c5-78a5-4efa-9910-68e9e03b566e)
![Image](https://github.com/user-attachments/assets/6d83a243-7671-4736-b66c-4cecb147cd47)
![Image](https://github.com/user-attachments/assets/55451877-ecf5-4fdb-9917-26f7659df409)
![Image](https://github.com/user-attachments/assets/667aad1b-f696-4293-828f-03b915108b7f)
![Image](https://github.com/user-attachments/assets/bc3a8dfc-3ea7-4925-9a67-d118946907ce)
![Image](https://github.com/user-attachments/assets/74a439dc-f2fb-4d7d-976e-7278f2f92ca4)
![Image](https://github.com/user-attachments/assets/0ef96f1c-33af-4c21-ad14-9a8b242a56c4)
![Image](https://github.com/user-attachments/assets/23055771-06fb-45ae-8565-feb6566a049c)
![Image](https://github.com/user-attachments/assets/9a461f46-e43f-4635-a619-5e2649280002)
![Image](https://github.com/user-attachments/assets/85af0d43-5f36-408c-8611-a4f6fc5b6459)
![Image](https://github.com/user-attachments/assets/d71adc25-fff0-4f27-a4db-5f61b969bf3e)
![Image](https://github.com/user-attachments/assets/402c344e-35da-4dd5-a5f3-6297869d7392)
![Image](https://github.com/user-attachments/assets/5aacff1e-30d5-461a-894d-f907f11a5994)

<br />

# 시연 영상
[시연 영상 1](https://youtu.be/lgLnvRLSWRs)
<br />
[시연 영상 2](https://youtu.be/ILNLP22bFAo)

<br/>

# 준비 사항
- 데이터베이스 컨테이너와 디플로이먼트, 서비스가 필요합니다.
  - 각 컨테이너와 디플로이먼트에는 MYSQL_ROOT_PASSWORD=cancanii!와 MYSQL_DATABASE=canIuseit_db로 설정되어야 합니다.
  - 또 컨테이너는 Jenkinsfile에 명시된 NETWORK_NAME에 속해야 합니다.
  - 컨테이너와 서비스 이름은 반드시 db로 설정해주세요.
  - **위의 사항들을 지킨 명령어와 매니페스트를 작성했으니 미리 실행하고 코드를 수정해주세요.**
 
- Jenkins credential을 미리 설정해야 합니다.
  - Secret file에서 ID를 MY_ENV_FILE로 환경변수 파일을 올려주세요.
  - **이때 환경변수 중, DATABASE_HOST=db로 설정되어야 합니다.**
  - Google Kubernetes Plugin 설치 후 Google Service Account from private key에서 name을 mygke로 설정해주세요.


<br/>

## 데이터베이스 컨테이너 실행 명령어
[NETWORK_NAME]엔 Jenkinsfile에 명시한 네트워크 이름을 적으면 됩니다.
`docker run --name db --network [NETWORK_NAME] -e MYSQL_ROOT_PASSWORD=cancanii! -e MYSQL_DATABASE=canIuseit_db -p 3306:3306 mysql:8`

<br/>

## 데이터베이스 디플로이먼트와 서비스 매니페스트
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-deployment
  labels:
    app: mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql-container
        image: mysql:8
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "cancanii!"
        - name: MYSQL_DATABASE
          value: "canIuseit_db"
        ports:
        - containerPort: 3306
---
apiVersion: v1
kind: Service
metadata:
  name: db
  labels:
    app: mysql
spec:
  ports:
  - port: 3306
    targetPort: 3306
  selector:
    app: mysql
  clusterIP: None
```
=======
